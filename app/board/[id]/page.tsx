"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useBoard } from "@/hooks/useBoards";
import { useBoardStore } from "@/store/board-store";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { BoardTopBar } from "@/features/nodes/BoardTopBar";
import { BoardSidebar } from "@/features/nodes/BoardSidebar";
import { BoardCanvas } from "@/features/nodes/BoardCanvas";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: board, isLoading } = useBoard(boardId);
  const reset = useBoardStore((s) => s.reset);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    return () => reset();
  }, [boardId, reset]);

  if (authLoading || isLoading || !user) return <LoadingScreen />;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <BoardTopBar board={board} />
      <div className="flex flex-1 overflow-hidden">
        <BoardSidebar />
        <BoardCanvas boardId={boardId} />
      </div>
    </div>
  );
}
