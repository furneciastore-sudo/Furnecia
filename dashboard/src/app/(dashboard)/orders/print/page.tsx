"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSettings, getOrder } from "@/lib/localApi";
import { formatDate, formatMoney } from "@/lib/format";
import { AutoPrint } from "@/components/AutoPrint";
import type { SettingsMap } from "@/lib/settingsShared";

function PrintOrderInner() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [order, setOrder] = useState<ReturnType<typeof getOrder> | null>(null);
  const [settings, setSettings] = useState<SettingsMap | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      setOrder(getOrder(id));
    } catch {
      setNotFound(true);
      return;
    }
    setSettings(getSettings());
  }, [id]);

  if (notFound) return <p className="text-sm text-gray-500">Order not found.</p>;
  if (!order || !settings) return null;

  const currency = settings.currencySymbol;

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-sm text-gray-800">
      <AutoPrint />
      <div className="mb-6 flex items-start justify-between border-b pb-4">
        <div>
          <h1 className="text-lg font-bold">{settings.businessName}</h1>
          <p className="text-gray-500">{settings.businessPhone} · {settings.businessEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">Order {order.orderNo}</p>
          <p className="text-gray-500">Booked {formatDate(order.bookingDate)}</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-500">Customer</p>
          <p>{order.customerName}</p>
          <p>{order.contact}</p>
          <p>{order.address}</p>
          <p>{order.postcode} {order.city}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-500">Delivery</p>
          <p>Expected: {formatDate(order.deliveryDateExpected)}</p>
          <p>Floor: {order.floor} · Lift: {order.liftAvailable ? "Yes" : "No"}</p>
          <p>Fitting: {order.fittingRequired ? "Yes" : "No"}</p>
          <p>Vendor: {order.vendor?.name ?? "—"}</p>
        </div>
      </div>

      <table className="mb-4 w-full border-t border-gray-200 text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-1.5">Description</th>
            <th className="py-1.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="py-1">{order.productName} {order.colour ? `(${order.colour})` : ""} × {order.quantity}</td><td className="text-right">{formatMoney(order.productPrice * order.quantity, currency)}</td></tr>
          <tr><td className="py-1">Floor Charge</td><td className="text-right">{formatMoney(order.floorCharge, currency)}</td></tr>
          <tr><td className="py-1">Fitting Charge</td><td className="text-right">{formatMoney(order.fittingCharge, currency)}</td></tr>
          <tr><td className="py-1">Additional Charge</td><td className="text-right">{formatMoney(order.additionalCharge, currency)}</td></tr>
          <tr><td className="py-1">Discount</td><td className="text-right">-{formatMoney(order.discount, currency)}</td></tr>
          <tr className="border-t border-gray-200 font-semibold"><td className="py-1.5">Total</td><td className="text-right">{formatMoney(order.customerTotal, currency)}</td></tr>
          <tr><td className="py-1">Amount Paid</td><td className="text-right">{formatMoney(order.amountPaid, currency)}</td></tr>
          <tr className="font-semibold"><td className="py-1">Balance Due</td><td className="text-right">{formatMoney(order.customerPending, currency)}</td></tr>
        </tbody>
      </table>

      {order.notes && (
        <div className="mb-4">
          <p className="font-semibold text-gray-500">Notes</p>
          <p>{order.notes}</p>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-gray-400">Thank you for your order — {settings.businessName}</p>
    </div>
  );
}

export default function PrintOrderPage() {
  return (
    <Suspense>
      <PrintOrderInner />
    </Suspense>
  );
}
