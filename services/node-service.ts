import api from "./api";
import { BoardNode, NodeType } from "@/types";

export const nodeService = {
  async list(boardId: string): Promise<BoardNode[]> {
    const { data } = await api.get(`/nodes?boardId=${boardId}`);
    return data;
  },
  async create(params: {
    boardId: string;
    type: NodeType;
    content: string;
    positionX: number;
    positionY: number;
  }): Promise<BoardNode> {
    const { data } = await api.post("/nodes", params);
    return data;
  },
  async update(
    id: string,
    updates: Partial<
      Pick<BoardNode, "content" | "positionX" | "positionY" | "type">
    >,
  ): Promise<BoardNode> {
    const { data } = await api.patch(`/nodes/${id}`, updates);
    return data;
  },
  async remove(id: string) {
    await api.delete(`/nodes/${id}`);
  },
};
