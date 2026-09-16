"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSettings, getOrder, listVendorsWithStats, listProducts } from "@/lib/localApi";
import { OrderForm } from "@/components/OrderForm";
import { OrderActions } from "@/components/OrderActions";
import { RecordPayment } from "@/components/RecordPayment";
import { orderToFormValues, type VendorOption, type ProductOption } from "@/lib/orderFormTypes";
import { formatDate, formatMoney } from "@/lib/format";
import type { SettingsMap } from "@/lib/settingsShared";

interface PaymentRow {
  id: number;
  type: string;
  amount: number;
  date: string;
  method: string | null;
}

function OrderDetailInner() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const saved = searchParams.get("saved") === "1";

  const [order, setOrder] = useState<ReturnType<typeof getOrder> | null>(null);
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [settings, setSettings] = useState<SettingsMap | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    try {
      setOrder(getOrder(id));
    } catch {
      setNotFound(true);
      return;
    }
    setVendors(listVendorsWithStats().filter((v) => v.status === "Active"));
    setProducts(listProducts().filter((p) => p.status === "Active"));
    setSettings(getSettings());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refreshKey, searchParams.toString()]);

  if (notFound) return <p className="text-sm text-gray-500">Order not found.</p>;
  if (!order || !settings) return <p className="text-sm text-gray-400">Loading…</p>;

  const currency = settings.currencySymbol;
  const payments = order.payments as PaymentRow[];

  return (
    <div className="space-y-4">
      {saved && (
        <div className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-800">
          ✅ Order {order.orderNo} created successfully.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Order {order.orderNo} {order.isArchived && <span className="badge bg-gray-200 text-gray-600 ml-2">Archived</span>}
          </h1>
          <p className="text-sm text-gray-500">Booked {formatDate(order.bookingDate)} · {order.customerName}</p>
        </div>
        <OrderActions orderId={order.id} isArchived={order.isArchived} />
      </div>

      <OrderForm
        mode="edit"
        orderId={order.id}
        orderNo={order.orderNo}
        initial={orderToFormValues(order)}
        vendors={vendors}
        products={products}
        settings={settings}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Customer Payment History</h3>
            <RecordPayment orderId={order.id} type="customer" currency={currency} onRecorded={() => setRefreshKey((k) => k + 1)} />
          </div>
          {payments.filter((p) => p.type === "customer").length === 0 ? (
            <p className="text-sm text-gray-400">No customer payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {payments.filter((p) => p.type === "customer").map((p) => (
                <li key={p.id} className="flex justify-between py-1.5">
                  <span>{formatDate(p.date)} {p.method ? `· ${p.method}` : ""}</span>
                  <span className="font-medium">{formatMoney(p.amount, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Vendor Payment History</h3>
            <RecordPayment orderId={order.id} type="vendor" currency={currency} onRecorded={() => setRefreshKey((k) => k + 1)} />
          </div>
          {payments.filter((p) => p.type === "vendor").length === 0 ? (
            <p className="text-sm text-gray-400">No vendor payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {payments.filter((p) => p.type === "vendor").map((p) => (
                <li key={p.id} className="flex justify-between py-1.5">
                  <span>{formatDate(p.date)} {p.method ? `· ${p.method}` : ""}</span>
                  <span className="font-medium">{formatMoney(p.amount, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense>
      <OrderDetailInner />
    </Suspense>
  );
}
