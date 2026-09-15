import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveDateRange, type DateRangeKey } from "@/lib/dateRanges";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const rangeKey = (sp.get("range") as DateRangeKey) ?? "thisMonth";
  const { from, to } = resolveDateRange(rangeKey, {
    from: sp.get("from") ?? undefined,
    to: sp.get("to") ?? undefined,
  });

  const orders = await prisma.order.findMany({
    where: { isArchived: false, bookingDate: { gte: from, lte: to } },
    include: { vendor: true },
  });

  const byDay = new Map<string, { revenue: number; profit: number }>();
  const byMonth = new Map<string, { revenue: number; profit: number }>();
  const byVendor = new Map<string, number>();
  const byProduct = new Map<string, number>();
  const byDeliveryStatus = new Map<string, number>();
  const byPaymentStatus = new Map<string, number>();

  let totalRevenue = 0;
  let totalVendorCost = 0;
  let totalOtherCost = 0;
  let grossProfit = 0;
  let netProfit = 0;

  for (const o of orders) {
    const dayKey = format(o.bookingDate, "yyyy-MM-dd");
    const monthKey = format(o.bookingDate, "yyyy-MM");

    const day = byDay.get(dayKey) ?? { revenue: 0, profit: 0 };
    day.revenue += o.customerTotal;
    day.profit += o.netProfit;
    byDay.set(dayKey, day);

    const month = byMonth.get(monthKey) ?? { revenue: 0, profit: 0 };
    month.revenue += o.customerTotal;
    month.profit += o.netProfit;
    byMonth.set(monthKey, month);

    const vendorName = o.vendor?.name ?? "No Vendor";
    byVendor.set(vendorName, (byVendor.get(vendorName) ?? 0) + 1);
    byProduct.set(o.productName, (byProduct.get(o.productName) ?? 0) + 1);
    byDeliveryStatus.set(o.deliveryStatus, (byDeliveryStatus.get(o.deliveryStatus) ?? 0) + 1);
    byPaymentStatus.set(o.paymentStatus, (byPaymentStatus.get(o.paymentStatus) ?? 0) + 1);

    totalRevenue += o.customerTotal;
    totalVendorCost += o.vendorTotalCost;
    totalOtherCost += o.otherBusinessCost;
    grossProfit += o.grossProfit;
    netProfit += o.netProfit;
  }

  const sortEntries = (m: Map<string, unknown>) =>
    Array.from(m.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1));

  return NextResponse.json({
    range: { from, to },
    summary: { totalRevenue, totalVendorCost, totalOtherCost, grossProfit, netProfit },
    charts: {
      revenueByDay: sortEntries(byDay).map(([date, v]) => ({ date, ...(v as object) })),
      revenueByMonth: sortEntries(byMonth).map(([month, v]) => ({ month, ...(v as object) })),
      ordersByVendor: Array.from(byVendor.entries()).map(([name, count]) => ({ name, count })),
      ordersByProduct: Array.from(byProduct.entries()).map(([name, count]) => ({ name, count })),
      deliveryStatus: Array.from(byDeliveryStatus.entries()).map(([name, count]) => ({ name, count })),
      paymentStatus: Array.from(byPaymentStatus.entries()).map(([name, count]) => ({ name, count })),
    },
  });
}
