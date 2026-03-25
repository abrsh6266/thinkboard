import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardService } from "@/services/board-service";

export function useBoards() {
  return useQuery({ queryKey: ["boards"], queryFn: boardService.list });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: ["board", id],
    queryFn: () => boardService.get(id),
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => boardService.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["boards"] }),
  });
}

export function useJoinBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => boardService.join(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["boards"] }),
  });
}

export function useDeleteBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => boardService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["boards"] }),
  });
}
