import { nodeService } from "@/services/node-service";
import { useBoardStore } from "@/store/board-store";
import { NodeType } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useNodes(boardId: string) {
  const setNodes = useBoardStore((state) => state.setNodes);
  return useQuery({
    queryKey: ["nodes", boardId],
    queryFn: async () => {
      const nodes = await nodeService.list(boardId);
      setNodes(nodes);
      return nodes;
    },
    enabled: !!boardId,
  });
}

export function useCreateNode() {
  const upsertNode = useBoardStore((state) => state.upsertNode);
  return useMutation({
    mutationFn: nodeService.create,
    onSuccess: (node) => {
      upsertNode(node);
    },
  });
}

export function useUpdateNode() {
  const updateNode = useBoardStore((state) => state.updateNode);
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<{
        content: string;
        positionX: number;
        positionY: number;
        type: NodeType;
      }>;
    }) => nodeService.update(id, updates),
    onSuccess: (node) => {
      updateNode(node.id, node);
    },
  });
}

export function useDeleteNode() {
  const removeNode = useBoardStore((state) => state.removeNode);
  return useMutation({
    mutationFn: (id: string) => nodeService.remove(id),
    onMutate: (id) => {
      removeNode(id);
    },
  });
}
