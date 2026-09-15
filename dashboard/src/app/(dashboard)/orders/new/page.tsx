"use client";

import { useEffect, useState } from "react";
import { getSettings, listVendorsWithStats, listProducts } from "@/lib/localApi";
import { OrderForm } from "@/components/OrderForm";
import { emptyOrderForm, type OrderFormValues, type VendorOption, type ProductOption } from "@/lib/orderFormTypes";
import type { SettingsMap } from "@/lib/settingsShared";

export default function NewOrderPage() {
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [settings, setSettings] = useState<SettingsMap | null>(null);
  const [initial, setInitial] = useState<OrderFormValues | null>(null);

  useEffect(() => {
    const s = getSettings();
    setVendors(listVendorsWithStats().filter((v) => v.status === "Active"));
    setProducts(listProducts().filter((p) => p.status === "Active"));
    setSettings(s);
    setInitial(
      emptyOrderForm({
        bookingDate: new Date().toISOString().slice(0, 10),
        floor: "Ground Floor",
        commissionType: s.commissionDefaultType,
      })
    );
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Add New Order</h1>
        <p className="text-sm text-gray-500">
          Fill in the basics — totals, charges, vendor pending and your profit calculate automatically.
        </p>
      </div>
      {settings && initial && (
        <OrderForm mode="create" initial={initial} vendors={vendors} products={products} settings={settings} />
      )}
    </div>
  );
}
