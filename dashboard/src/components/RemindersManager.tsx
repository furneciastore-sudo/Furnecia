"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { REMINDER_TYPES, classifyReminder } from "@/lib/reminders";
import { formatDate } from "@/lib/format";
import { localFetch as fetch } from "@/lib/localFetch";

interface OrderOption {
  id: number;
  orderNo: string;
  customerName: string;
}

interface ReminderRow {
  id: number;
  orderId: number | null;
  customerName: string | null;
  type: string;
  date: string;
  time: string | null;
  notes: string | null;
  status: string;
  order?: { orderNo: string; customerName: string } | null;
}

const BUCKET_META: Record<string, string> = {
  overdue: "🔴 Overdue",
  today: "🟠 Due Today",
  tomorrow: "🟡 Due Tomorrow",
  upcoming: "🟢 Upcoming",
  completed: "✅ Completed",
};

export function RemindersManager() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [showForm, setShowForm] = useState(Boolean(searchParams.get("orderId")));
  const [showCompleted, setShowCompleted] = useState(false);
  const [form, setForm] = useState({
    orderId: searchParams.get("orderId") ?? "",
    customerName: searchParams.get("customerName") ?? "",
    type: REMINDER_TYPES[0] as string,
    date: new Date().toISOString().slice(0, 10),
    time: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [remindersRes, ordersRes] = await Promise.all([fetch("/api/reminders"), fetch("/api/orders?archived=0")]);
    const remindersData = await remindersRes.json();
    const ordersData = await ordersRes.json();
    setReminders(remindersData.reminders ?? []);
    setOrders((ordersData.orders ?? []).slice(0, 300).map((o: { id: number; orderNo: string; customerName: string }) => ({
      id: o.id,
      orderNo: o.orderNo,
      customerName: o.customerName,
    })));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, orderId: form.orderId ? Number(form.orderId) : null }),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ orderId: "", customerName: "", type: REMINDER_TYPES[0], date: new Date().toISOString().slice(0, 10), time: "", notes: "" });
    load();
  }

  async function setStatus(id: number, status: string) {
    await fetch(`/api/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this reminder?")) return;
    await fetch(`/api/reminders/${id}`, { method: "DELETE" });
    load();
  }

  const buckets: Record<string, ReminderRow[]> = { overdue: [], today: [], tomorrow: [], upcoming: [], completed: [] };
  for (const r of reminders) {
    buckets[classifyReminder(r.date, r.status)].push(r);
  }
  const order = showCompleted
    ? ["overdue", "today", "tomorrow", "upcoming", "completed"]
    : ["overdue", "today", "tomorrow", "upcoming"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reminders</h1>
          <p className="text-sm text-gray-500">Customer, vendor, delivery, payment &amp; commission follow-ups.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCompleted((s) => !s)} className="btn-secondary">
            {showCompleted ? "Hide Completed" : "Show Completed"}
          </button>
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary">+ Add Reminder</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Link to Order (optional)</label>
            <select className="input" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })}>
              <option value="">— none —</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>{o.orderNo} — {o.customerName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Customer Name (if no order)</label>
            <input className="input" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </div>
          <div>
            <label className="label">Reminder Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {REMINDER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Reminder Date</label>
            <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="label">Reminder Time</label>
            <input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Notes</label>
            <input className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save Reminder"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {order.map((key) => {
        const items = buckets[key];
        if (!items || items.length === 0) return null;
        return (
          <div key={key} className="card">
            <p className="mb-2 text-sm font-semibold text-gray-700">{BUCKET_META[key]} ({items.length})</p>
            <ul className="space-y-2">
              {items.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {r.type}
                      {r.order && (
                        <>
                          {" — "}
                          <Link href={`/orders/view?id=${r.orderId}`} className="text-brand-600 hover:underline">{r.order.orderNo}</Link>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(r.order?.customerName ?? r.customerName) || ""} · {formatDate(r.date)} {r.time ?? ""}
                    </p>
                    {r.notes && <p className="text-xs text-gray-400">{r.notes}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    {r.status === "Pending" ? (
                      <button onClick={() => setStatus(r.id, "Completed")} className="btn-secondary px-2.5 py-1 text-xs">Done</button>
                    ) : (
                      <button onClick={() => setStatus(r.id, "Pending")} className="btn-secondary px-2.5 py-1 text-xs">Reopen</button>
                    )}
                    <button onClick={() => remove(r.id)} className="btn-danger px-2.5 py-1 text-xs">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {reminders.length === 0 && <div className="card text-sm text-gray-400">No reminders yet.</div>}
    </div>
  );
}
