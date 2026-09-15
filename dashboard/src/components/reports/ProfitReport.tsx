"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DateRangePicker } from "@/components/DateRangePicker";
import { StatCard } from "@/components/StatCard";
import { formatMoney } from "@/lib/format";
import type { DateRangeKey } from "@/lib/dateRanges";

const COLORS = ["#396440", "#4a7d52", "#9ebda3", "#c3d6c6", "#6f9c76", "#28422c", "#2f5034"];

interface ProfitData {
  summary: { totalRevenue: number; totalVendorCost: number; totalOtherCost: number; grossProfit: number; netProfit: number };
  charts: {
    revenueByDay: { date: string; revenue: number; profit: number }[];
    revenueByMonth: { month: string; revenue: number; profit: number }[];
    ordersByVendor: { name: string; count: number }[];
    ordersByProduct: { name: string; count: number }[];
    deliveryStatus: { name: string; count: number }[];
    paymentStatus: { name: string; count: number }[];
  };
}

export function ProfitReport({ currency }: { currency: string }) {
  const [range, setRange] = useState<DateRangeKey>("thisMonth");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [data, setData] = useState<ProfitData | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ range });
    if (range === "custom") {
      params.set("from", customFrom);
      params.set("to", customTo);
    }
    const res = await fetch(`/api/reports/profit?${params.toString()}`);
    setData(await res.json());
  }, [range, customFrom, customTo]);

  useEffect(() => {
    load();
  }, [load]);

  if (!data) return <p className="text-sm text-gray-400">Loading…</p>;
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Revenue" value={money(data.summary.totalRevenue)} />
        <StatCard label="Vendor Cost" value={money(data.summary.totalVendorCost)} />
        <StatCard label="Other Costs" value={money(data.summary.totalOtherCost)} />
        <StatCard label="Gross Profit" value={money(data.summary.grossProfit)} tone="success" />
        <StatCard label="Net Profit" value={money(data.summary.netProfit)} tone="success" />
      </div>

      <ChartCard title="Revenue &amp; Profit by Day">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.charts.revenueByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => money(v)} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#396440" strokeWidth={2} dot={false} name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#c9922e" strokeWidth={2} dot={false} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue &amp; Profit by Month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.charts.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => money(v)} />
              <Legend />
              <Bar dataKey="revenue" fill="#396440" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#c9922e" name="Profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by Vendor">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.charts.ordersByVendor} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#4a7d52" radius={[0, 4, 4, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by Product">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.charts.ordersByProduct} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#6f9c76" radius={[0, 4, 4, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Delivery Status Breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.charts.deliveryStatus} dataKey="count" nameKey="name" outerRadius={90} label={{ fontSize: 11 }}>
                {data.charts.deliveryStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payment Status Breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.charts.paymentStatus} dataKey="count" nameKey="name" outerRadius={90} label={{ fontSize: 11 }}>
                {data.charts.paymentStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}
