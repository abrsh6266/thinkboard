import api from "./api";
import { BoardEdge } from "@/types";

export const edgeService = {
  async list(boardId: string): Promise<BoardEdge[]> {
    const { data } = await api.get(`/edges?boardId=${boardId}`);
    return data;
  },
  async create(params: {
    boardId: string;
    sourceNodeId: string;
    targetNodeId: string;
    label?: string;
  }): Promise<BoardEdge> {
    const { data } = await api.post("/edges", params);
    return data;
  },
  async remove(id: string) {
    await api.delete(`/edges/${id}`);
  },
};
