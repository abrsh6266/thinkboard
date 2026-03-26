import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getUserFromRequest } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const boardId = req.nextUrl.searchParams.get("boardId");
  if (!boardId)
    return NextResponse.json({ error: "boardId required" }, { status: 400 });

  const nodes = await prisma.node.findMany({
    where: { boardId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(nodes);
}

export async function POST(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { boardId, type, content, positionX, positionY } = await req.json();
  const node = await prisma.node.create({
    data: { boardId, type, content, positionX, positionY, createdBy: userId },
  });
  return NextResponse.json(node);
}
