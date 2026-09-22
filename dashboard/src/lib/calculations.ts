import { num, type SettingsMap } from "@/lib/settingsShared";

export const FLOORS = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
  "5th Floor",
  "Other",
] as const;
export type Floor = (typeof FLOORS)[number];

const FLOOR_SETTING_KEY: Record<Floor, string> = {
  "Ground Floor": "floorCharge_Ground",
  "1st Floor": "floorCharge_1st",
  "2nd Floor": "floorCharge_2nd",
  "3rd Floor": "floorCharge_3rd",
  "4th Floor": "floorCharge_4th",
  "5th Floor": "floorCharge_5th",
  Other: "floorCharge_Other",
};

export const DELIVERY_STATUSES = [
  "New Order",
  "Confirmed",
  "Vendor Confirmed",
  "Ready for Delivery",
  "Delivery Scheduled",
  "Out for Delivery",
  "Delivered",
  "Delivery Failed",
  "Rescheduled",
  "Cancelled",
  "Returned",
] as const;

export const CUSTOMER_PAYMENT_STATUSES = [
  "Not Paid",
  "Deposit Paid",
  "Partially Paid",
  "Fully Paid",
  "COD",
  "Cancelled",
  "Refunded",
] as const;

export const VENDOR_PAYMENT_STATUSES = [
  "Not Paid",
  "Partially Paid",
  "Fully Paid",
] as const;

export const COMMISSION_TYPES = ["profit", "fixed", "percentage"] as const;
export type CommissionType = (typeof COMMISSION_TYPES)[number];

/** Floor charge, respecting the configurable lift rule. Never typed in by hand. */
export function calcFloorCharge(
  floor: string,
  liftAvailable: boolean,
  settings: SettingsMap
): number {
  const key = FLOOR_SETTING_KEY[floor as Floor] ?? FLOOR_SETTING_KEY.Other;
  const base = num(settings, key);
  if (floor === "Ground Floor") return 0;
  if (!liftAvailable) return base;

  const rule = settings.liftFloorChargeRule;
  if (rule === "zero") return 0;
  if (rule === "reduced") {
    const factor = num(settings, "liftReducedFactor");
    return round2(base * factor);
  }
  return base; // "full"
}

export function calcFittingCharge(
  fittingRequired: boolean,
  settings: SettingsMap,
  overrideCharge?: number | null
): number {
  if (!fittingRequired) return 0;
  if (overrideCharge != null && !Number.isNaN(overrideCharge)) return overrideCharge;
  return num(settings, "fittingDefaultCharge");
}

export interface CustomerTotalInput {
  productPrice: number;
  quantity?: number;
  floorCharge: number;
  fittingCharge: number;
  additionalCharge?: number;
  discount?: number;
}

export function calcCustomerTotal(input: CustomerTotalInput): number {
  const qty = input.quantity ?? 1;
  const total =
    input.productPrice * qty +
    input.floorCharge +
    input.fittingCharge +
    (input.additionalCharge ?? 0) -
    (input.discount ?? 0);
  return round2(Math.max(0, total));
}

export function calcCustomerPending(customerTotal: number, amountPaid: number): number {
  return round2(Math.max(0, customerTotal - amountPaid));
}

export function derivePaymentStatus(
  customerTotal: number,
  amountPaid: number,
  currentStatus?: string
): string {
  if (currentStatus === "Cancelled" || currentStatus === "Refunded" || currentStatus === "COD") {
    return currentStatus;
  }
  if (amountPaid <= 0) return "Not Paid";
  if (amountPaid >= customerTotal) return "Fully Paid";
  return "Partially Paid";
}

export interface VendorTotalInput {
  vendorProductCost: number;
  vendorDeliveryCost?: number;
  vendorOtherCost?: number;
}

export function calcVendorTotal(input: VendorTotalInput): number {
  return round2(
    input.vendorProductCost + (input.vendorDeliveryCost ?? 0) + (input.vendorOtherCost ?? 0)
  );
}

export function calcVendorPending(vendorTotal: number, vendorPaid: number): number {
  return round2(Math.max(0, vendorTotal - vendorPaid));
}

