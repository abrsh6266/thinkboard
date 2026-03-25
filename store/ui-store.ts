import { NodeType } from "@/types";
import { create } from "zustand";

interface UIState {
  selectedNodeId: string | null;
  addNodeMenuOpen: boolean;
  createBoardOpen: boolean;
  joinBoardOpen: boolean;
  activeLayers: NodeType[];
  sidebarOpen: boolean;

  setSelectedNode: (id: string | null) => void;
  setAddNodeMenuOpen: (v: boolean) => void;
  setCreateBoardOpen: (v: boolean) => void;
  setJoinBoardOpen: (v: boolean) => void;
  toggleLayer: (layer: NodeType) => void;
  showAllLayers: () => void;
  setSidebarOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedNodeId: null,
  addNodeMenuOpen: false,
  createBoardOpen: false,
  joinBoardOpen: false,
  activeLayers: ["idea", "decision", "task"],
  sidebarOpen: true,

  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setAddNodeMenuOpen: (v) => set({ addNodeMenuOpen: v }),
  setCreateBoardOpen: (v) => set({ createBoardOpen: v }),
  setJoinBoardOpen: (v) => set({ joinBoardOpen: v }),
  toggleLayer: (layer) =>
    set((s) => ({
      activeLayers: s.activeLayers.includes(layer)
        ? s.activeLayers.filter((l) => l !== layer)
        : [...s.activeLayers, layer],
    })),
  showAllLayers: () => set({ activeLayers: ["idea", "decision", "task"] }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
}));
