"use client";

import { useEffect, useState, useCallback } from "react";
import { DAY_KEYS, DAY_SHORT, type DayKey } from "@/lib/postcodeSchedule";

interface ScheduleRow {
  postcodePrefix: string;
  areaName: string | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

const SHORT_TO_KEY: Record<string, DayKey> = Object.fromEntries(
  DAY_KEYS.map((k) => [DAY_SHORT[k].toLowerCase(), k])
) as Record<string, DayKey>;

function rowsToText(rows: ScheduleRow[]): string {
  return rows
    .map((r) => {
      const days = DAY_KEYS.filter((k) => r[k])
        .map((k) => DAY_SHORT[k])
        .join(",");
      return `${r.postcodePrefix} | ${r.areaName ?? ""} | ${days}`;
    })
    .join("\n");
}

function parseLine(line: string): { postcodePrefix: string; areaName?: string; days: string[] } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const parts = trimmed.split("|").map((p) => p.trim());
  const postcodePrefix = (parts[0] ?? "").toUpperCase();
  if (!postcodePrefix) return null;
  const areaName = parts[1] || undefined;
  const daysRaw = parts[2] ?? "";
  const dayKeySet: readonly string[] = DAY_KEYS;
  const days = daysRaw
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean)
    .map((d): DayKey | null => {
      if (SHORT_TO_KEY[d]) return SHORT_TO_KEY[d];
      if (dayKeySet.includes(d)) return d as DayKey;
      return null;
    })
    .filter((d): d is DayKey => d !== null);
  return { postcodePrefix, areaName, days };
}

/** Bulk text editor for the postcode -> delivery day schedule. This data
 * was transcribed from courier schedule photos — review every row here
 * against the real chart before relying on it for customer promises. */
export function DeliveryScheduleManager() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/delivery-schedule");
    const data = await res.json();
    const rows: ScheduleRow[] = data.rows ?? [];
    setText(rowsToText(rows));
    setRowCount(rows.length);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setSaving(true);
    const parsed = text
      .split("\n")
      .map(parseLine)
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const res = await fetch("/api/delivery-schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: parsed }),
    });
    const data = await res.json();
    setRowCount((data.rows ?? []).length);
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="space-y-3">
      <div className="card space-y-2 text-sm text-gray-600">
        <p className="font-semibold text-gray-800">Format: one row per line</p>
        <code className="block rounded bg-gray-50 p-2 text-xs text-gray-700">
          POSTCODE PREFIX | Area Name (optional) | Days, comma-separated (Mon,Tue,Wed,Thu,Fri,Sat,Sun)
        </code>
        <p className="text-xs text-gray-400">
          Example: <code>BS | Bristol | Tue,Fri</code> — matches any postcode starting with BS (e.g. BS8 1QG). The
          longest matching prefix wins, so you can add both <code>B</code> and <code>BS</code> and they won't clash.
          Blank lines and lines starting with <code>#</code> are ignored. Saving replaces the whole table with what's
          in the box below.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <>
          <textarea
            className="input min-h-[420px] font-mono text-xs"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
          <div className="flex items-center gap-3">
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save Schedule"}
            </button>
            <span className="text-xs text-gray-400">{rowCount} postcode prefixes configured</span>
            {savedAt && <span className="text-xs text-green-600">Saved at {savedAt}</span>}
          </div>
        </>
      )}
    </div>
  );
}
