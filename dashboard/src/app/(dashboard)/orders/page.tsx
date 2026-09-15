import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { OrdersTable } from "@/components/OrdersTable";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { archived?: string };
}) {
  const [vendors, settings] = await Promise.all([
    prisma.vendor.findMany({ orderBy: { name: "asc" } }),
    getSettings(),
  ]);
  const showArchived = searchParams.archived === "1";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Search, filter and manage every order.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/orders/new" className="btn-primary">+ Add Order</Link>
          <a href="/api/export/orders" className="btn-secondary">Export CSV</a>
          <Link href={showArchived ? "/orders" : "/orders?archived=1"} className="btn-secondary">
            {showArchived ? "View Active Orders" : "View Archived Orders"}
          </Link>
        </div>
      </div>

      <Suspense>
        <OrdersTable vendors={vendors} currency={settings.currencySymbol} showArchived={showArchived} />
      </Suspense>
    </div>
  );
}
