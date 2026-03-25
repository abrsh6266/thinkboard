"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBoardStore } from "@/store/board-store";
import { BoardNode, BoardEdge } from "@/types";

export function useRealtime(boardId: string) {
  const { upsertNode, updateNode, removeNode, upsertEdge, removeEdge } =
    useBoardStore();

  useEffect(() => {
    if (!boardId) return;

    const channel = supabase
      .channel(`board-realtime-${boardId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Node",
          filter: `boardId=eq.${boardId}`,
        },
        (payload) => upsertNode(payload.new as BoardNode),
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Node",
          filter: `boardId=eq.${boardId}`,
        },
        (payload) => {
          const n = payload.new as BoardNode;
          updateNode(n.id, n);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "Node",
          filter: `boardId=eq.${boardId}`,
        },
        (payload) => removeNode((payload.old as BoardNode).id),
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Edge",
          filter: `boardId=eq.${boardId}`,
        },
        (payload) => upsertEdge(payload.new as BoardEdge),
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "Edge",
          filter: `boardId=eq.${boardId}`,
        },
        (payload) => removeEdge((payload.old as BoardEdge).id),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, upsertNode, updateNode, removeNode, upsertEdge, removeEdge]);
}
