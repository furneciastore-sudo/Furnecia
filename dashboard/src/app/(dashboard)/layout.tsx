"use client";

import { useEffect, useState } from "react";
import { getSettings } from "@/lib/localApi";
import { AppShell } from "@/components/AppShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [businessName, setBusinessName] = useState("Furnecia");

  useEffect(() => {
    setBusinessName(getSettings().businessName);
  }, []);

  return <AppShell businessName={businessName}>{children}</AppShell>;
}
