"use client";

import { useEffect, useState } from "react";
import { listVendorsWithStats, listProducts } from "@/lib/localApi";
import { DeliveryCheckerTabs } from "@/components/DeliveryCheckerTabs";
import type { VendorOption, ProductOption } from "@/lib/orderFormTypes";

export default function DeliveryCheckerPage() {
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);

  useEffect(() => {
    setVendors(listVendorsWithStats().filter((v) => v.status === "Active"));
    setProducts(listProducts().filter((p) => p.status === "Active"));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Delivery Date Checker</h1>
        <p className="text-sm text-gray-500">
          A standalone tool — separate from Orders. Check by customer postcode against your real delivery-day
          schedule, or by a product/vendor lead time.
        </p>
      </div>
      <DeliveryCheckerTabs vendors={vendors} products={products} />
    </div>
  );
}
