/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  GitBranch,
  CheckSquare,
  Layers,
  Eye,
  EyeOff,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useBoardStore } from "@/store/board-store";
import { NodeType } from "@/types";
import { NODE_COLORS, cn } from "@/lib/utils";

const LAYER_ITEMS: { type: NodeType; icon: any }[] = [
  { type: "idea", icon: Lightbulb },
  { type: "decision", icon: GitBranch },
  { type: "task", icon: CheckSquare },
];

export function BoardSidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const activeLayers = useUIStore((s) => s.activeLayers);
  const toggleLayer = useUIStore((s) => s.toggleLayer);
  const showAllLayers = useUIStore((s) => s.showAllLayers);
  const nodes = useBoardStore((s) => s.nodes);

  const allActive = activeLayers.length === 3;

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white/80 backdrop-blur-xl border-r border-gray-100 overflow-hidden flex-shrink-0 z-20"
        >
          <div className="p-4 w-60">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={16} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">
                Logic Layers
              </h2>
            </div>

            <button
              onClick={showAllLayers}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium mb-2 transition-colors",
                allActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-50",
              )}
            >
              <Eye size={14} /> Show All
            </button>

            <div className="space-y-1">
              {LAYER_ITEMS.map(({ type, icon: Icon }) => {
                const active = activeLayers.includes(type);
                const colors = NODE_COLORS[type];
                const count = nodes.filter((n) => n.type === type).length;

                return (
                  <button
                    key={type}
                    onClick={() => toggleLayer(type)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                      active
                        ? `${colors.light} ${colors.text} font-medium`
                        : "text-gray-400 hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center",
                        active ? colors.accent : "bg-gray-200",
                      )}
                    >
                      <Icon size={13} className="text-white" />
                    </div>
                    <span className="flex-1 text-left">{colors.label}s</span>
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-md",
                        active ? colors.light : "bg-gray-100 text-gray-400",
                      )}
                    >
                      {count}
                    </span>
                    {active ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Total nodes</p>
              <p className="text-2xl font-bold text-gray-900">{nodes.length}</p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