export function deriveVendorPaymentStatus(vendorTotal: number, vendorPaid: number): string {
  if (vendorPaid <= 0) return "Not Paid";
  if (vendorPaid >= vendorTotal) return "Fully Paid";
  return "Partially Paid";
}

export interface ProfitInput {
  customerTotal: number;
  vendorTotalCost: number;
  otherBusinessCost?: number;
  commissionType: CommissionType | string;
  commissionValue?: number;
}

export interface ProfitResult {
  grossProfit: number;
  netProfit: number;
  commissionAmount: number;
}

/** My commission / profit — never entered by hand, always derived. */
export function calcProfit(input: ProfitInput): ProfitResult {
  const otherCost = input.otherBusinessCost ?? 0;
  const grossProfit = round2(input.customerTotal - input.vendorTotalCost);
  const netProfit = round2(grossProfit - otherCost);

  let commissionAmount: number;
  switch (input.commissionType) {
    case "fixed":
      commissionAmount = input.commissionValue ?? 0;
      break;
    case "percentage":
      commissionAmount = round2((input.customerTotal * (input.commissionValue ?? 0)) / 100);
      break;
    default: // "profit"
      commissionAmount = netProfit;
  }

  return { grossProfit, netProfit, commissionAmount: round2(commissionAmount) };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Full server-side recalculation for an order — the single source of truth
 * used by both create and edit, so nothing has to be computed twice or by hand. */
export interface OrderCalcInput {
  productPrice: number;
  quantity: number;
  floor: string;
  liftAvailable: boolean;
  fittingRequired: boolean;
  fittingChargeOverride?: number | null;
  additionalCharge: number;
  discount: number;
  amountPaid: number;
  paymentStatusInput?: string; // Cancelled/Refunded/COD are respected if explicitly chosen
  vendorProductCost: number;
  vendorDeliveryCost: number;
  vendorOtherCost: number;
  vendorPaid: number;
  otherBusinessCost: number;
  commissionType: string;
  commissionValue: number;
}

export interface OrderCalcResult {
  floorCharge: number;
  fittingCharge: number;
  customerTotal: number;
  customerPending: number;
  paymentStatus: string;
  vendorTotalCost: number;
  vendorPending: number;
  vendorPaymentStatus: string;
  grossProfit: number;
  netProfit: number;
  commissionAmount: number;
}

export function calcOrder(input: OrderCalcInput, settings: SettingsMap): OrderCalcResult {
  const floorCharge = calcFloorCharge(input.floor, input.liftAvailable, settings);
  const fittingCharge = calcFittingCharge(
    input.fittingRequired,
    settings,
    input.fittingChargeOverride
  );
  const customerTotal = calcCustomerTotal({
    productPrice: input.productPrice,
    quantity: input.quantity,
    floorCharge,
    fittingCharge,
    additionalCharge: input.additionalCharge,
    discount: input.discount,
  });
  const customerPending = calcCustomerPending(customerTotal, input.amountPaid);
  const paymentStatus = derivePaymentStatus(
    customerTotal,
    input.amountPaid,
    input.paymentStatusInput
  );

  const vendorTotalCost = calcVendorTotal({
    vendorProductCost: input.vendorProductCost,
    vendorDeliveryCost: input.vendorDeliveryCost,
    vendorOtherCost: input.vendorOtherCost,
  });
  const vendorPending = calcVendorPending(vendorTotalCost, input.vendorPaid);
  const vendorPaymentStatus = deriveVendorPaymentStatus(vendorTotalCost, input.vendorPaid);

  const { grossProfit, netProfit, commissionAmount } = calcProfit({
    customerTotal,
    vendorTotalCost,
    otherBusinessCost: input.otherBusinessCost,
    commissionType: input.commissionType,
    commissionValue: input.commissionValue,
  });

  return {
    floorCharge,
    fittingCharge,
    customerTotal,
    customerPending,
    paymentStatus,
    vendorTotalCost,
    vendorPending,
    vendorPaymentStatus,
    grossProfit,
    netProfit,
    commissionAmount,
  };
}
