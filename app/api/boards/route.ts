import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getUserFromRequest } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const boards = await prisma.board.findMany({
    where: { members: { some: { userId } } },
    include: {
      creator: { select: { id: true, email: true, name: true } },
      _count: { select: { members: true, nodes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(boards);
}

export async function POST(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  const board = await prisma.board.create({
    data: {
      name,
      createdBy: userId,
      members: { create: { userId } },
    },
    include: {
      creator: { select: { id: true, email: true, name: true } },
      _count: { select: { members: true, nodes: true } },
    },
  });
  return NextResponse.json(board);
}
