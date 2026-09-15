import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveDateRange, type DateRangeKey } from "@/lib/dateRanges";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const rangeKey = (sp.get("range") as DateRangeKey) ?? "thisMonth";
  const { from, to } = resolveDateRange(rangeKey, {
    from: sp.get("from") ?? undefined,
    to: sp.get("to") ?? undefined,
  });

  const orders = await prisma.order.findMany({
    where: { isArchived: false, bookingDate: { gte: from, lte: to } },
    select: {
      customerTotal: true,
      amountPaid: true,
      customerPending: true,
      vendorTotalCost: true,
      vendorPaid: true,
      vendorPending: true,
      commissionAmount: true,
    },
  });

  const totals = orders.reduce(
    (acc, o) => {
      acc.customerTotal += o.customerTotal;
      acc.customerReceived += o.amountPaid;
      acc.customerPending += o.customerPending;
      acc.vendorTotal += o.vendorTotalCost;
      acc.vendorPaid += o.vendorPaid;
      acc.vendorPending += o.vendorPending;
      acc.commission += o.commissionAmount;
      return acc;
    },
    {
      customerTotal: 0,
      customerReceived: 0,
      customerPending: 0,
      vendorTotal: 0,
      vendorPaid: 0,
      vendorPending: 0,
      commission: 0,
    }
  );

  return NextResponse.json({ range: { from, to }, totals });
}
