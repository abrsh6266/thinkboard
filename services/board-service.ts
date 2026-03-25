import api from "./api";
import { Board } from "@/types";

export const boardService = {
  async list(): Promise<Board[]> {
    const { data } = await api.get("/boards");
    return data;
  },
  async get(id: string): Promise<Board> {
    const { data } = await api.get(`/boards/${id}`);
    return data;
  },
  async create(name: string): Promise<Board> {
    const { data } = await api.post("/boards", { name });
    return data;
  },
  async join(boardId: string) {
    const { data } = await api.post(`/boards/${boardId}/join`);
    return data;
  },
  async remove(id: string) {
    await api.delete(`/boards/${id}`);
  },
};
