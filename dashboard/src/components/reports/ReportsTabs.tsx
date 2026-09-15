"use client";

import { useState } from "react";
import { VendorDailyReport } from "@/components/reports/VendorDailyReport";
import { DeliveryDailyReport } from "@/components/reports/DeliveryDailyReport";
import { PaymentReport } from "@/components/reports/PaymentReport";
import { ProfitReport } from "@/components/reports/ProfitReport";
import type { VendorOption } from "@/lib/orderFormTypes";

const TABS = [
  { key: "vendor", label: "Daily Vendor Report" },
  { key: "delivery", label: "Today's Delivery Report" },
  { key: "payments", label: "Payment Dashboard" },
  { key: "profit", label: "Profit Dashboard" },
] as const;

export function ReportsTabs({ vendors, currency }: { vendors: VendorOption[]; currency: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("vendor");

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={tab === t.key ? "btn-primary px-3 py-1.5 text-sm" : "btn-secondary px-3 py-1.5 text-sm"}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "vendor" && <VendorDailyReport vendors={vendors} currency={currency} />}
      {tab === "delivery" && <DeliveryDailyReport currency={currency} />}
      {tab === "payments" && <PaymentReport currency={currency} />}
      {tab === "profit" && <ProfitReport currency={currency} />}
    </div>
  );
}
