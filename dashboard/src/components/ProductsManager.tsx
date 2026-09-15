"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/format";
import type { VendorOption } from "@/lib/orderFormTypes";

interface ProductRow {
  id: number;
  name: string;
  code: string | null;
  category: string | null;
  defaultPrice: number;
  defaultVendorId: number | null;
  defaultVendor: { id: number; name: string } | null;
  defaultVendorCost: number;
  defaultFittingCharge: number | null;
  defaultLeadTimeDays: number | null;
  status: string;
}

const emptyForm = {
  name: "",
  code: "",
  category: "",
  defaultPrice: "0",
  defaultVendorId: "",
  defaultVendorCost: "0",
  defaultFittingCharge: "",
  defaultLeadTimeDays: "",
  status: "Active",
};

export function ProductsManager({ products, vendors, currency }: { products: ProductRow[]; vendors: VendorOption[]; currency: string }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit(p: ProductRow) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      code: p.code ?? "",
      category: p.category ?? "",
      defaultPrice: String(p.defaultPrice),
      defaultVendorId: p.defaultVendorId ? String(p.defaultVendorId) : "",
      defaultVendorCost: String(p.defaultVendorCost),
      defaultFittingCharge: p.defaultFittingCharge != null ? String(p.defaultFittingCharge) : "",
      defaultLeadTimeDays: p.defaultLeadTimeDays != null ? String(p.defaultLeadTimeDays) : "",
      status: p.status,
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      defaultVendorId: form.defaultVendorId ? Number(form.defaultVendorId) : null,
      defaultFittingCharge: form.defaultFittingCharge === "" ? null : Number(form.defaultFittingCharge),
      defaultLeadTimeDays: form.defaultLeadTimeDays === "" ? null : Number(form.defaultLeadTimeDays),
    };
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setShowForm(false);
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Set this product to Inactive? It will stop appearing in the order form.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Products</h1>
        <button onClick={startNew} className="btn-primary">+ Add Product</button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Product Name *</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Product Code</label>
            <input className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="label">Default Price ({currency})</label>
            <input type="number" step="0.01" className="input" value={form.defaultPrice} onChange={(e) => setForm({ ...form, defaultPrice: e.target.value })} />
          </div>
          <div>
            <label className="label">Default Vendor</label>
            <select className="input" value={form.defaultVendorId} onChange={(e) => setForm({ ...form, defaultVendorId: e.target.value })}>
              <option value="">— none —</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Default Vendor Cost ({currency})</label>
            <input type="number" step="0.01" className="input" value={form.defaultVendorCost} onChange={(e) => setForm({ ...form, defaultVendorCost: e.target.value })} />
          </div>
          <div>
            <label className="label">Default Fitting Charge ({currency}, optional)</label>
            <input type="number" step="0.01" className="input" value={form.defaultFittingCharge} onChange={(e) => setForm({ ...form, defaultFittingCharge: e.target.value })} />
          </div>
          <div>
            <label className="label">Delivery Lead Time (days, optional)</label>
            <input
              type="number"
              min={0}
              className="input"
              value={form.defaultLeadTimeDays}
              onChange={(e) => setForm({ ...form, defaultLeadTimeDays: e.target.value })}
              placeholder="Overrides the vendor's lead time"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : editingId ? "Save Product" : "Add Product"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-[800px] w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Default Price</th>
              <th className="px-3 py-2">Default Vendor</th>
              <th className="px-3 py-2">Vendor Cost</th>
              <th className="px-3 py-2">Lead Time</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2">{p.code ?? "—"}</td>
                <td className="px-3 py-2">{p.category ?? "—"}</td>
                <td className="px-3 py-2">{formatMoney(p.defaultPrice, currency)}</td>
                <td className="px-3 py-2">{p.defaultVendor?.name ?? "—"}</td>
                <td className="px-3 py-2">{formatMoney(p.defaultVendorCost, currency)}</td>
                <td className="px-3 py-2">{p.defaultLeadTimeDays != null ? `${p.defaultLeadTimeDays} days` : "—"}</td>
                <td className="px-3 py-2">
                  <span className={p.status === "Active" ? "badge bg-green-50 text-green-700" : "badge bg-gray-100 text-gray-500"}>{p.status}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(p)} className="btn-secondary px-2 py-1 text-xs">Edit</button>
                    <button onClick={() => remove(p.id)} className="btn-danger px-2 py-1 text-xs">Deactivate</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
