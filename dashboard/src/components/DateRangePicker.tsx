"use client";

import { DATE_RANGE_OPTIONS, type DateRangeKey } from "@/lib/dateRanges";

export function DateRangePicker({
  value,
  customFrom,
  customTo,
  onChange,
  onCustomChange,
}: {
  value: DateRangeKey;
  customFrom?: string;
  customTo?: string;
  onChange: (key: DateRangeKey) => void;
  onCustomChange?: (from: string, to: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {DATE_RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={
            value === opt.key
              ? "btn-primary px-3 py-1.5 text-xs"
              : "btn-secondary px-3 py-1.5 text-xs"
          }
        >
          {opt.label}
        </button>
      ))}
      {value === "custom" && (
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            className="input w-auto py-1.5 text-xs"
            value={customFrom ?? ""}
            onChange={(e) => onCustomChange?.(e.target.value, customTo ?? "")}
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            className="input w-auto py-1.5 text-xs"
            value={customTo ?? ""}
            onChange={(e) => onCustomChange?.(customFrom ?? "", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
