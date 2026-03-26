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

  const edges = await prisma.edge.findMany({ where: { boardId } });
  return NextResponse.json(edges);
}

export async function POST(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { boardId, sourceNodeId, targetNodeId, label } = await req.json();
  const edge = await prisma.edge.create({
    data: { boardId, sourceNodeId, targetNodeId, label },
  });
  return NextResponse.json(edge);
}
