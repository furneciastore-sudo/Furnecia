import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { paymentInputSchema } from "@/lib/schemas";
import {
  calcCustomerPending,
  calcVendorPending,
  derivePaymentStatus,
  deriveVendorPaymentStatus,
} from "@/lib/calculations";

/** Record a customer or vendor payment against an order. Amount paid,
 * pending balance and payment status all recalculate automatically —
 * nothing here is typed in by hand except the amount received. */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const orderId = Number(params.id);
  const body = await req.json();
  const parsed = paymentInputSchema.safeParse({ ...body, orderId });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { type, amount, date, method, notes } = parsed.data;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const result = await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: { orderId, type, amount, date: new Date(date), method: method || null, notes: notes || null },
    });

    if (type === "customer") {
      const amountPaid = Math.max(0, order.amountPaid + amount);
      const customerPending = calcCustomerPending(order.customerTotal, amountPaid);
      const paymentStatus = derivePaymentStatus(order.customerTotal, amountPaid, order.paymentStatus);
      return tx.order.update({
        where: { id: orderId },
        data: {
          amountPaid,
          customerPending,
          paymentStatus,
          paymentDate: new Date(date),
          paymentMethod: method || order.paymentMethod,
        },
        include: { vendor: true },
      });
    }

    const vendorPaid = Math.max(0, order.vendorPaid + amount);
    const vendorPending = calcVendorPending(order.vendorTotalCost, vendorPaid);
    const vendorPaymentStatus = deriveVendorPaymentStatus(order.vendorTotalCost, vendorPaid);
    return tx.order.update({
      where: { id: orderId },
      data: {
        vendorPaid,
        vendorPending,
        vendorPaymentStatus,
        vendorPaymentDate: new Date(date),
      },
      include: { vendor: true },
    });
  });

  return NextResponse.json({ order: result });
}
