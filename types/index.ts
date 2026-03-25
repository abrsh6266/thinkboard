export type NodeType = "idea" | "decision" | "task";

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
}

export interface Board {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  creator?: AppUser;
  members?: { id: string; userId: string; user?: AppUser }[];
  _count?: { members: number; nodes: number };
}

export interface BoardNode {
  id: string;
  boardId: string;
  type: NodeType;
  content: string;
  positionX: number;
  positionY: number;
  createdBy: string;
  createdAt: string;
}

export interface BoardEdge {
  id: string;
  boardId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string | null;
}

export interface PresenceUser {
  userId: string;
  email: string;
  name: string | null;
  color: string;
}
