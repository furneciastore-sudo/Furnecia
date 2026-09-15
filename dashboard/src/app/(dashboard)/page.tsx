"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { DateRangePicker } from "@/components/DateRangePicker";
import { RemindersPanel } from "@/components/RemindersPanel";
import { formatMoney } from "@/lib/format";
import type { DateRangeKey } from "@/lib/dateRanges";

interface Cards {
  todaysOrders: number;
  todaysDeliveries: number;
  pendingDeliveries: number;
  deliveredOrders: number;
  cancelledOrders: number;
  customerPaymentsPending: number;
  vendorPaymentsPending: number;
  totalRevenue: number;
  totalVendorCost: number;
  totalProfit: number;
}

export default function DashboardHome() {
  const [range, setRange] = useState<DateRangeKey>("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [cards, setCards] = useState<Cards | null>(null);
  const [currency, setCurrency] = useState("£");

  const load = useCallback(async () => {
    const params = new URLSearchParams({ range });
    if (range === "custom") {
      params.set("from", customFrom);
      params.set("to", customTo);
    }
    const [statsRes, settingsRes] = await Promise.all([
      fetch(`/api/dashboard/stats?${params.toString()}`),
      fetch("/api/settings"),
    ]);
    const stats = await statsRes.json();
    const settingsData = await settingsRes.json();
    setCards(stats.cards);
    setCurrency(settingsData.settings.currencySymbol);
  }, [range, customFrom, customTo]);

  useEffect(() => {
    load();
  }, [load]);

  const money = (n: number) => formatMoney(n, currency);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/orders/new" className="btn-primary">
            + Add Order
          </Link>
          <Link href="/orders" className="btn-secondary">
            View Orders
          </Link>
        </div>
      </div>

      <DateRangePicker
        value={range}
        customFrom={customFrom}
        customTo={customTo}
        onChange={setRange}
        onCustomChange={(f, t) => {
          setCustomFrom(f);
          setCustomTo(t);
        }}
      />

      {!cards ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Today's Orders" value={cards.todaysOrders} href="/orders" />
            <StatCard label="Today's Deliveries" value={cards.todaysDeliveries} href="/reports" />
            <StatCard label="Pending Deliveries" value={cards.pendingDeliveries} tone="warning" href="/orders" />
            <StatCard label="Delivered (range)" value={cards.deliveredOrders} tone="success" />
            <StatCard label="Cancelled (range)" value={cards.cancelledOrders} tone="danger" />
            <StatCard
              label="Customer Payments Pending"
              value={money(cards.customerPaymentsPending)}
              tone="warning"
              href="/orders?customerPendingOnly=1"
            />
            <StatCard
              label="Vendor Payments Pending"
              value={money(cards.vendorPaymentsPending)}
              tone="warning"
              href="/orders?vendorPendingOnly=1"
            />
            <StatCard label="Total Revenue (range)" value={money(cards.totalRevenue)} tone="success" />
            <StatCard label="Total Vendor Cost (range)" value={money(cards.totalVendorCost)} />
            <StatCard label="Total Commission / Profit (range)" value={money(cards.totalProfit)} tone="success" />
          </div>
        </>
      )}

      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-800">Reminders &amp; Follow-ups</h2>
        <RemindersPanel />
      </div>
    </div>
  );
}
