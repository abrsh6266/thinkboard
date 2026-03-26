import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getUserFromRequest } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const board = await prisma.board.findUnique({ where: { id } });
  if (!board)
    return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const member = await prisma.boardMember.upsert({
    where: { boardId_userId: { boardId: id, userId } },
    update: {},
    create: { boardId: id, userId },
  });
  return NextResponse.json(member);
}
