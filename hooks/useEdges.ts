import { edgeService } from "@/services/edge-service";
import { useBoardStore } from "@/store/board-store";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useEdges(boardId: string) {
  const setEdges = useBoardStore((state) => state.setEdges);
  return useQuery({
    queryKey: ["edges", boardId],
    queryFn: async () => {
      const edges = await edgeService.list(boardId);
      setEdges(edges);
      return edges;
    },
    enabled: !!boardId,
  });
}

export function useCreateEdge() {
  const upsertEdge = useBoardStore((state) => state.upsertEdge);
  return useMutation({
    mutationFn: edgeService.create,
    onSuccess: (edge) => {
      upsertEdge(edge);
    },
  });
}

export function useDeleteEdge() {
  const removeEdge = useBoardStore((state) => state.removeEdge);
  return useMutation({
    mutationFn: (id: string) => edgeService.remove(id),
    onMutate: (id) => {
      removeEdge(id);
    },
  });
}
