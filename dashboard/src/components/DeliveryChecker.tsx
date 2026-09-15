"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";
import type { VendorOption, ProductOption } from "@/lib/orderFormTypes";

interface CheckResult {
  earliestDate: string;
  suggestedDates: string[];
  leadTimeDays: number;
  leadTimeSource: "product" | "vendor" | "default" | "manual";
  skippedWeekends: boolean;
  product: { id: number; name: string } | null;
  vendor: { id: number; name: string } | null;
}

const SOURCE_LABEL: Record<CheckResult["leadTimeSource"], string> = {
  product: "from this product's own lead time",
  vendor: "from this vendor's default lead time",
  default: "from the Settings default lead time",
  manual: "from the lead time you typed in",
};

/** Delivery Date Checker — a standalone tool, deliberately separate from
 * the Orders workflow. Pick a product and/or vendor plus a booking date
 * and it suggests an earliest delivery date; nothing here touches an
 * order. */
export function DeliveryChecker({ vendors, products }: { vendors: VendorOption[]; products: ProductOption[] }) {
  const [productId, setProductId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));
  const [manualLeadTime, setManualLeadTime] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ bookingDate });
    if (productId) params.set("productId", productId);
    if (vendorId) params.set("vendorId", vendorId);
    if (manualLeadTime) params.set("leadTimeDays", manualLeadTime);

    const res = await fetch(`/api/delivery-check?${params.toString()}`);
    setLoading(false);
    if (!res.ok) {
      setError("Could not check delivery dates. Please try again.");
      setResult(null);
      return;
    }
    setResult(await res.json());
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form onSubmit={check} className="card space-y-3">
        <div>
          <label className="label">Product (optional)</label>
          <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">— any / not applicable —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Vendor (optional — auto-filled from product if left blank)</label>
          <select className="input" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            <option value="">— use product's default vendor —</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Order / Booking Date</label>
          <input type="date" className="input" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
        </div>
        <div>
          <label className="label">Override Lead Time (days, optional)</label>
          <input
            type="number"
            min={0}
            className="input"
            value={manualLeadTime}
            onChange={(e) => setManualLeadTime(e.target.value)}
            placeholder="Leave blank to use product/vendor/default"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Checking…" : "Check Delivery Date"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="card">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Result</h3>
        {!result ? (
          <p className="text-sm text-gray-400">Fill in the form and check to see a suggested delivery date.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Earliest Delivery Date</p>
              <p className="text-2xl font-semibold text-brand-700">{formatDate(result.earliestDate)}</p>
              <p className="text-xs text-gray-400">
                Based on a {result.leadTimeDays}-day lead time, {SOURCE_LABEL[result.leadTimeSource]}
                {result.skippedWeekends ? " (weekends skipped)" : ""}.
              </p>
            </div>

            {result.suggestedDates.length > 1 && (
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Other Suggested Dates</p>
                <ul className="flex flex-wrap gap-2">
                  {result.suggestedDates.slice(1).map((d) => (
                    <li key={d} className="badge bg-gray-100 text-gray-700">{formatDate(d)}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 text-xs text-gray-500">
              {result.product && <p>Product: {result.product.name}</p>}
              {result.vendor && <p>Vendor: {result.vendor.name}</p>}
              {!result.product && !result.vendor && <p>No product/vendor selected — using the Settings default lead time.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
