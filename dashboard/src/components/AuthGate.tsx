"use client";

import { useEffect, useState } from "react";
import { ensureFirstRunSeed } from "@/lib/firstRun";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureFirstRunSeed();
    setReady(true);
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
