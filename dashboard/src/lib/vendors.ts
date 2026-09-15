import { prisma } from "@/lib/db";

export async function getVendorsWithStats() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { name: "asc" },
    include: {
      orders: {
        select: {
          id: true,
          deliveryStatus: true,
          vendorTotalCost: true,
          vendorPaid: true,
          vendorPending: true,
          isArchived: true,
        },
      },
    },
  });

  return vendors.map((v) => {
    const activeOrders = v.orders.filter((o) => !o.isArchived);
    const completed = activeOrders.filter((o) => o.deliveryStatus === "Delivered").length;
    const cancelled = activeOrders.filter((o) =>
      ["Cancelled", "Returned", "Delivery Failed"].includes(o.deliveryStatus)
    ).length;
    const pending = activeOrders.length - completed - cancelled;
    const { orders, ...rest } = v;
    return {
      ...rest,
      stats: {
        totalOrders: activeOrders.length,
        completedOrders: completed,
        pendingOrders: pending,
        cancelledOrders: cancelled,
        totalVendorCost: activeOrders.reduce((s, o) => s + o.vendorTotalCost, 0),
        amountPaid: activeOrders.reduce((s, o) => s + o.vendorPaid, 0),
        amountPending: activeOrders.reduce((s, o) => s + o.vendorPending, 0),
      },
    };
  });
}
