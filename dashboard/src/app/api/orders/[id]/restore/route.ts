import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data: { isArchived: false },
  });
  return NextResponse.json({ order });
}
