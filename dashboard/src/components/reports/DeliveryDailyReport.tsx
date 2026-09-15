"use client";

import { useEffect, useState, useCallback } from "react";
import { formatMoney, telHref, whatsappHref } from "@/lib/format";
import { DeliveryStatusBadge, PaymentStatusBadge } from "@/components/Badge";

interface OrderRow {
  id: number;
  orderNo: string;
  customerName: string;
  contact: string;
  whatsapp: string | null;
  address: string;
  productName: string;
  floor: string;
  liftAvailable: boolean;
  fittingRequired: boolean;
  customerTotal: number;
  paymentStatus: string;
  deliveryStatus: string;
}

interface Group {
  vendor: string;
  orders: OrderRow[];
}

export function DeliveryDailyReport({ currency }: { currency: string }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/reports/delivery-daily?date=${date}`);
    const data = await res.json();
    setGroups(data.groups ?? []);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  function copy(id: number, text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="space-y-3">
      <div className="no-print flex flex-wrap items-end gap-2">
        <div>
          <label className="label">Delivery Date</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button onClick={() => window.print()} className="btn-secondary">Print Report</button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : groups.length === 0 ? (
        <div className="card text-sm text-gray-400">No deliveries scheduled for {date}.</div>
      ) : (
        groups.map((g) => (
          <div key={g.vendor} className="card space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">{g.vendor} ({g.orders.length})</h3>
            <div className="space-y-2">
              {g.orders.map((o) => (
                <div key={o.id} className="rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{o.orderNo} — {o.customerName}</span>
                    <DeliveryStatusBadge status={o.deliveryStatus} />
                  </div>
                  <p className="text-xs text-gray-500">{o.productName} · Floor: {o.floor} · Lift: {o.liftAvailable ? "Yes" : "No"} · Fitting: {o.fittingRequired ? "Yes" : "No"}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <a href={telHref(o.contact)} className="text-brand-600">{o.contact}</a>
                    {o.whatsapp && <a href={whatsappHref(o.whatsapp)} target="_blank" rel="noreferrer" className="text-green-600">WhatsApp</a>}
                    <button className="no-print text-gray-400 underline" onClick={() => copy(o.id, `${o.customerName}\n${o.contact}\n${o.address}`)}>
                      {copied === o.id ? "Copied!" : "Copy address+phone"}
                    </button>
                    <PaymentStatusBadge status={o.paymentStatus} />
                    <span className="font-medium">{formatMoney(o.customerTotal, currency)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{o.address}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
