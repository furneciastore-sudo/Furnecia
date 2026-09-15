import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Daily Vendor Report — pick a date + vendor, get everything needed to
 * send that vendor their delivery sheet for the day. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const date = sp.get("date");
  const vendorId = sp.get("vendorId");
  if (!date) return NextResponse.json({ error: "date is required" }, { status: 400 });

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59`);

  const orders = await prisma.order.findMany({
    where: {
      isArchived: false,
      deliveryDateExpected: { gte: start, lte: end },
      ...(vendorId ? { vendorId: Number(vendorId) } : {}),
    },
    include: { vendor: true },
    orderBy: { vendorId: "asc" },
  });

  return NextResponse.json({ orders, date });
}
