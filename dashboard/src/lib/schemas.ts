import { z } from "zod";
import { FLOORS, DELIVERY_STATUSES, CUSTOMER_PAYMENT_STATUSES, COMMISSION_TYPES } from "@/lib/calculations";

const dateStr = z.string().min(1).nullable().optional();

export const orderInputSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  contact: z.string().min(1, "Contact number is required"),
  whatsapp: z.string().optional().default(""),
  address: z.string().min(1, "Delivery address is required"),
  postcode: z.string().optional().default(""),
  city: z.string().optional().default(""),

  productName: z.string().min(1, "Product name is required"),
  productCode: z.string().optional().default(""),
  colour: z.string().optional().default(""),
  quantity: z.coerce.number().int().min(1).default(1),
  productPrice: z.coerce.number().min(0).default(0),

  vendorId: z.coerce.number().int().nullable().optional(),

  bookingDate: z.string().min(1),
  deliveryDateExpected: dateStr,
  deliveryDateActual: dateStr,

  floor: z.enum(FLOORS).default("Ground Floor"),
  liftAvailable: z.coerce.boolean().default(false),
  fittingRequired: z.coerce.boolean().default(false),
  fittingChargeOverride: z.coerce.number().nullable().optional(),

  additionalCharge: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),

  amountPaid: z.coerce.number().min(0).default(0),
  paymentStatusOverride: z.enum(CUSTOMER_PAYMENT_STATUSES).optional(),
  paymentDate: dateStr,
  paymentMethod: z.string().optional().default(""),
  paymentNotes: z.string().optional().default(""),

  vendorProductCost: z.coerce.number().min(0).default(0),
  vendorDeliveryCost: z.coerce.number().min(0).default(0),
  vendorOtherCost: z.coerce.number().min(0).default(0),
  vendorPaid: z.coerce.number().min(0).default(0),
  vendorPaymentDate: dateStr,

  commissionType: z.enum(COMMISSION_TYPES).default("profit"),
  commissionValue: z.coerce.number().default(0),
  otherBusinessCost: z.coerce.number().min(0).default(0),

  deliveryStatus: z.enum(DELIVERY_STATUSES).default("New Order"),
  notes: z.string().optional().default(""),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export const vendorInputSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  contactPerson: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  whatsapp: z.string().optional().default(""),
  email: z.string().optional().default(""),
  address: z.string().optional().default(""),
  products: z.string().optional().default(""),
  defaultLeadTimeDays: z.coerce.number().int().min(0).nullable().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export const productInputSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  code: z.string().optional().default(""),
  category: z.string().optional().default(""),
  defaultPrice: z.coerce.number().min(0).default(0),
  defaultVendorId: z.coerce.number().int().nullable().optional(),
  defaultVendorCost: z.coerce.number().min(0).default(0),
  defaultFittingCharge: z.coerce.number().nullable().optional(),
  defaultLeadTimeDays: z.coerce.number().int().min(0).nullable().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export const reminderInputSchema = z.object({
  orderId: z.coerce.number().int().nullable().optional(),
  customerName: z.string().optional().default(""),
  type: z.string().min(1),
  date: z.string().min(1),
  time: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  status: z.enum(["Pending", "Completed"]).default("Pending"),
});

export const paymentInputSchema = z.object({
  orderId: z.coerce.number().int(),
  type: z.enum(["customer", "vendor"]),
  amount: z.coerce.number(),
  date: z.string().min(1),
  method: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});
