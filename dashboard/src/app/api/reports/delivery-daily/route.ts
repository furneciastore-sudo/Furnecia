import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Today's Delivery Report — every order due today, grouped by vendor. */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59`);

  const orders = await prisma.order.findMany({
    where: { isArchived: false, deliveryDateExpected: { gte: start, lte: end } },
    include: { vendor: true },
    orderBy: { vendorId: "asc" },
  });

  const grouped = new Map<string, typeof orders>();
  for (const o of orders) {
    const key = o.vendor?.name ?? "No Vendor";
    if (!grouped.has(key)) grouped.set(key, [] as typeof orders);
    grouped.get(key)!.push(o);
  }

  return NextResponse.json({
    date,
    groups: Array.from(grouped.entries()).map(([vendor, items]) => ({ vendor, orders: items })),
  });
}
