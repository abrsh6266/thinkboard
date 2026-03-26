/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Connection,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { useBoardStore } from "@/store/board-store";
import { useUIStore } from "@/store/ui-store";
import {
  useNodes,
  useCreateNode,
  useUpdateNode,
  useDeleteNode,
} from "@/hooks/useNodes";
import { useEdges, useCreateEdge } from "@/hooks/useEdges";
import { usePresence } from "@/hooks/usePresence";
import { AddNodeButton } from "@/features/nodes/AddNodeButton";
import { BoardNode, BoardEdge, NodeType } from "@/types";
import { debounce, NODE_COLORS } from "@/lib/utils";
import { useRealtime } from "@/hooks/useRealTime";
import { DecisionNode, IdeaNode, TaskNode } from "./customNodes";

const nodeTypes: NodeTypes = {
  idea: IdeaNode,
  decision: DecisionNode,
  task: TaskNode,
};

function toFlowNode(
  n: BoardNode,
  onContentChange: (id: string, content: string) => void,
  onDeleteNode: (id: string) => void,
): Node {
  return {
    id: n.id,
    type: n.type,
    position: { x: n.positionX, y: n.positionY },
    data: {
      content: n.content,
      nodeType: n.type,
      onContentChange: (content: string) => onContentChange(n.id, content),
      onDelete: () => onDeleteNode(n.id),
    },
  };
}

function toFlowEdge(e: BoardEdge): Edge {
  return {
    id: e.id,
    source: e.sourceNodeId,
    target: e.targetNodeId,
    label: e.label || undefined,
    animated: true,
    style: { stroke: "#94a3b8", strokeWidth: 2 },
    labelStyle: { fontSize: 11, fontWeight: 500 },
    labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
    labelBgPadding: [6, 3] as [number, number],
    labelBgBorderRadius: 6,
  };
}

function CanvasInner({ boardId }: { boardId: string }) {
  useNodes(boardId);
  useEdges(boardId);
  useRealtime(boardId);
  usePresence(boardId);

  const boardNodes = useBoardStore((s) => s.nodes);
  const boardEdges = useBoardStore((s) => s.edges);
  const activeLayers = useUIStore((s) => s.activeLayers);

  const { mutate: createNode } = useCreateNode();
  const { mutate: updateNode } = useUpdateNode();
  const { mutate: deleteNode } = useDeleteNode();
  const { mutate: createEdge } = useCreateEdge();

  const draggingRef = useRef<string | null>(null);
  const reactFlowInstance = useReactFlow();

  const onContentChange = useCallback(
    (id: string, content: string) => {
      updateNode({ id, updates: { content } });
    },
    [updateNode],
  );

  const onDeleteNode = useCallback(
    (id: string) => {
      deleteNode(id);
    },
    [deleteNode],
  );

  const flowNodes = useMemo(
    () =>
      boardNodes
        .filter((n) => activeLayers.includes(n.type))
        .map((n) => toFlowNode(n, onContentChange, onDeleteNode)),
    [boardNodes, activeLayers, onContentChange, onDeleteNode],
  );

  const visibleNodeIds = useMemo(
    () => new Set(flowNodes.map((n) => n.id)),
    [flowNodes],
  );

  const flowEdges = useMemo(
    () =>
      boardEdges
        .filter(
          (e) =>
            visibleNodeIds.has(e.sourceNodeId) &&
            visibleNodeIds.has(e.targetNodeId),
        )
        .map(toFlowEdge),
    [boardEdges, visibleNodeIds],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => {
    setNodes((prev) =>
      flowNodes.map((fn) => {
        const existing = prev.find((n) => n.id === fn.id);
        if (existing && draggingRef.current === fn.id) {
          return { ...existing, data: fn.data };
        }
        return fn;
      }),
    );
  }, [flowNodes, setNodes]);

  useEffect(() => {
    setEdges(flowEdges);
  }, [flowEdges, setEdges]);

  const debouncedPositionUpdate = useMemo(
    () =>
      debounce((id: string, x: number, y: number) => {
        updateNode({ id, updates: { positionX: x, positionY: y } });
      }, 300),
    [updateNode],
  );

  const onNodeDragStart = useCallback((_: any, node: Node) => {
    draggingRef.current = node.id;
  }, []);

  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      draggingRef.current = null;
      debouncedPositionUpdate(node.id, node.position.x, node.position.y);
    },
    [debouncedPositionUpdate],
  );

  const onConnect = useCallback(
    (conn: Connection) => {
      if (conn.source && conn.target) {
        createEdge({
          boardId,
          sourceNodeId: conn.source,
          targetNodeId: conn.target,
        });
      }
    },
    [boardId, createEdge],
  );

  const onEdgeDoubleClick = useCallback(
    (_: any, edge: Edge) => {
      const boardEdge = boardEdges.find((e) => e.id === edge.id);
      if (boardEdge) {
        // Delete edge on double click (could be replaced with a label editor)
        const de = useBoardStore.getState().removeEdge;
        de(edge.id);
        // fire API call too
        import("@/services/edge-service").then(({ edgeService }) =>
          edgeService.remove(edge.id),
        );
      }
    },
    [boardEdges],
  );

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const center = reactFlowInstance.project({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      createNode({
        boardId,
        type,
        content: "",
        positionX: center.x,
        positionY: center.y,
      });
    },
    [boardId, createNode, reactFlowInstance],
  );

  const minimapNodeColor = useCallback((node: Node) => {
    const c = NODE_COLORS[node.type as NodeType];
    if (node.type === "idea") return "#3b82f6";
    if (node.type === "decision") return "#8b5cf6";
    if (node.type === "task") return "#10b981";
    return "#94a3b8";
  }, []);

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-gray-50"
        snapToGrid
        snapGrid={[16, 16]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#94a3b8", strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#d1d5db"
        />
        <Controls className="!rounded-xl !border-gray-200 !shadow-lg" />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(255,255,255,0.7)"
          className="!rounded-xl !border-gray-200 !shadow-lg"
          pannable
          zoomable
        />
      </ReactFlow>
      <AddNodeButton onAdd={handleAddNode} />
    </div>
  );
}

export function BoardCanvas({ boardId }: { boardId: string }) {
  return (
    <ReactFlowProvider>
      <CanvasInner boardId={boardId} />
    </ReactFlowProvider>
  );
}
