import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: { status?: string } = {};
  if (body.status === "Pending" || body.status === "Completed") data.status = body.status;
  const reminder = await prisma.reminder.update({ where: { id: Number(params.id) }, data });
  return NextResponse.json({ reminder });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.reminder.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
