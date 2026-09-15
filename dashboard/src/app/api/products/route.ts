import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { productInputSchema } from "@/lib/schemas";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { defaultVendor: true },
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { code, ...rest } = parsed.data;
  const product = await prisma.product.create({
    data: { ...rest, code: code || null },
    include: { defaultVendor: true },
  });
  return NextResponse.json({ product }, { status: 201 });
}
