"use client";

import { useState } from "react";
import { localFetch as fetch } from "@/lib/localFetch";

export function RecordPayment({
  orderId,
  type,
  currency,
  onRecorded,
}: {
  orderId: number;
  type: "customer" | "vendor";
  currency: string;
  onRecorded?: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setSaving(true);
    await fetch(`/api/orders/${orderId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        amount: Number(amount),
        date: new Date().toISOString().slice(0, 10),
        method,
        notes,
      }),
    });
    setSaving(false);
    setOpen(false);
    setAmount("");
    setMethod("");
    setNotes("");
    onRecorded?.();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary text-xs">
        + Record {type === "customer" ? "Customer" : "Vendor"} Payment
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 rounded-lg bg-gray-50 p-2.5">
      <div>
        <label className="label">Amount ({currency})</label>
        <input autoFocus type="number" step="0.01" className="input w-28" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <label className="label">Method</label>
        <input className="input w-32" value={method} onChange={(e) => setMethod(e.target.value)} placeholder="Cash/Card" />
      </div>
      <div>
        <label className="label">Notes</label>
        <input className="input w-32" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button type="submit" disabled={saving} className="btn-primary text-xs">
        {saving ? "Saving…" : "Save"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-xs">
        Cancel
      </button>
    </form>
  );
}
