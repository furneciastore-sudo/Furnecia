"use client";

import { useEffect, useState, useCallback } from "react";
import { formatMoney } from "@/lib/format";
import { downloadCsv } from "@/lib/downloadCsv";
import type { VendorOption } from "@/lib/orderFormTypes";
import { localFetch as fetch } from "@/lib/localFetch";

interface OrderRow {
  id: number;
  orderNo: string;
  customerName: string;
  contact: string;
  productName: string;
  deliveryDateExpected: string | null;
  address: string;
  floor: string;
  liftAvailable: boolean;
  fittingRequired: boolean;
  customerTotal: number;
  vendorTotalCost: number;
  deliveryStatus: string;
  notes: string | null;
  vendor: { name: string } | null;
}

export function VendorDailyReport({ vendors, currency }: { vendors: VendorOption[]; currency: string }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [vendorId, setVendorId] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ date });
    if (vendorId) params.set("vendorId", vendorId);
    const res = await fetch(`/api/reports/vendor-daily?${params.toString()}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [date, vendorId]);

  useEffect(() => {
    load();
  }, [load]);

  function exportCsv() {
    downloadCsv(
      `vendor-report-${date}.csv`,
      orders.map((o) => ({
        "Order ID": o.orderNo,
        Customer: o.customerName,
        Contact: o.contact,
        Product: o.productName,
        "Delivery Date": o.deliveryDateExpected?.slice(0, 10) ?? "",
        Address: o.address,
        Floor: o.floor,
        Lift: o.liftAvailable ? "Yes" : "No",
        Fitting: o.fittingRequired ? "Yes" : "No",
        "Customer Total": o.customerTotal,
        "Vendor Cost": o.vendorTotalCost,
        "Delivery Status": o.deliveryStatus,
        Notes: o.notes ?? "",
      })
      )
    );
  }

  return (
    <div className="space-y-3">
      <div className="no-print flex flex-wrap items-end gap-2">
        <div>
          <label className="label">Date</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label">Vendor</label>
          <select className="input" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            <option value="">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        <button onClick={() => window.print()} className="btn-secondary">Print Report</button>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Vendor Delivery Sheet — {date}</h3>
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-400">No deliveries scheduled for this date/vendor.</p>
        ) : (
          <table className="min-w-[1000px] w-full text-left text-xs">
            <thead className="text-gray-500">
              <tr>
                {["Order ID", "Customer", "Contact", "Product", "Address", "Floor", "Lift", "Fitting", "Total", "Vendor Cost", "Status", "Notes"].map((h) => (
                  <th key={h} className="py-1.5 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-1.5 pr-3 font-medium">{o.orderNo}</td>
                  <td className="py-1.5 pr-3">{o.customerName}</td>
                  <td className="py-1.5 pr-3">{o.contact}</td>
                  <td className="py-1.5 pr-3">{o.productName}</td>
                  <td className="py-1.5 pr-3">{o.address}</td>
                  <td className="py-1.5 pr-3">{o.floor}</td>
                  <td className="py-1.5 pr-3">{o.liftAvailable ? "Yes" : "No"}</td>
                  <td className="py-1.5 pr-3">{o.fittingRequired ? "Yes" : "No"}</td>
                  <td className="py-1.5 pr-3">{formatMoney(o.customerTotal, currency)}</td>
                  <td className="py-1.5 pr-3">{formatMoney(o.vendorTotalCost, currency)}</td>
                  <td className="py-1.5 pr-3">{o.deliveryStatus}</td>
                  <td className="py-1.5 pr-3">{o.notes ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
