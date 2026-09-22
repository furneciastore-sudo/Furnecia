"use client";

import { useEffect } from "react";

/** Opens the browser print dialog automatically when a print-view page loads. */
export function AutoPrint() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 300);
    return () => clearTimeout(t);
  }, []);
  return null;
}
