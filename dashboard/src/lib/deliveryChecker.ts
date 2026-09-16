import { addDays, isSaturday, isSunday, format } from "date-fns";
import { num, type SettingsMap } from "@/lib/settingsShared";

export type LeadTimeSource = "product" | "vendor" | "default";

export interface LeadTimeInput {
  productLeadTimeDays?: number | null;
  vendorLeadTimeDays?: number | null;
  settings: SettingsMap;
}

/** A product's own lead time wins, then its vendor's, then the global
 * default from Settings — nothing about specific products/vendors is
 * hard-coded, it's all data you configure on the Vendor/Product pages. */
export function resolveLeadTimeDays(input: LeadTimeInput): { days: number; source: LeadTimeSource } {
  if (input.productLeadTimeDays != null) {
    return { days: input.productLeadTimeDays, source: "product" };
  }
  if (input.vendorLeadTimeDays != null) {
    return { days: input.vendorLeadTimeDays, source: "vendor" };
  }
  return { days: num(input.settings, "deliveryDefaultLeadTimeDays"), source: "default" };
}

function addLeadDays(start: Date, days: number, skipWeekends: boolean): Date {
  if (!skipWeekends) return addDays(start, days);
  let date = start;
  let remaining = days;
  while (remaining > 0) {
    date = addDays(date, 1);
    if (!isSaturday(date) && !isSunday(date)) remaining -= 1;
  }
  return date;
}

export interface DeliveryEstimateInput {
  bookingDate: Date;
  leadTimeDays: number;
  settings: SettingsMap;
}

export interface DeliveryEstimateResult {
  earliestDate: string;
  suggestedDates: string[];
  leadTimeDays: number;
  skippedWeekends: boolean;
}

/** Suggests an earliest delivery date plus a short window of extra
 * options, skipping weekends if configured — a plain, generic lead-time
 * calculator, not a rules engine tied to particular products. */
export function computeDeliveryEstimate(input: DeliveryEstimateInput): DeliveryEstimateResult {
  const skipWeekends = input.settings.deliverySkipWeekends !== "false";
  const windowDays = Math.max(0, num(input.settings, "deliverySuggestionWindowDays"));

  const earliest = addLeadDays(input.bookingDate, input.leadTimeDays, skipWeekends);
  const suggested: Date[] = [earliest];
  let cursor = earliest;
  while (suggested.length <= windowDays) {
    cursor = addLeadDays(cursor, 1, skipWeekends);
    suggested.push(cursor);
  }

  return {
    earliestDate: format(earliest, "yyyy-MM-dd"),
    suggestedDates: suggested.map((d) => format(d, "yyyy-MM-dd")),
    leadTimeDays: input.leadTimeDays,
    skippedWeekends: skipWeekends,
  };
}
