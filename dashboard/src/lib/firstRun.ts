import { hasAnyData, markSeeded } from "@/lib/localStore";
import { saveDeliverySchedule } from "@/lib/localApi";
import { DELIVERY_SCHEDULE_SEED } from "@/lib/deliveryScheduleSeed";

/** Runs once on the very first launch: loads the real UK delivery-day
 * reference data so the Delivery Checker is useful immediately. Orders,
 * vendors and products start empty — this is a real app for real data,
 * not a demo. */
export function ensureFirstRunSeed(): void {
  if (hasAnyData()) return;
  saveDeliverySchedule(DELIVERY_SCHEDULE_SEED);
  markSeeded();
}
