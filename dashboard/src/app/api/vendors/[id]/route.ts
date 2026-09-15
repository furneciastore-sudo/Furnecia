import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { vendorInputSchema } from "@/lib/schemas";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: Number(params.id) },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  return NextResponse.json({ vendor });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = vendorInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const vendor = await prisma.vendor.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json({ vendor });
}

/** Vendors with existing orders are deactivated instead of deleted, so
 * historical orders keep a valid vendor reference. An unused vendor is
 * removed outright. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const orderCount = await prisma.order.count({ where: { vendorId: id } });
  if (orderCount > 0) {
    const vendor = await prisma.vendor.update({ where: { id }, data: { status: "Inactive" } });
    return NextResponse.json({ vendor, deactivatedOnly: true });
  }
  await prisma.vendor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
