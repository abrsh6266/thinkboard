/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, email, name } = await req.json();
    const user = await prisma.user.upsert({
      where: { id },
      update: { email, name },
      create: { id, email, name },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
