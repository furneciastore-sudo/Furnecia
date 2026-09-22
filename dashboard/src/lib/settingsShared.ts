// Pure, client-safe settings types/constants — no server-only imports here
// (calculations.ts and client components rely on this file directly).

export const DEFAULT_SETTINGS: Record<string, string> = {
  currencySymbol: "£",
  currencyCode: "GBP",

  floorCharge_Ground: "0",
  floorCharge_1st: "5",
  floorCharge_2nd: "10",
  floorCharge_3rd: "15",
  floorCharge_4th: "20",
  floorCharge_5th: "25",
  floorCharge_Other: "25",

  // How floor charges behave when a lift is available:
  // "full" = still applied, "reduced" = multiplied by liftReducedFactor, "zero" = £0
  liftFloorChargeRule: "reduced",
  liftReducedFactor: "0.5",

  fittingDefaultCharge: "30",

  // profit = commission equals the full net profit (sole trader default)
  // fixed  = a flat amount per order
  // percentage = a % of the customer total
  commissionDefaultType: "profit",
  commissionDefaultValue: "0",

  businessName: "Furnecia",
  businessPhone: "+44 7947 781613",
  businessWhatsapp: "+44 7947 781613",
  businessEmail: "furneciastore@gmail.com",

  orderPrefix: "FRN",

  // Delivery Date Checker — a separate tool from Orders. A product's own
  // lead time wins, then its vendor's, then this fallback default.
  deliveryDefaultLeadTimeDays: "14",
  deliverySkipWeekends: "true",
  deliverySuggestionWindowDays: "3",

  // AI Auto-fill (optional) — lets the Add Order chat box read a
  // free-text order description and fill the form. This is the one
  // feature that needs internet (only while you use it) and your own
  // API key, since it calls Claude or ChatGPT directly from the app.
  aiProvider: "claude",
  aiModel: "",
  aiApiKey: "",
};

export type SettingsMap = typeof DEFAULT_SETTINGS;

export function num(settings: SettingsMap, key: string): number {
  const v = Number((settings as Record<string, string>)[key]);
  return Number.isFinite(v) ? v : 0;
}
