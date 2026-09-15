"use client";

import { useEffect, useState } from "react";
import { getSettings, listVendorsWithStats } from "@/lib/localApi";
import { ReportsTabs } from "@/components/reports/ReportsTabs";
import type { VendorOption } from "@/lib/orderFormTypes";

export default function ReportsPage() {
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [currency, setCurrency] = useState("£");

  useEffect(() => {
    setVendors(listVendorsWithStats());
    setCurrency(getSettings().currencySymbol);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">Vendor sheets, delivery runs, payments and profit — ready to export or print.</p>
      </div>
      <ReportsTabs vendors={vendors} currency={currency} />
    </div>
  );
}
