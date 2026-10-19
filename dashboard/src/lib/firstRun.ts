import { hasAnyData, markSeeded, readValue, writeValue } from "@/lib/localStore";
import { saveDeliverySchedule } from "@/lib/localApi";
import { DELIVERY_SCHEDULE_SEED } from "@/lib/deliveryScheduleSeed";

// Bump this whenever DELIVERY_SCHEDULE_SEED is updated from a new
// official route sheet, so existing installs pick up the correction
// automatically on next launch — without touching their orders,
// vendors, products or settings.
const DELIVERY_SCHEDULE_VERSION = "2026-final-new-routes";
const VERSION_KEY = "deliveryScheduleVersion";

/** Runs once on the very first launch: loads the real UK delivery-day
 * reference data so the Delivery Checker is useful immediately. Orders,
 * vendors and products start empty — this is a real app for real data,
 * not a demo. */
export function ensureFirstRunSeed(): void {
  if (!hasAnyData()) {
    saveDeliverySchedule(DELIVERY_SCHEDULE_SEED);
    markSeeded();
    writeValue(VERSION_KEY, DELIVERY_SCHEDULE_VERSION);
    return;
  }

  // Existing install: apply a newer route sheet if one has shipped
  // since this device last updated, without resetting anything else.
  if (readValue(VERSION_KEY) !== DELIVERY_SCHEDULE_VERSION) {
    saveDeliverySchedule(DELIVERY_SCHEDULE_SEED);
    writeValue(VERSION_KEY, DELIVERY_SCHEDULE_VERSION);
  }
}
