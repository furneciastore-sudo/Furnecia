import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { vendorInputSchema } from "@/lib/schemas";
import { getVendorsWithStats } from "@/lib/vendors";

export async function GET() {
  const vendors = await getVendorsWithStats();
  return NextResponse.json({ vendors });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = vendorInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const vendor = await prisma.vendor.create({ data: parsed.data });
  return NextResponse.json({ vendor }, { status: 201 });
}
