import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNo } from "@/lib/orderId";

/** Duplicate Order — new Order ID, same customer/product/vendor info, but
 * resets payments/delivery so the original order is never overwritten. */
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const source = await prisma.order.findUnique({ where: { id: Number(params.id) } });
  if (!source) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const orderNo = await generateOrderNo(new Date());

  const {
    id: _id,
    orderNo: _orderNo,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...rest
  } = source;

  const order = await prisma.order.create({
    data: {
      ...rest,
      orderNo,
      bookingDate: new Date(),
      deliveryDateActual: null,
      amountPaid: 0,
      customerPending: rest.customerTotal,
      paymentStatus: "Not Paid",
      paymentDate: null,
      vendorPaid: 0,
      vendorPending: rest.vendorTotalCost,
      vendorPaymentStatus: "Not Paid",
      vendorPaymentDate: null,
      deliveryStatus: "New Order",
      isArchived: false,
    },
    include: { vendor: true },
  });

  return NextResponse.json({ order }, { status: 201 });
}
