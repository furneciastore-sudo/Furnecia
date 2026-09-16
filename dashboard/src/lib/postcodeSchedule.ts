export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const DAY_SHORT: Record<DayKey, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

// JS Date#getDay(): 0=Sunday..6=Saturday
const DAY_KEY_BY_JS_INDEX: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function normalizePostcode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export interface ScheduleRow {
  postcodePrefix: string;
  areaName?: string | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

/** Longest-prefix match — e.g. an input of "BS8 1QG" matches a row for
 * "BS" rather than a row for "B", if both exist. */
export function matchPostcode(rawInput: string, rows: ScheduleRow[]): ScheduleRow | null {
  const input = normalizePostcode(rawInput);
  if (!input) return null;

  let best: ScheduleRow | null = null;
  for (const row of rows) {
    const prefix = normalizePostcode(row.postcodePrefix);
    if (prefix && input.startsWith(prefix)) {
      if (!best || prefix.length > best.postcodePrefix.length) {
        best = row;
      }
    }
  }
  return best;
}

export function daysServedByRow(row: ScheduleRow): DayKey[] {
  return DAY_KEYS.filter((k) => row[k]);
}

/** Next date on/after `from` whose weekday is one of the served days. */
export function nextServiceDate(row: ScheduleRow, from: Date): Date | null {
  const served = daysServedByRow(row);
  if (served.length === 0) return null;

  for (let i = 0; i < 8; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const key = DAY_KEY_BY_JS_INDEX[d.getDay()];
    if (served.includes(key)) return d;
  }
  return null;
}
