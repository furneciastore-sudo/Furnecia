import { startOfDay, addDays, isBefore } from "date-fns";

export type ReminderBucket = "overdue" | "today" | "tomorrow" | "upcoming" | "completed";

export function classifyReminder(dateIso: string | Date, status: string): ReminderBucket {
  if (status === "Completed") return "completed";
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);
  const d = startOfDay(new Date(dateIso));

  if (isBefore(d, today)) return "overdue";
  if (d.getTime() === today.getTime()) return "today";
  if (d.getTime() === tomorrow.getTime()) return "tomorrow";
  if (isBefore(d, dayAfter)) return "tomorrow";
  return "upcoming";
}

export const REMINDER_TYPES = [
  "Customer Follow-up",
  "Vendor Follow-up",
  "Delivery Confirmation",
  "Payment Follow-up",
  "Vendor Payment Follow-up",
  "Commission Follow-up",
] as const;
