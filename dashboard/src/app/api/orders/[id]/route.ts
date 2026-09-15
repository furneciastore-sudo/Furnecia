import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { orderInputSchema } from "@/lib/schemas";
import { buildOrderData } from "@/lib/orderData";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { vendor: true, payments: { orderBy: { date: "desc" } }, reminders: { orderBy: { date: "asc" } } },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const parsed = orderInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const settings = await getSettings();
  const data = buildOrderData(parsed.data, settings);

  // Editing recalculates every derived total automatically — the order
  // number never changes and no duplicate row is created.
  const order = await prisma.order.update({
    where: { id },
    data,
    include: { vendor: true },
  });

  return NextResponse.json({ order });
}

/** Archive (soft delete) rather than a hard delete — recoverable via /restore. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const order = await prisma.order.update({
    where: { id },
    data: { isArchived: true },
  });
  return NextResponse.json({ order });
}
