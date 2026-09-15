import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { productInputSchema } from "@/lib/schemas";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { code, ...rest } = parsed.data;
  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data: { ...rest, code: code || null },
    include: { defaultVendor: true },
  });
  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.product.update({ where: { id: Number(params.id) }, data: { status: "Inactive" } });
  return NextResponse.json({ ok: true });
}
