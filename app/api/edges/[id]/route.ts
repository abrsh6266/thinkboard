import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getUserFromRequest } from "@/lib/supabase/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = await getUserFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.edge.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
