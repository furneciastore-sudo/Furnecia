"use client";

import { useEffect, useState } from "react";
import { ensureFirstRunSeed } from "@/lib/firstRun";
import { isUnlocked, tryUnlock } from "@/lib/localAuth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    ensureFirstRunSeed();
    setUnlocked(isUnlocked());
    setReady(true);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (tryUnlock(password)) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  if (!ready) return null;

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-900 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
              F
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Furnecia Dashboard</h1>
            <p className="text-sm text-gray-500">Works fully offline — all data stays on this device</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter dashboard password"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
            <p className="text-center text-xs text-gray-400">
              Default password: furnecia123 — change it in Settings once you're in.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
