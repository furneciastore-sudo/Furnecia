export interface VendorOption {
  id: number;
  name: string;
}

export interface ProductOption {
  id: number;
  name: string;
  code: string | null;
  defaultPrice: number;
  defaultVendorId: number | null;
  defaultVendorCost: number;
  defaultFittingCharge: number | null;
}

export interface OrderFormValues {
  customerName: string;
  contact: string;
  whatsapp: string;
  address: string;
  postcode: string;
  city: string;

  productName: string;
  productCode: string;
  colour: string;
  quantity: number;
  productPrice: number;

  vendorId: number | null;

  bookingDate: string;
  deliveryDateExpected: string;
  deliveryDateActual: string;

  floor: string;
  liftAvailable: boolean;
  fittingRequired: boolean;
  fittingChargeOverride: number | null;

  additionalCharge: number;
  discount: number;

  amountPaid: number;
  paymentStatusOverride: string;
  paymentDate: string;
  paymentMethod: string;
  paymentNotes: string;

  vendorProductCost: number;
  vendorDeliveryCost: number;
  vendorOtherCost: number;
  vendorPaid: number;
  vendorPaymentDate: string;

  commissionType: string;
  commissionValue: number;
  otherBusinessCost: number;

  deliveryStatus: string;
  notes: string;
}

export function orderToFormValues(o: Record<string, unknown>): OrderFormValues {
  const dateInput = (v: unknown) => (v ? new Date(v as string).toISOString().slice(0, 10) : "");
  return {
    customerName: String(o.customerName ?? ""),
    contact: String(o.contact ?? ""),
    whatsapp: String(o.whatsapp ?? ""),
    address: String(o.address ?? ""),
    postcode: String(o.postcode ?? ""),
    city: String(o.city ?? ""),
    productName: String(o.productName ?? ""),
    productCode: String(o.productCode ?? ""),
    colour: String(o.colour ?? ""),
    quantity: Number(o.quantity ?? 1),
    productPrice: Number(o.productPrice ?? 0),
    vendorId: (o.vendorId as number | null) ?? null,
    bookingDate: dateInput(o.bookingDate) || new Date().toISOString().slice(0, 10),
    deliveryDateExpected: dateInput(o.deliveryDateExpected),
    deliveryDateActual: dateInput(o.deliveryDateActual),
    floor: String(o.floor ?? "Ground Floor"),
    liftAvailable: Boolean(o.liftAvailable),
    fittingRequired: Boolean(o.fittingRequired),
    fittingChargeOverride: o.fittingRequired ? Number(o.fittingCharge ?? 0) : null,
    additionalCharge: Number(o.additionalCharge ?? 0),
    discount: Number(o.discount ?? 0),
    amountPaid: Number(o.amountPaid ?? 0),
    paymentStatusOverride: ["Cancelled", "Refunded", "COD"].includes(String(o.paymentStatus))
      ? String(o.paymentStatus)
      : "",
    paymentDate: dateInput(o.paymentDate),
    paymentMethod: String(o.paymentMethod ?? ""),
    paymentNotes: String(o.paymentNotes ?? ""),
    vendorProductCost: Number(o.vendorProductCost ?? 0),
    vendorDeliveryCost: Number(o.vendorDeliveryCost ?? 0),
    vendorOtherCost: Number(o.vendorOtherCost ?? 0),
    vendorPaid: Number(o.vendorPaid ?? 0),
    vendorPaymentDate: dateInput(o.vendorPaymentDate),
    commissionType: String(o.commissionType ?? "profit"),
    commissionValue: Number(o.commissionValue ?? 0),
    otherBusinessCost: Number(o.otherBusinessCost ?? 0),
    deliveryStatus: String(o.deliveryStatus ?? "New Order"),
    notes: String(o.notes ?? ""),
  };
}

export function emptyOrderForm(defaults: {
  bookingDate: string;
  floor: string;
  commissionType: string;
}): OrderFormValues {
  return {
    customerName: "",
    contact: "",
    whatsapp: "",
    address: "",
    postcode: "",
    city: "",
    productName: "",
    productCode: "",
    colour: "",
    quantity: 1,
    productPrice: 0,
    vendorId: null,
    bookingDate: defaults.bookingDate,
    deliveryDateExpected: "",
    deliveryDateActual: "",
    floor: defaults.floor,
    liftAvailable: false,
    fittingRequired: false,
    fittingChargeOverride: null,
    additionalCharge: 0,
    discount: 0,
    amountPaid: 0,
    paymentStatusOverride: "",
    paymentDate: "",
    paymentMethod: "",
    paymentNotes: "",
    vendorProductCost: 0,
    vendorDeliveryCost: 0,
    vendorOtherCost: 0,
    vendorPaid: 0,
    vendorPaymentDate: "",
    commissionType: defaults.commissionType,
    commissionValue: 0,
    otherBusinessCost: 0,
    deliveryStatus: "New Order",
    notes: "",
  };
}
