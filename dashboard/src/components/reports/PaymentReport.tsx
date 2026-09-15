"use client";

import { useEffect, useState, useCallback } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { StatCard } from "@/components/StatCard";
import { formatMoney } from "@/lib/format";
import type { DateRangeKey } from "@/lib/dateRanges";
import { localFetch as fetch } from "@/lib/localFetch";

interface Totals {
  customerTotal: number;
  customerReceived: number;
  customerPending: number;
  vendorTotal: number;
  vendorPaid: number;
  vendorPending: number;
  commission: number;
}

export function PaymentReport({ currency }: { currency: string }) {
  const [range, setRange] = useState<DateRangeKey>("thisMonth");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [totals, setTotals] = useState<Totals | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ range });
    if (range === "custom") {
      params.set("from", customFrom);
      params.set("to", customTo);
    }
    const res = await fetch(`/api/reports/payments?${params.toString()}`);
    const data = await res.json();
    setTotals(data.totals);
  }, [range, customFrom, customTo]);

  useEffect(() => {
    load();
  }, [load]);

  const money = (n: number) => formatMoney(n, currency);

  return (
    <div className="space-y-4">
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
      {totals && (
        <>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Customer Payments</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard label="Total Customer Amount" value={money(totals.customerTotal)} />
              <StatCard label="Amount Received" value={money(totals.customerReceived)} tone="success" />
              <StatCard label="Amount Pending" value={money(totals.customerPending)} tone="warning" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Vendor Payments</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard label="Total Vendor Amount" value={money(totals.vendorTotal)} />
              <StatCard label="Amount Paid" value={money(totals.vendorPaid)} tone="success" />
              <StatCard label="Amount Pending" value={money(totals.vendorPending)} tone="warning" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Commission</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard label="Total Commission / Profit" value={money(totals.commission)} tone="success" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
