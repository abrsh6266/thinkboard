import { prisma } from "@/lib/prisma/client";
import { getUserFromRequest } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  },
) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updates = await req.json();
  const node = await prisma.node.update({
    where: { id: params.id },
    data: updates,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.node.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
