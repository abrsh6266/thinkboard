import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getUserFromRequest } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const board = await prisma.board.findUnique({ where: { id: params.id } });
  if (!board)
    return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const member = await prisma.boardMember.upsert({
    where: { boardId_userId: { boardId: params.id, userId } },
    update: {},
    create: { boardId: params.id, userId },
  });
  return NextResponse.json(member);
}
