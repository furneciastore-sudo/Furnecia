import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { orderInputSchema } from "@/lib/schemas";
import { buildOrderData } from "@/lib/orderData";
import { generateOrderNo } from "@/lib/orderId";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const search = sp.get("search")?.trim();
  const vendorId = sp.get("vendorId");
  const deliveryStatus = sp.get("deliveryStatus");
  const paymentStatus = sp.get("paymentStatus");
  const floor = sp.get("floor");
  const fitting = sp.get("fitting"); // "yes" | "no"
  const lift = sp.get("lift"); // "yes" | "no"
  const customerPendingOnly = sp.get("customerPendingOnly") === "1";
  const vendorPendingOnly = sp.get("vendorPendingOnly") === "1";
  const archived = sp.get("archived") === "1";
  const dateField = sp.get("dateField") === "booking" ? "bookingDate" : "deliveryDateExpected";
  const from = sp.get("from");
  const to = sp.get("to");

  const where: Prisma.OrderWhereInput = { isArchived: archived };

  if (search) {
    where.OR = [
      { customerName: { contains: search } },
      { contact: { contains: search } },
      { orderNo: { contains: search } },
      { productName: { contains: search } },
      { postcode: { contains: search } },
      { address: { contains: search } },
      { vendor: { name: { contains: search } } },
    ];
  }
  if (vendorId) where.vendorId = Number(vendorId);
  if (deliveryStatus) where.deliveryStatus = deliveryStatus;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (floor) where.floor = floor;
  if (fitting) where.fittingRequired = fitting === "yes";
  if (lift) where.liftAvailable = lift === "yes";
  if (customerPendingOnly) where.customerPending = { gt: 0 };
  if (vendorPendingOnly) where.vendorPending = { gt: 0 };
  if (from || to) {
    where[dateField] = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(`${to}T23:59:59`) } : {}),
    };
  }

  const orders = await prisma.order.findMany({
    where,
    include: { vendor: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await getSettings();
  const data = buildOrderData(parsed.data, settings);
  const orderNo = await generateOrderNo(new Date(parsed.data.bookingDate));

  const order = await prisma.order.create({
    data: { ...data, orderNo },
    include: { vendor: true },
  });

  return NextResponse.json({ order }, { status: 201 });
}
