"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DeliveryStatusBadge, PaymentStatusBadge } from "@/components/Badge";
import { formatDate, formatMoney, telHref, whatsappHref } from "@/lib/format";
import { DELIVERY_STATUSES, CUSTOMER_PAYMENT_STATUSES, FLOORS } from "@/lib/calculations";
import { localFetch as fetch } from "@/lib/localFetch";
import type { VendorOption } from "@/lib/orderFormTypes";

interface OrderRow {
  id: number;
  orderNo: string;
  bookingDate: string;
  deliveryDateExpected: string | null;
  customerName: string;
  contact: string;
  whatsapp: string | null;
  productName: string;
  vendor: { id: number; name: string } | null;
  productPrice: number;
  floor: string;
  liftAvailable: boolean;
  fittingRequired: boolean;
  customerTotal: number;
  amountPaid: number;
  customerPending: number;
  vendorTotalCost: number;
  vendorPaid: number;
  vendorPending: number;
  commissionAmount: number;
  deliveryStatus: string;
  paymentStatus: string;
  isArchived: boolean;
}

export function OrdersTable({ vendors, currency, showArchived }: { vendors: VendorOption[]; currency: string; showArchived?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [vendorId, setVendorId] = useState(searchParams.get("vendorId") ?? "");
  const [deliveryStatus, setDeliveryStatus] = useState(searchParams.get("deliveryStatus") ?? "");
  const [paymentStatus, setPaymentStatus] = useState(searchParams.get("paymentStatus") ?? "");
  const [floor, setFloor] = useState(searchParams.get("floor") ?? "");
  const [fitting, setFitting] = useState(searchParams.get("fitting") ?? "");
  const [lift, setLift] = useState(searchParams.get("lift") ?? "");
  const [customerPendingOnly, setCustomerPendingOnly] = useState(searchParams.get("customerPendingOnly") === "1");
  const [vendorPendingOnly, setVendorPendingOnly] = useState(searchParams.get("vendorPendingOnly") === "1");

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (vendorId) p.set("vendorId", vendorId);
    if (deliveryStatus) p.set("deliveryStatus", deliveryStatus);
    if (paymentStatus) p.set("paymentStatus", paymentStatus);
    if (floor) p.set("floor", floor);
    if (fitting) p.set("fitting", fitting);
    if (lift) p.set("lift", lift);
    if (customerPendingOnly) p.set("customerPendingOnly", "1");
    if (vendorPendingOnly) p.set("vendorPendingOnly", "1");
    if (showArchived) p.set("archived", "1");
    return p.toString();
  }, [search, vendorId, deliveryStatus, paymentStatus, floor, fitting, lift, customerPendingOnly, vendorPendingOnly, showArchived]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/orders?${query}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryStatus: status }),
    });
    load();
  }

  async function markPaid(order: OrderRow) {
    if (order.customerPending <= 0) return;
    await fetch(`/api/orders/${order.id}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "customer", amount: order.customerPending, date: new Date().toISOString().slice(0, 10) }),
    });
    load();
  }

  async function duplicate(id: number) {
    const res = await fetch(`/api/orders/${id}/duplicate`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      router.push(`/orders/view?id=${data.order.id}`);
    }
  }

  async function archive(id: number) {
    if (!confirm("Archive this order? It will be hidden from the list but can be restored anytime.")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    load();
  }

  async function restore(id: number) {
    await fetch(`/api/orders/${id}/restore`, { method: "POST" });
    load();
  }

  return (
    <div className="space-y-3">
      <div className="card space-y-3">
        <input
          className="input"
          placeholder="Search by customer, phone, order ID, product, vendor, postcode, address…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          <select className="input" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            <option value="">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <select className="input" value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)}>
            <option value="">All Delivery Status</option>
            {DELIVERY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select className="input" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="">All Payment Status</option>
            {CUSTOMER_PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select className="input" value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option value="">All Floors</option>
            {FLOORS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select className="input" value={fitting} onChange={(e) => setFitting(e.target.value)}>
            <option value="">Fitting: Any</option>
            <option value="yes">Fitting: Yes</option>
            <option value="no">Fitting: No</option>
          </select>
          <select className="input" value={lift} onChange={(e) => setLift(e.target.value)}>
            <option value="">Lift: Any</option>
            <option value="yes">Lift: Yes</option>
            <option value="no">Lift: No</option>
          </select>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={customerPendingOnly} onChange={(e) => setCustomerPendingOnly(e.target.checked)} />
              Cust. pending
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={vendorPendingOnly} onChange={(e) => setVendorPendingOnly(e.target.checked)} />
              Vendor pending
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="card text-sm text-gray-400">No orders match your filters.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {orders.map((o) => (
              <div key={o.id} className="card space-y-1.5">
                <div className="flex items-center justify-between">
                  <Link href={`/orders/view?id=${o.id}`} className="font-semibold text-brand-700">
                    {o.orderNo}
                  </Link>
                  <PaymentStatusBadge status={o.paymentStatus} />
                </div>
                <p className="text-sm font-medium">{o.customerName}</p>
                <p className="text-xs text-gray-500">{o.productName} · {o.vendor?.name ?? "No vendor"}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <a href={telHref(o.contact)} className="text-brand-600">{o.contact}</a>
                  {o.whatsapp && (
                    <a href={whatsappHref(o.whatsapp)} target="_blank" rel="noreferrer" className="text-green-600">
                      WhatsApp
                    </a>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <DeliveryStatusBadge status={o.deliveryStatus} />
                  <span className="text-sm font-semibold">{formatMoney(o.customerTotal, currency)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Link href={`/orders/view?id=${o.id}`} className="btn-secondary px-2 py-1 text-xs">View / Edit</Link>
                  {!o.isArchived ? (
                    <button onClick={() => archive(o.id)} className="btn-danger px-2 py-1 text-xs">Archive</button>
                  ) : (
                    <button onClick={() => restore(o.id)} className="btn-secondary px-2 py-1 text-xs">Restore</button>
                  )}
                  <button onClick={() => duplicate(o.id)} className="btn-secondary px-2 py-1 text-xs">Duplicate</button>
                  {o.customerPending > 0 && (
                    <button onClick={() => markPaid(o)} className="btn-secondary px-2 py-1 text-xs">Mark Paid</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white md:block">
            <table className="min-w-[1600px] w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {[
                    "Order ID", "Booking", "Delivery", "Customer", "Contact", "Product", "Vendor",
                    "Price", "Floor", "Lift", "Fitting", "Total", "Paid", "Cust. Pending",
                    "Vendor Cost", "Vendor Paid", "Vendor Pending", "Commission",
                    "Delivery Status", "Payment Status", "Actions",
                  ].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-brand-700">
                      <Link href={`/orders/view?id=${o.id}`}>{o.orderNo}</Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">{formatDate(o.bookingDate)}</td>
                    <td className="whitespace-nowrap px-3 py-2">{formatDate(o.deliveryDateExpected)}</td>
                    <td className="whitespace-nowrap px-3 py-2">{o.customerName}</td>
                    <td className="whitespace-nowrap px-3 py-2"><a className="text-brand-600" href={telHref(o.contact)}>{o.contact}</a></td>
                    <td className="whitespace-nowrap px-3 py-2">{o.productName}</td>
                    <td className="whitespace-nowrap px-3 py-2">{o.vendor?.name ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2">{formatMoney(o.productPrice, currency)}</td>
                    <td className="whitespace-nowrap px-3 py-2">{o.floor}</td>
                    <td className="whitespace-nowrap px-3 py-2">{o.liftAvailable ? "Yes" : "No"}</td>
                    <td className="whitespace-nowrap px-3 py-2">{o.fittingRequired ? "Yes" : "No"}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold">{formatMoney(o.customerTotal, currency)}</td>
                    <td className="whitespace-nowrap px-3 py-2">{formatMoney(o.amountPaid, currency)}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-amber-600">{formatMoney(o.customerPending, currency)}</td>
                    <td className="whitespace-nowrap px-3 py-2">{formatMoney(o.vendorTotalCost, currency)}</td>
                    <td className="whitespace-nowrap px-3 py-2">{formatMoney(o.vendorPaid, currency)}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-amber-600">{formatMoney(o.vendorPending, currency)}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-green-600">{formatMoney(o.commissionAmount, currency)}</td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <select
                        className="rounded border-gray-200 bg-transparent text-xs"
                        value={o.deliveryStatus}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                      >
                        {DELIVERY_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2"><PaymentStatusBadge status={o.paymentStatus} /></td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <div className="relative">
                        <button className="btn-secondary px-2 py-1 text-xs" onClick={() => setOpenMenu(openMenu === o.id ? null : o.id)}>
                          Actions ▾
                        </button>
                        {openMenu === o.id && (
                          <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg">
                            <Link href={`/orders/view?id=${o.id}`} className="block px-3 py-1.5 hover:bg-gray-50">View / Edit</Link>
                            <button className="block w-full px-3 py-1.5 text-left hover:bg-gray-50" onClick={() => duplicate(o.id)}>Duplicate</button>
                            <Link href={`/orders/print?id=${o.id}`} className="block px-3 py-1.5 hover:bg-gray-50">Print</Link>
                            <Link href={`/reminders?orderId=${o.id}&customerName=${encodeURIComponent(o.customerName)}`} className="block px-3 py-1.5 hover:bg-gray-50">Add Reminder</Link>
                            {o.customerPending > 0 && (
                              <button className="block w-full px-3 py-1.5 text-left hover:bg-gray-50" onClick={() => markPaid(o)}>Mark Fully Paid</button>
                            )}
                            {o.deliveryStatus !== "Delivered" && (
                              <button className="block w-full px-3 py-1.5 text-left hover:bg-gray-50" onClick={() => updateStatus(o.id, "Delivered")}>Mark Delivered</button>
                            )}
                            {!o.isArchived ? (
                              <button className="block w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50" onClick={() => archive(o.id)}>Archive</button>
                            ) : (
                              <button className="block w-full px-3 py-1.5 text-left hover:bg-gray-50" onClick={() => restore(o.id)}>Restore</button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
