import { prisma } from "@/lib/db";
import { resolveDateRange, type DateRangeKey } from "@/lib/dateRanges";
import { startOfDay, endOfDay } from "date-fns";

export async function getDashboardStats(
  rangeKey: DateRangeKey,
  custom?: { from?: string; to?: string }
) {
  const { from, to } = resolveDateRange(rangeKey, custom);
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const baseWhere = { isArchived: false } as const;
  const inRange = { gte: from, lte: to };

  const [
    todaysOrders,
    todaysDeliveries,
    pendingDeliveries,
    deliveredInRange,
    cancelledInRange,
    ordersInRange,
    customerPendingAll,
    vendorPendingAll,
  ] = await Promise.all([
    prisma.order.count({ where: { ...baseWhere, bookingDate: { gte: todayStart, lte: todayEnd } } }),
    prisma.order.count({
      where: { ...baseWhere, deliveryDateExpected: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.order.count({
      where: { ...baseWhere, deliveryStatus: { notIn: ["Delivered", "Cancelled", "Returned"] } },
    }),
    prisma.order.count({ where: { ...baseWhere, deliveryStatus: "Delivered", bookingDate: inRange } }),
    prisma.order.count({ where: { ...baseWhere, deliveryStatus: "Cancelled", bookingDate: inRange } }),
    prisma.order.findMany({
      where: { ...baseWhere, bookingDate: inRange },
      select: { customerTotal: true, vendorTotalCost: true, netProfit: true },
    }),
    prisma.order.aggregate({ where: baseWhere, _sum: { customerPending: true } }),
    prisma.order.aggregate({ where: baseWhere, _sum: { vendorPending: true } }),
  ]);

  const totals = ordersInRange.reduce(
    (acc, o) => {
      acc.revenue += o.customerTotal;
      acc.vendorCost += o.vendorTotalCost;
      acc.profit += o.netProfit;
      return acc;
    },
    { revenue: 0, vendorCost: 0, profit: 0 }
  );

  return {
    range: { key: rangeKey, from, to },
    cards: {
      todaysOrders,
      todaysDeliveries,
      pendingDeliveries,
      deliveredOrders: deliveredInRange,
      cancelledOrders: cancelledInRange,
      customerPaymentsPending: customerPendingAll._sum.customerPending ?? 0,
      vendorPaymentsPending: vendorPendingAll._sum.vendorPending ?? 0,
      totalRevenue: totals.revenue,
      totalVendorCost: totals.vendorCost,
      totalProfit: totals.profit,
      ordersInRange: ordersInRange.length,
    },
  };
}
