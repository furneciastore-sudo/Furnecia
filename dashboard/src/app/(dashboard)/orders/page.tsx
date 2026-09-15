"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSettings, listVendorsWithStats, exportOrdersCsv } from "@/lib/localApi";
import { downloadText } from "@/lib/downloadCsv";
import { OrdersTable } from "@/components/OrdersTable";

function OrdersPageInner() {
  const searchParams = useSearchParams();
  const showArchived = searchParams.get("archived") === "1";
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [currency, setCurrency] = useState("£");

  useEffect(() => {
    setVendors(listVendorsWithStats());
    setCurrency(getSettings().currencySymbol);
  }, []);

  function exportCsv() {
    downloadText(`furnecia-orders-${new Date().toISOString().slice(0, 10)}.csv`, exportOrdersCsv());
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Search, filter and manage every order.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/orders/new" className="btn-primary">+ Add Order</Link>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
          <Link href={showArchived ? "/orders" : "/orders?archived=1"} className="btn-secondary">
            {showArchived ? "View Active Orders" : "View Archived Orders"}
          </Link>
        </div>
      </div>

      <OrdersTable vendors={vendors} currency={currency} showArchived={showArchived} />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersPageInner />
    </Suspense>
  );
}
