"use client";

import { useState } from "react";
import clsx from "clsx";
import { formatDate } from "@/lib/format";
import { DAY_KEYS, DAY_SHORT, type DayKey } from "@/lib/postcodeSchedule";

interface CheckResult {
  matched: boolean;
  postcode: string;
  matchedPrefix?: string;
  areaName?: string | null;
  daysServed?: DayKey[];
  nextDeliveryDate?: string | null;
  message?: string;
}

/** Delivery Date Checker — postcode based. A standalone tool, separate
 * from Orders: type a postcode, see which day(s) of the week that area
 * is served and the next matching date. */
export function PostcodeChecker() {
  const [postcode, setPostcode] = useState("");
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!postcode.trim()) return;
    setLoading(true);
    const params = new URLSearchParams({ postcode, from: fromDate });
    const res = await fetch(`/api/postcode-check?${params.toString()}`);
    setResult(await res.json());
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form onSubmit={check} className="card space-y-3">
        <div>
          <label className="label">Customer Postcode</label>
          <input
            className="input uppercase"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g. SW11 2AB, LS1, B1"
            autoFocus
          />
        </div>
        <div>
          <label className="label">Check From Date</label>
          <input type="date" className="input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Checking…" : "Check Delivery Date"}
        </button>
      </form>

      <div className="card">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Result</h3>
        {!result ? (
          <p className="text-sm text-gray-400">Type a postcode and check to see which days it's delivered.</p>
        ) : !result.matched ? (
          <p className="text-sm text-amber-600">{result.message}</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {result.areaName ?? result.matchedPrefix} — Delivery Days
              </p>
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {DAY_KEYS.map((d) => {
                  const active = result.daysServed?.includes(d);
                  return (
                    <div
                      key={d}
                      className={clsx(
                        "rounded-lg py-2 text-center text-xs font-semibold",
                        active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {DAY_SHORT[d]}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Next Delivery Date</p>
              <p className="text-2xl font-semibold text-brand-700">
                {result.nextDeliveryDate ? formatDate(result.nextDeliveryDate) : "No days configured"}
              </p>
            </div>

            <p className="border-t border-gray-100 pt-3 text-xs text-gray-400">
              Matched postcode prefix: {result.matchedPrefix}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
