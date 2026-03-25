/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef, useEffect, memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { Trash2, Lightbulb, GitBranch, CheckSquare } from "lucide-react";
import { NODE_COLORS } from "@/lib/utils";
import { NodeType } from "@/types";

interface CustomNodeData {
  content: string;
  nodeType: NodeType;
  onContentChange: (content: string) => void;
  onDelete: () => void;
}

const ICONS: Record<NodeType, any> = {
  idea: Lightbulb,
  decision: GitBranch,
  task: CheckSquare,
};

function CustomNodeComponent({ data, selected }: NodeProps<CustomNodeData>) {
  const { content, nodeType, onContentChange, onDelete } = data;
  const [editing, setEditing] = useState(!content);
  const [text, setText] = useState(content);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const colors = NODE_COLORS[nodeType];
  const Icon = ICONS[nodeType];

  useEffect(() => {
    setText(content);
  }, [content]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    if (text !== content) {
      onContentChange(text);
    }
  }, [text, content, onContentChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleBlur();
      }
      if (e.key === "Escape") {
        setText(content);
        setEditing(false);
      }
    },
    [handleBlur, content],
  );

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        relative min-w-48 max-w-xs rounded-2xl border-2 shadow-lg transition-shadow
        ${colors.bg} ${colors.border}
        ${selected ? `ring-2 ${colors.ring} ring-offset-2 shadow-xl` : "hover:shadow-xl"}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-6 h-6 rounded-lg ${colors.accent} flex items-center justify-center`}
          >
            <Icon size={13} className="text-white" />
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}
          >
            {colors.label}
          </span>
          <div className="ml-auto flex gap-0.5 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {editing ? (
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={2}
            className="w-full bg-transparent border-none outline-none text-sm text-gray-800 resize-none placeholder-gray-400"
            placeholder="Type something…"
          />
        ) : (
          <p
            className="text-sm text-gray-800 cursor-text min-h-8 whitespace-pre-wrap break-words"
            onDoubleClick={() => setEditing(true)}
          >
            {content || "Double-click to edit…"}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export const IdeaNode = memo(CustomNodeComponent);
export const DecisionNode = memo(CustomNodeComponent);
export const TaskNode = memo(CustomNodeComponent);
