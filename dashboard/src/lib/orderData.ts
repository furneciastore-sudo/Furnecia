import { calcOrder } from "@/lib/calculations";
import type { OrderInput } from "@/lib/schemas";
import type { SettingsMap } from "@/lib/settings";

/** Builds the full Prisma `Order` data object from a validated form input,
 * running every charge/total/profit calculation server-side so the client
 * never has to compute (or the user type in) a derived value. */
export function buildOrderData(input: OrderInput, settings: SettingsMap) {
  const calc = calcOrder(
    {
      productPrice: input.productPrice,
      quantity: input.quantity,
      floor: input.floor,
      liftAvailable: input.liftAvailable,
      fittingRequired: input.fittingRequired,
      fittingChargeOverride: input.fittingChargeOverride ?? null,
      additionalCharge: input.additionalCharge,
      discount: input.discount,
      amountPaid: input.amountPaid,
      paymentStatusInput: input.paymentStatusOverride,
      vendorProductCost: input.vendorProductCost,
      vendorDeliveryCost: input.vendorDeliveryCost,
      vendorOtherCost: input.vendorOtherCost,
      vendorPaid: input.vendorPaid,
      otherBusinessCost: input.otherBusinessCost,
      commissionType: input.commissionType,
      commissionValue: input.commissionValue,
    },
    settings
  );

  return {
    customerName: input.customerName,
    contact: input.contact,
    whatsapp: input.whatsapp || null,
    address: input.address,
    postcode: input.postcode || null,
    city: input.city || null,

    productName: input.productName,
    productCode: input.productCode || null,
    colour: input.colour || null,
    quantity: input.quantity,
    productPrice: input.productPrice,

    vendorId: input.vendorId ?? null,

    bookingDate: new Date(input.bookingDate),
    deliveryDateExpected: input.deliveryDateExpected ? new Date(input.deliveryDateExpected) : null,
    deliveryDateActual: input.deliveryDateActual ? new Date(input.deliveryDateActual) : null,

    floor: input.floor,
    liftAvailable: input.liftAvailable,
    floorCharge: calc.floorCharge,
    fittingRequired: input.fittingRequired,
    fittingCharge: calc.fittingCharge,

    additionalCharge: input.additionalCharge,
    discount: input.discount,
    customerTotal: calc.customerTotal,

    amountPaid: input.amountPaid,
    customerPending: calc.customerPending,
    paymentStatus: calc.paymentStatus,
    paymentDate: input.paymentDate ? new Date(input.paymentDate) : null,
    paymentMethod: input.paymentMethod || null,
    paymentNotes: input.paymentNotes || null,

    vendorProductCost: input.vendorProductCost,
    vendorDeliveryCost: input.vendorDeliveryCost,
    vendorOtherCost: input.vendorOtherCost,
    vendorTotalCost: calc.vendorTotalCost,
    vendorPaid: input.vendorPaid,
    vendorPending: calc.vendorPending,
    vendorPaymentStatus: calc.vendorPaymentStatus,
    vendorPaymentDate: input.vendorPaymentDate ? new Date(input.vendorPaymentDate) : null,

    commissionType: input.commissionType,
    commissionValue: input.commissionValue,
    commissionAmount: calc.commissionAmount,
    otherBusinessCost: input.otherBusinessCost,
    grossProfit: calc.grossProfit,
    netProfit: calc.netProfit,

    deliveryStatus: input.deliveryStatus,
    notes: input.notes || null,
  };
}
