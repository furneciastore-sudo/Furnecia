"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FLOORS,
  DELIVERY_STATUSES,
  CUSTOMER_PAYMENT_STATUSES,
  COMMISSION_TYPES,
  calcFloorCharge,
  calcFittingCharge,
  calcCustomerTotal,
  calcCustomerPending,
  derivePaymentStatus,
  calcVendorTotal,
  calcVendorPending,
  deriveVendorPaymentStatus,
  calcProfit,
} from "@/lib/calculations";
import type { SettingsMap } from "@/lib/settingsShared";
import type { OrderFormValues, VendorOption, ProductOption } from "@/lib/orderFormTypes";
import { formatMoney } from "@/lib/format";

export function OrderForm({
  mode,
  orderId,
  orderNo,
  initial,
  vendors,
  products,
  settings,
}: {
  mode: "create" | "edit";
  orderId?: number;
  orderNo?: string;
  initial: OrderFormValues;
  vendors: VendorOption[];
  products: ProductOption[];
  settings: SettingsMap;
}) {
  const router = useRouter();
  const [values, setValues] = useState<OrderFormValues>(initial);
  const [showAdvanced, setShowAdvanced] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const currency = settings.currencySymbol;

  function set<K extends keyof OrderFormValues>(key: K, value: OrderFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function applyProduct(productId: string) {
    const product = products.find((p) => p.id === Number(productId));
    if (!product) return;
    setValues((v) => ({
      ...v,
      productName: product.name,
      productCode: product.code ?? "",
      productPrice: product.defaultPrice,
      vendorId: product.defaultVendorId ?? v.vendorId,
      vendorProductCost: product.defaultVendorCost,
      fittingChargeOverride: product.defaultFittingCharge ?? v.fittingChargeOverride,
    }));
  }

  const calc = useMemo(() => {
    const floorCharge = calcFloorCharge(values.floor, values.liftAvailable, settings);
    const fittingCharge = calcFittingCharge(
      values.fittingRequired,
      settings,
      values.fittingChargeOverride
    );
    const customerTotal = calcCustomerTotal({
      productPrice: values.productPrice,
      quantity: values.quantity,
      floorCharge,
      fittingCharge,
      additionalCharge: values.additionalCharge,
      discount: values.discount,
    });
    const customerPending = calcCustomerPending(customerTotal, values.amountPaid);
    const paymentStatus = derivePaymentStatus(
      customerTotal,
      values.amountPaid,
      values.paymentStatusOverride || undefined
    );
    const vendorTotalCost = calcVendorTotal({
      vendorProductCost: values.vendorProductCost,
      vendorDeliveryCost: values.vendorDeliveryCost,
      vendorOtherCost: values.vendorOtherCost,
    });
    const vendorPending = calcVendorPending(vendorTotalCost, values.vendorPaid);
    const vendorPaymentStatus = deriveVendorPaymentStatus(vendorTotalCost, values.vendorPaid);
    const profit = calcProfit({
      customerTotal,
      vendorTotalCost,
      otherBusinessCost: values.otherBusinessCost,
      commissionType: values.commissionType,
      commissionValue: values.commissionValue,
    });
    return {
      floorCharge,
      fittingCharge,
      customerTotal,
      customerPending,
      paymentStatus,
      vendorTotalCost,
      vendorPending,
      vendorPaymentStatus,
      ...profit,
    };
  }, [values, settings]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...values,
      vendorId: values.vendorId || null,
      deliveryDateExpected: values.deliveryDateExpected || null,
      deliveryDateActual: values.deliveryDateActual || null,
      paymentDate: values.paymentDate || null,
      vendorPaymentDate: values.vendorPaymentDate || null,
      paymentStatusOverride: values.paymentStatusOverride || undefined,
      fittingChargeOverride:
        values.fittingChargeOverride === null || Number.isNaN(values.fittingChargeOverride)
          ? null
          : values.fittingChargeOverride,
    };

    const res = await fetch(mode === "create" ? "/api/orders" : `/api/orders/${orderId}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body?.error?.formErrors?.join(", ") || "Could not save this order. Please check the fields.");
      return;
    }
    const data = await res.json();
    router.push(`/orders/${data.order.id}?saved=1`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {/* Customer Information */}
        <Section title="Customer Information">
          <Grid>
            <Field label="Customer Name" required>
              <input className="input" value={values.customerName} onChange={(e) => set("customerName", e.target.value)} required />
            </Field>
            <Field label="Contact Number" required>
              <input className="input" value={values.contact} onChange={(e) => set("contact", e.target.value)} required />
            </Field>
            <Field label="WhatsApp Number">
              <input className="input" value={values.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </Field>
            <Field label="Postcode">
              <input className="input" value={values.postcode} onChange={(e) => set("postcode", e.target.value)} />
            </Field>
            <Field label="City / Area">
              <input className="input" value={values.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="Complete Delivery Address" required full>
              <textarea className="input" rows={2} value={values.address} onChange={(e) => set("address", e.target.value)} required />
            </Field>
          </Grid>
        </Section>

        {/* Product Information */}
        <Section title="Product Information">
          <Grid>
            <Field label="Select from Products (optional)">
              <select className="input" defaultValue="" onChange={(e) => applyProduct(e.target.value)}>
                <option value="">— choose to autofill —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Product/Order Reference">
              <input className="input" value={values.productCode} onChange={(e) => set("productCode", e.target.value)} />
            </Field>
            <Field label="Product Name" required>
              <input className="input" value={values.productName} onChange={(e) => set("productName", e.target.value)} required />
            </Field>
            <Field label="Product Colour">
              <input className="input" value={values.colour} onChange={(e) => set("colour", e.target.value)} />
            </Field>
            <Field label="Quantity">
              <input type="number" min={1} className="input" value={values.quantity} onChange={(e) => set("quantity", Number(e.target.value))} />
            </Field>
            <Field label={`Product Price (${currency})`} required>
              <input type="number" step="0.01" min={0} className="input" value={values.productPrice} onChange={(e) => set("productPrice", Number(e.target.value))} required />
            </Field>
            <Field label="Vendor">
              <select className="input" value={values.vendorId ?? ""} onChange={(e) => set("vendorId", e.target.value ? Number(e.target.value) : null)}>
                <option value="">— select vendor —</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </Field>
          </Grid>
        </Section>

        {/* Dates */}
        <Section title="Order Dates">
          <Grid>
            <Field label="Booking Date" required>
              <input type="date" className="input" value={values.bookingDate} onChange={(e) => set("bookingDate", e.target.value)} required />
            </Field>
            <Field label="Expected Delivery Date">
              <input type="date" className="input" value={values.deliveryDateExpected} onChange={(e) => set("deliveryDateExpected", e.target.value)} />
            </Field>
            <Field label="Actual Delivery Date">
              <input type="date" className="input" value={values.deliveryDateActual} onChange={(e) => set("deliveryDateActual", e.target.value)} />
            </Field>
            <Field label="Delivery Status">
              <select className="input" value={values.deliveryStatus} onChange={(e) => set("deliveryStatus", e.target.value)}>
                {DELIVERY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </Grid>
        </Section>

        {/* Floor / Lift / Fitting */}
        <Section title="Floor, Lift &amp; Fitting">
          <Grid>
            <Field label="Floor">
              <select className="input" value={values.floor} onChange={(e) => set("floor", e.target.value)}>
                {FLOORS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Lift Available?">
              <YesNo value={values.liftAvailable} onChange={(v) => set("liftAvailable", v)} />
            </Field>
            <Field label="Fitting Required?">
              <YesNo value={values.fittingRequired} onChange={(v) => set("fittingRequired", v)} />
            </Field>
            {values.fittingRequired && (
              <Field label={`Fitting Charge Override (${currency}, optional)`}>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={values.fittingChargeOverride ?? ""}
                  placeholder={settings.fittingDefaultCharge}
                  onChange={(e) => set("fittingChargeOverride", e.target.value === "" ? null : Number(e.target.value))}
                />
              </Field>
            )}
          </Grid>
        </Section>

        <button type="button" onClick={() => setShowAdvanced((s) => !s)} className="text-sm font-medium text-brand-700 hover:underline">
          {showAdvanced ? "− Hide" : "+ Show"} vendor cost, discount &amp; commission details
        </button>

        {showAdvanced && (
          <>
            <Section title="Additional Charges &amp; Discount">
              <Grid>
                <Field label={`Additional Charge (${currency})`}>
                  <input type="number" step="0.01" className="input" value={values.additionalCharge} onChange={(e) => set("additionalCharge", Number(e.target.value))} />
                </Field>
                <Field label={`Discount (${currency})`}>
                  <input type="number" step="0.01" className="input" value={values.discount} onChange={(e) => set("discount", Number(e.target.value))} />
                </Field>
              </Grid>
            </Section>

            <Section title="Customer Payment">
              <Grid>
                <Field label={`Amount Paid (${currency})`}>
                  <input type="number" step="0.01" className="input" value={values.amountPaid} onChange={(e) => set("amountPaid", Number(e.target.value))} />
                </Field>
                <Field label="Payment Status (auto, or override)">
                  <select className="input" value={values.paymentStatusOverride} onChange={(e) => set("paymentStatusOverride", e.target.value)}>
                    <option value="">Auto ({calc.paymentStatus})</option>
                    {CUSTOMER_PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Payment Date">
                  <input type="date" className="input" value={values.paymentDate} onChange={(e) => set("paymentDate", e.target.value)} />
                </Field>
                <Field label="Payment Method">
                  <input className="input" value={values.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} placeholder="Cash, Card, Bank Transfer…" />
                </Field>
                <Field label="Payment Notes" full>
                  <input className="input" value={values.paymentNotes} onChange={(e) => set("paymentNotes", e.target.value)} />
                </Field>
              </Grid>
            </Section>

            <Section title="Vendor Payment">
              <Grid>
                <Field label={`Vendor Product Cost (${currency})`}>
                  <input type="number" step="0.01" className="input" value={values.vendorProductCost} onChange={(e) => set("vendorProductCost", Number(e.target.value))} />
                </Field>
                <Field label={`Vendor Delivery Cost (${currency})`}>
                  <input type="number" step="0.01" className="input" value={values.vendorDeliveryCost} onChange={(e) => set("vendorDeliveryCost", Number(e.target.value))} />
                </Field>
                <Field label={`Vendor Other Charges (${currency})`}>
                  <input type="number" step="0.01" className="input" value={values.vendorOtherCost} onChange={(e) => set("vendorOtherCost", Number(e.target.value))} />
                </Field>
                <Field label={`Vendor Amount Paid (${currency})`}>
                  <input type="number" step="0.01" className="input" value={values.vendorPaid} onChange={(e) => set("vendorPaid", Number(e.target.value))} />
                </Field>
                <Field label="Vendor Payment Date">
                  <input type="date" className="input" value={values.vendorPaymentDate} onChange={(e) => set("vendorPaymentDate", e.target.value)} />
                </Field>
              </Grid>
            </Section>

            <Section title="My Commission / Profit">
              <Grid>
                <Field label="Commission Type">
                  <select className="input" value={values.commissionType} onChange={(e) => set("commissionType", e.target.value)}>
                    {COMMISSION_TYPES.map((c) => (
                      <option key={c} value={c}>
                        {c === "profit" ? "Full profit (default)" : c === "fixed" ? "Fixed amount" : "Percentage of total"}
                      </option>
                    ))}
                  </select>
                </Field>
                {values.commissionType !== "profit" && (
                  <Field label={values.commissionType === "percentage" ? "Commission %" : `Commission Amount (${currency})`}>
                    <input type="number" step="0.01" className="input" value={values.commissionValue} onChange={(e) => set("commissionValue", Number(e.target.value))} />
                  </Field>
                )}
                <Field label={`Additional Business Cost (${currency})`}>
                  <input type="number" step="0.01" className="input" value={values.otherBusinessCost} onChange={(e) => set("otherBusinessCost", Number(e.target.value))} />
                </Field>
              </Grid>
            </Section>

            <Section title="Notes">
              <textarea className="input" rows={2} value={values.notes} onChange={(e) => set("notes", e.target.value)} />
            </Section>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : mode === "create" ? "SAVE ORDER" : "Save Changes"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>

      {/* Live calculation preview */}
      <div className="lg:col-span-1">
        <div className="card sticky top-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            {orderNo ? `Order ${orderNo}` : "Automatic Calculation"}
          </p>
          <TotalRow label="Product Price" value={values.productPrice * values.quantity} currency={currency} />
          <TotalRow label="Floor Charge" value={calc.floorCharge} currency={currency} />
          <TotalRow label="Fitting Charge" value={calc.fittingCharge} currency={currency} />
          <TotalRow label="Additional Charge" value={values.additionalCharge} currency={currency} />
          <TotalRow label="Discount" value={-values.discount} currency={currency} />
          <div className="border-t border-dashed pt-2">
            <TotalRow label="FINAL CUSTOMER TOTAL" value={calc.customerTotal} currency={currency} strong />
          </div>
          <TotalRow label="Amount Paid" value={values.amountPaid} currency={currency} />
          <TotalRow label="Amount Pending" value={calc.customerPending} currency={currency} tone={calc.customerPending > 0 ? "warning" : "success"} />

          <div className="border-t pt-2" />
          <TotalRow label="Vendor Total Cost" value={calc.vendorTotalCost} currency={currency} />
          <TotalRow label="Vendor Paid" value={values.vendorPaid} currency={currency} />
          <TotalRow label="Vendor Pending" value={calc.vendorPending} currency={currency} tone={calc.vendorPending > 0 ? "warning" : "success"} />

          <div className="border-t pt-2" />
          <TotalRow label="Gross Profit" value={calc.grossProfit} currency={currency} />
          <TotalRow label="Net Profit" value={calc.netProfit} currency={currency} strong tone="success" />
          <TotalRow label="My Commission" value={calc.commissionAmount} currency={currency} strong tone="success" />
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  children,
  required,
  full,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function YesNo({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={value ? "btn-primary flex-1 py-2 text-sm" : "btn-secondary flex-1 py-2 text-sm"}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={!value ? "btn-primary flex-1 py-2 text-sm" : "btn-secondary flex-1 py-2 text-sm"}
      >
        No
      </button>
    </div>
  );
}

function TotalRow({
  label,
  value,
  currency,
  strong,
  tone,
}: {
  label: string;
  value: number;
  currency: string;
  strong?: boolean;
  tone?: "warning" | "success";
}) {
  const toneClass = tone === "warning" ? "text-amber-600" : tone === "success" ? "text-green-600" : "text-gray-800";
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={strong ? "font-semibold text-gray-700" : "text-gray-500"}>{label}</span>
      <span className={strong ? `font-bold ${toneClass}` : toneClass}>{formatMoney(value, currency)}</span>
    </div>
  );
}
