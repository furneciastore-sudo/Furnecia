"use client";

import { Suspense } from "react";
import { RemindersManager } from "@/components/RemindersManager";

export default function RemindersPage() {
  return (
    <Suspense>
      <RemindersManager />
    </Suspense>
  );
}
