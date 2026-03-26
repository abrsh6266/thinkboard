import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getUserFromRequest } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const board = await prisma.board.findUnique({
    where: { id: params.id },
    include: {
      creator: { select: { id: true, email: true, name: true } },
      members: {
        include: { user: { select: { id: true, email: true, name: true } } },
      },
      _count: { select: { members: true, nodes: true } },
    },
  });
  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(board);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const board = await prisma.board.findUnique({ where: { id: params.id } });
  if (!board || board.createdBy !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.board.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
