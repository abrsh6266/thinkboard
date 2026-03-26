"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Link2, Layers, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Button } from "@/components/ui/Button";
import { BoardList } from "@/features/board/BoardList";
import { CreateBoardModal } from "@/features/board/CreateBoardModal";
import { useUIStore } from "@/store/ui-store";
import { authService } from "@/services/auth-service";
import { JoinBoardModal } from "@/features/board/JoinNoardModal";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const setCreateBoardOpen = useUIStore((s) => s.setCreateBoardOpen);
  const setJoinBoardOpen = useUIStore((s) => s.setJoinBoardOpen);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Layers className="text-white" size={18} />
          </div>
          <span className="text-lg font-bold text-gray-900">ThinkBoard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await authService.signOut();
              router.push("/login");
            }}
          >
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Boards</h1>
              <p className="text-gray-500 text-sm mt-1">
                Create or join a board to start collaborating
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setJoinBoardOpen(true)}
              >
                <Link2 size={15} /> Join Board
              </Button>
              <Button onClick={() => setCreateBoardOpen(true)}>
                <Plus size={15} /> New Board
              </Button>
            </div>
          </div>

          <BoardList />
        </motion.div>
      </main>

      <CreateBoardModal />
      <JoinBoardModal />
    </div>
  );
}
