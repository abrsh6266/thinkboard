"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Layout, Users, Shapes, Trash2, Copy } from "lucide-react";
import { useBoards, useDeleteBoard } from "@/hooks/useBoards";
import { Board } from "@/types";
import { Button } from "@/components/ui/Button";

function BoardCard({ board }: { board: Board }) {
  const router = useRouter();
  const deleteMutation = useDeleteBoard();

  const copyId = () => {
    navigator.clipboard.writeText(board.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 p-5 cursor-pointer"
      onClick={() => router.push(`/board/${board.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Layout size={20} className="text-indigo-600" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyId();
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            title="Copy board ID"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteMutation.mutate(board.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
            title="Delete board"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 truncate">
        {board.name}
      </h3>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Users size={12} /> {board._count?.members || 0}
        </span>
        <span className="flex items-center gap-1">
          <Shapes size={12} /> {board._count?.nodes || 0} nodes
        </span>
      </div>
    </motion.div>
  );
}

export function BoardList() {
  const { data: boards, isLoading } = useBoards();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-36" />
        ))}
      </div>
    );
  }

  if (!boards?.length) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Layout size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">No boards yet</p>
        <p className="text-gray-400 text-sm mt-1">Create one to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards.map((b) => (
        <BoardCard key={b.id} board={b} />
      ))}
    </div>
  );
}
