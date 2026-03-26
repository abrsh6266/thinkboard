/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Lightbulb, GitBranch, CheckSquare } from "lucide-react";
import { NodeType } from "@/types";

interface AddNodeButtonProps {
  onAdd: (type: NodeType) => void;
}

const items: { type: NodeType; icon: any; label: string; color: string }[] = [
  {
    type: "idea",
    icon: Lightbulb,
    label: "Idea",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    type: "decision",
    icon: GitBranch,
    label: "Decision",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    type: "task",
    icon: CheckSquare,
    label: "Task",
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
];

export function AddNodeButton({ onAdd }: AddNodeButtonProps) {
  const [open, setOpen] = useState(false);

  const handleAdd = useCallback(
    (type: NodeType) => {
      onAdd(type);
      setOpen(false);
    },
    [onAdd],
  );

  return (
    <div className="absolute bottom-6 right-6 z-20 flex flex-col-reverse items-end gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((p) => !p)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:bg-indigo-700 transition-colors"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus size={24} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open &&
          items.map((item, i) => (
            <motion.button
              key={item.type}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{
                delay: i * 0.05,
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
              onClick={() => handleAdd(item.type)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg ${item.color} transition-colors`}
            >
              <item.icon size={16} />
              {item.label}
            </motion.button>
          ))}
      </AnimatePresence>
    </div>
  );
}
