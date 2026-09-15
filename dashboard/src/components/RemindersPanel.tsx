"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { classifyReminder } from "@/lib/reminders";
import { formatDate } from "@/lib/format";

interface ReminderRow {
  id: number;
  orderId: number | null;
  customerName: string | null;
  type: string;
  date: string;
  time: string | null;
  notes: string | null;
  status: string;
  order?: { orderNo: string; customerName: string; contact: string } | null;
}

const BUCKET_META: Record<string, { label: string; dot: string }> = {
  overdue: { label: "🔴 Overdue", dot: "bg-red-500" },
  today: { label: "🟠 Due Today", dot: "bg-orange-500" },
  tomorrow: { label: "🟡 Due Tomorrow", dot: "bg-yellow-500" },
  upcoming: { label: "🟢 Upcoming", dot: "bg-green-500" },
};

export function RemindersPanel({ compact = false }: { compact?: boolean }) {
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/reminders?status=Pending");
    const data = await res.json();
    setReminders(data.reminders ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function complete(id: number) {
    await fetch(`/api/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Completed" }),
    });
    load();
  }

  if (loading) return <div className="card text-sm text-gray-400">Loading reminders…</div>;

  const buckets: Record<string, ReminderRow[]> = { overdue: [], today: [], tomorrow: [], upcoming: [] };
  for (const r of reminders) {
    const bucket = classifyReminder(r.date, r.status);
    if (bucket in buckets) buckets[bucket].push(r);
  }

  const order = compact ? ["overdue", "today", "tomorrow"] : ["overdue", "today", "tomorrow", "upcoming"];

  if (reminders.length === 0) {
    return <div className="card text-sm text-gray-400">🟢 No pending reminders. All caught up.</div>;
  }

  return (
    <div className="space-y-3">
      {order.map((key) => {
        const items = buckets[key];
        if (!items || items.length === 0) return null;
        return (
          <div key={key} className="card">
            <p className="mb-2 text-sm font-semibold text-gray-700">
              {BUCKET_META[key].label} ({items.length})
            </p>
            <ul className="space-y-2">
              {items.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {r.type}
                      {r.order && (
                        <>
                          {" — "}
                          <Link href={`/orders/${r.orderId}`} className="text-brand-600 hover:underline">
                            {r.order.orderNo}
                          </Link>
                        </>
                      )}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {(r.order?.customerName ?? r.customerName) || ""} · {formatDate(r.date)}
                      {r.time ? ` ${r.time}` : ""}
                    </p>
                    {r.notes && <p className="truncate text-xs text-gray-400">{r.notes}</p>}
                  </div>
                  <button onClick={() => complete(r.id)} className="btn-secondary shrink-0 px-2.5 py-1 text-xs">
                    Done
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
