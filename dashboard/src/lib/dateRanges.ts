import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";

export type DateRangeKey =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "thisMonth"
  | "lastMonth"
  | "custom";

export function resolveDateRange(
  key: DateRangeKey,
  custom?: { from?: string; to?: string }
): { from: Date; to: Date } {
  const now = new Date();
  switch (key) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "yesterday": {
      const y = subDays(now, 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    }
    case "thisWeek":
      return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) };
    case "thisMonth":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case "lastMonth": {
      const lm = subMonths(now, 1);
      return { from: startOfMonth(lm), to: endOfMonth(lm) };
    }
    case "custom":
      return {
        from: custom?.from ? startOfDay(new Date(custom.from)) : startOfMonth(now),
        to: custom?.to ? endOfDay(new Date(custom.to)) : endOfDay(now),
      };
  }
}

export const DATE_RANGE_OPTIONS: { key: DateRangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisWeek", label: "This Week" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "custom", label: "Custom Range" },
];
