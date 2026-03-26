"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  LogOut,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { Board, PresenceUser } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useBoardStore } from "@/store/board-store";
import { useUIStore } from "@/store/ui-store";
import { authService } from "@/services/auth-service";

interface BoardTopBarProps {
  board: Board | undefined;
}

export function BoardTopBar({ board }: BoardTopBarProps) {
  const router = useRouter();
  const onlineUsers = useBoardStore((s) => s.onlineUsers);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center px-4 gap-3 z-30 relative"
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
      >
        {sidebarOpen ? (
          <PanelLeftClose size={18} />
        ) : (
          <PanelLeftOpen size={18} />
        )}
      </button>

      <button
        onClick={() => router.push("/dashboard")}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-gray-900 truncate">
          {board?.name || "Loading…"}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 py-1.5">
          <Users size={14} className="text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">
            {onlineUsers.length} online
          </span>
        </div>
        <div className="flex -space-x-2">
          {onlineUsers.slice(0, 5).map((u) => (
            <Avatar key={u.userId} name={u.name} color={u.color} size="sm" />
          ))}
          {onlineUsers.length > 5 && (
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
              +{onlineUsers.length - 5}
            </div>
          )}
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await authService.signOut();
            router.push("/login");
          }}
        >
          <LogOut size={14} />
        </Button>
      </div>
    </motion.header>
  );
}
