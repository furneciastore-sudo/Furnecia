// Plain data shapes for the offline app — same fields as the old Prisma
// schema, just stored as JSON in localStorage instead of SQLite.

export interface VendorRecord {
  id: number;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  products: string | null;
  defaultLeadTimeDays: number | null;
  status: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRecord {
  id: number;
  name: string;
  code: string | null;
  category: string | null;
  defaultPrice: number;
  defaultVendorId: number | null;
  defaultVendorCost: number;
  defaultFittingCharge: number | null;
  defaultLeadTimeDays: number | null;
  status: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRecord {
  id: number;
  orderNo: string;

  customerName: string;
  contact: string;
  whatsapp: string | null;
  address: string;
  postcode: string | null;
  city: string | null;

  productName: string;
  productCode: string | null;
  colour: string | null;
  quantity: number;
  productPrice: number;

  vendorId: number | null;

  bookingDate: string;
  deliveryDateExpected: string | null;
  deliveryDateActual: string | null;

  floor: string;
  liftAvailable: boolean;
  floorCharge: number;
  fittingRequired: boolean;
  fittingCharge: number;

  additionalCharge: number;
  discount: number;
  customerTotal: number;

  amountPaid: number;
  customerPending: number;
  paymentStatus: string;
  paymentDate: string | null;
  paymentMethod: string | null;
  paymentNotes: string | null;

  vendorProductCost: number;
  vendorDeliveryCost: number;
  vendorOtherCost: number;
  vendorTotalCost: number;
  vendorPaid: number;
  vendorPending: number;
  vendorPaymentStatus: string;
  vendorPaymentDate: string | null;

  commissionType: string;
  commissionValue: number;
  commissionAmount: number;
  otherBusinessCost: number;
  grossProfit: number;
  netProfit: number;

  deliveryStatus: string;
  notes: string | null;

  isArchived: boolean;
  isDemo: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: number;
  orderId: number;
  type: "customer" | "vendor";
  amount: number;
  date: string;
  method: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ReminderRecord {
  id: number;
  orderId: number | null;
  customerName: string | null;
  type: string;
  date: string;
  time: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryScheduleRecord {
  postcodePrefix: string;
  areaName: string | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
