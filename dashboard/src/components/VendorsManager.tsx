"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMoney, telHref, whatsappHref } from "@/lib/format";

interface VendorRow {
  id: number;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  products: string | null;
  defaultLeadTimeDays: number | null;
  status: string;
  stats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    totalVendorCost: number;
    amountPaid: number;
    amountPending: number;
  };
}

const emptyForm = { name: "", contactPerson: "", phone: "", whatsapp: "", email: "", address: "", products: "", defaultLeadTimeDays: "", status: "Active" };

export function VendorsManager({ vendors, currency }: { vendors: VendorRow[]; currency: string }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit(v: VendorRow) {
    setEditingId(v.id);
    setForm({
      name: v.name,
      contactPerson: v.contactPerson ?? "",
      phone: v.phone ?? "",
      whatsapp: v.whatsapp ?? "",
      email: v.email ?? "",
      address: v.address ?? "",
      products: v.products ?? "",
      defaultLeadTimeDays: v.defaultLeadTimeDays != null ? String(v.defaultLeadTimeDays) : "",
      status: v.status,
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
    const url = editingId ? `/api/vendors/${editingId}` : "/api/vendors";
    const payload = {
      ...form,
      defaultLeadTimeDays: form.defaultLeadTimeDays === "" ? null : Number(form.defaultLeadTimeDays),
    };
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
    if (!confirm("Remove this vendor? If it has past orders it will be deactivated instead of deleted.")) return;
    await fetch(`/api/vendors/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Vendors</h1>
        <button onClick={startNew} className="btn-primary">+ Add Vendor</button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Vendor Name *</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Contact Person</label>
            <input className="input" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">WhatsApp</label>
            <input className="input" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="label">Default Delivery Lead Time (days)</label>
            <input
              type="number"
              min={0}
              className="input"
              value={form.defaultLeadTimeDays}
              onChange={(e) => setForm({ ...form, defaultLeadTimeDays: e.target.value })}
              placeholder="Used by the Delivery Date Checker"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Address</label>
            <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Products Supplied</label>
            <input className="input" value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} placeholder="e.g. Sofas, Beds, Wardrobes" />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : editingId ? "Save Vendor" : "Add Vendor"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <div key={v.id} className="card space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/vendors/${v.id}`} className="font-semibold text-brand-700 hover:underline">{v.name}</Link>
                <p className="text-xs text-gray-400">{v.status}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(v)} className="btn-secondary px-2 py-1 text-xs">Edit</button>
                <button onClick={() => remove(v.id)} className="btn-danger px-2 py-1 text-xs">Delete</button>
              </div>
            </div>
            {v.contactPerson && <p className="text-sm text-gray-600">{v.contactPerson}</p>}
            <div className="flex flex-wrap gap-3 text-xs">
              {v.phone && <a className="text-brand-600" href={telHref(v.phone)}>{v.phone}</a>}
              {v.whatsapp && <a className="text-green-600" href={whatsappHref(v.whatsapp)} target="_blank" rel="noreferrer">WhatsApp</a>}
            </div>
            {v.products && <p className="text-xs text-gray-500">Products: {v.products}</p>}
            {v.defaultLeadTimeDays != null && (
              <p className="text-xs text-gray-500">Lead time: {v.defaultLeadTimeDays} days</p>
            )}
            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-2 text-center text-xs">
              <div><p className="font-semibold">{v.stats.totalOrders}</p><p className="text-gray-400">Total</p></div>
              <div><p className="font-semibold text-green-600">{v.stats.completedOrders}</p><p className="text-gray-400">Done</p></div>
              <div><p className="font-semibold text-amber-600">{v.stats.pendingOrders}</p><p className="text-gray-400">Pending</p></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Vendor Cost: {formatMoney(v.stats.totalVendorCost, currency)}</span>
              <span className="text-amber-600">Pending: {formatMoney(v.stats.amountPending, currency)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
