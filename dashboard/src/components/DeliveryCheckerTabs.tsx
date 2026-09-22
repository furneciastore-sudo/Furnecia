"use client";

import { useState } from "react";
import { PostcodeChecker } from "@/components/PostcodeChecker";
import { DeliveryScheduleManager } from "@/components/DeliveryScheduleManager";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import type { VendorOption, ProductOption } from "@/lib/orderFormTypes";

const TABS = [
  { key: "postcode", label: "Check by Postcode" },
  { key: "manage", label: "Manage Schedule" },
  { key: "leadtime", label: "Check by Lead Time" },
] as const;

export function DeliveryCheckerTabs({ vendors, products }: { vendors: VendorOption[]; products: ProductOption[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("postcode");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
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

      {tab === "postcode" && <PostcodeChecker />}
      {tab === "manage" && <DeliveryScheduleManager />}
      {tab === "leadtime" && <DeliveryChecker vendors={vendors} products={products} />}
    </div>
  );
}
