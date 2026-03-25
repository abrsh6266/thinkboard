import { create } from "zustand";
import { BoardNode, BoardEdge, PresenceUser } from "@/types";

interface BoardState {
  nodes: BoardNode[];
  edges: BoardEdge[];
  onlineUsers: PresenceUser[];

  setNodes: (nodes: BoardNode[]) => void;
  upsertNode: (node: BoardNode) => void;
  updateNode: (id: string, updates: Partial<BoardNode>) => void;
  removeNode: (id: string) => void;

  setEdges: (edges: BoardEdge[]) => void;
  upsertEdge: (edge: BoardEdge) => void;
  removeEdge: (id: string) => void;

  setOnlineUsers: (users: PresenceUser[]) => void;
  reset: () => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  nodes: [],
  edges: [],
  onlineUsers: [],

  setNodes: (nodes) => set({ nodes }),
  upsertNode: (node) =>
    set((s) => {
      const exists = s.nodes.find((n) => n.id === node.id);
      if (exists)
        return {
          nodes: s.nodes.map((n) => (n.id === node.id ? { ...n, ...node } : n)),
        };
      return { nodes: [...s.nodes, node] };
    }),
  updateNode: (id, updates) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),
  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter(
        (e) => e.sourceNodeId !== id && e.targetNodeId !== id,
      ),
    })),

  setEdges: (edges) => set({ edges }),
  upsertEdge: (edge) =>
    set((s) => {
      const exists = s.edges.find((e) => e.id === edge.id);
      if (exists)
        return { edges: s.edges.map((e) => (e.id === edge.id ? edge : e)) };
      return { edges: [...s.edges, edge] };
    }),
  removeEdge: (id) =>
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) })),

  setOnlineUsers: (users) => set({ onlineUsers: users }),
  reset: () => set({ nodes: [], edges: [], onlineUsers: [] }),
}));
