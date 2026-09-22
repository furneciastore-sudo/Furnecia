// The entire "backend" for the offline app. Every function here does
// exactly what the old Next.js API routes did, except it reads/writes
// localStorage instead of talking to a Prisma/SQLite server — so it
// works with the WebView completely disconnected from the internet.

import { readCollection, writeCollection, nextId, readJson, writeJson } from "@/lib/localStore";
import { DEFAULT_SETTINGS, type SettingsMap } from "@/lib/settingsShared";
import {
  calcOrder,
  calcCustomerPending,
  derivePaymentStatus,
  calcVendorPending,
  deriveVendorPaymentStatus,
  DELIVERY_STATUSES,
} from "@/lib/calculations";
import { orderInputSchema, vendorInputSchema, productInputSchema, reminderInputSchema, paymentInputSchema } from "@/lib/schemas";
import { toCsv } from "@/lib/csv";
import { resolveDateRange, type DateRangeKey } from "@/lib/dateRanges";
import { matchPostcode, daysServedByRow, nextServiceDate, type ScheduleRow } from "@/lib/postcodeSchedule";
import { startOfDay, endOfDay, format } from "date-fns";
import type {
  VendorRecord,
  ProductRecord,
  OrderRecord,
  PaymentRecord,
  ReminderRecord,
  DeliveryScheduleRecord,
} from "@/lib/models";

class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------

export function getSettings(): SettingsMap {
  const stored = readJson<Record<string, string>>("settings", {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function setSettings(values: Record<string, string>): SettingsMap {
  const current = readJson<Record<string, string>>("settings", {});
  writeJson("settings", { ...current, ...values });
  return getSettings();
}

// ---------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------

function vendors(): VendorRecord[] {
  return readCollection<VendorRecord>("vendors");
}

export function listVendorsWithStats() {
  const allVendors = vendors();
  const allOrders = readCollection<OrderRecord>("orders");

  return allVendors
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((v) => {
      const activeOrders = allOrders.filter((o) => o.vendorId === v.id && !o.isArchived);
      const completed = activeOrders.filter((o) => o.deliveryStatus === "Delivered").length;
      const cancelled = activeOrders.filter((o) =>
        ["Cancelled", "Returned", "Delivery Failed"].includes(o.deliveryStatus)
      ).length;
      return {
        ...v,
        stats: {
          totalOrders: activeOrders.length,
          completedOrders: completed,
          pendingOrders: activeOrders.length - completed - cancelled,
          cancelledOrders: cancelled,
          totalVendorCost: activeOrders.reduce((s, o) => s + o.vendorTotalCost, 0),
          amountPaid: activeOrders.reduce((s, o) => s + o.vendorPaid, 0),
          amountPending: activeOrders.reduce((s, o) => s + o.vendorPending, 0),
        },
      };
    });
}

export function getVendor(id: number) {
  const v = vendors().find((x) => x.id === id);
  if (!v) throw new ApiError("Vendor not found", 404);
  const orders = readCollection<OrderRecord>("orders")
    .filter((o) => o.vendorId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { ...v, orders };
}

export function createVendor(input: unknown): VendorRecord {
  const parsed = vendorInputSchema.parse(input);
  const list = vendors();
  const record: VendorRecord = {
    id: nextId("vendors"),
    name: parsed.name,
    contactPerson: parsed.contactPerson || null,
    phone: parsed.phone || null,
    whatsapp: parsed.whatsapp || null,
    email: parsed.email || null,
    address: parsed.address || null,
    products: parsed.products || null,
    defaultLeadTimeDays: parsed.defaultLeadTimeDays ?? null,
    status: parsed.status,
    isDemo: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  writeCollection("vendors", [...list, record]);
  return record;
}

export function updateVendor(id: number, input: unknown): VendorRecord {
  const parsed = vendorInputSchema.parse(input);
  const list = vendors();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) throw new ApiError("Vendor not found", 404);
  const updated: VendorRecord = {
    ...list[idx],
    name: parsed.name,
    contactPerson: parsed.contactPerson || null,
    phone: parsed.phone || null,
    whatsapp: parsed.whatsapp || null,
    email: parsed.email || null,
    address: parsed.address || null,
    products: parsed.products || null,
    defaultLeadTimeDays: parsed.defaultLeadTimeDays ?? null,
    status: parsed.status,
    updatedAt: nowIso(),
  };
  list[idx] = updated;
  writeCollection("vendors", list);
  return updated;
}

export function deleteVendor(id: number): { deactivatedOnly: boolean } {
  const orderCount = readCollection<OrderRecord>("orders").filter((o) => o.vendorId === id).length;
  const list = vendors();
  if (orderCount > 0) {
    const idx = list.findIndex((v) => v.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], status: "Inactive", updatedAt: nowIso() };
      writeCollection("vendors", list);
    }
    return { deactivatedOnly: true };
  }
  writeCollection(
    "vendors",
    list.filter((v) => v.id !== id)
  );
  return { deactivatedOnly: false };
}

// ---------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------

function products(): ProductRecord[] {
  return readCollection<ProductRecord>("products");
}

export function listProducts() {
  const allVendors = vendors();
  return products()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({
      ...p,
      defaultVendor: p.defaultVendorId ? allVendors.find((v) => v.id === p.defaultVendorId) ?? null : null,
    }));
}

export function createProduct(input: unknown): ProductRecord {
  const parsed = productInputSchema.parse(input);
  const record: ProductRecord = {
    id: nextId("products"),
    name: parsed.name,
    code: parsed.code || null,
    category: parsed.category || null,
    defaultPrice: parsed.defaultPrice,
    defaultVendorId: parsed.defaultVendorId ?? null,
    defaultVendorCost: parsed.defaultVendorCost,
    defaultFittingCharge: parsed.defaultFittingCharge ?? null,
    defaultLeadTimeDays: parsed.defaultLeadTimeDays ?? null,
    status: parsed.status,
    isDemo: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  writeCollection("products", [...products(), record]);
  return record;
}

export function updateProduct(id: number, input: unknown): ProductRecord {
  const parsed = productInputSchema.parse(input);
  const list = products();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) throw new ApiError("Product not found", 404);
  const updated: ProductRecord = {
    ...list[idx],
    name: parsed.name,
    code: parsed.code || null,
    category: parsed.category || null,
    defaultPrice: parsed.defaultPrice,
    defaultVendorId: parsed.defaultVendorId ?? null,
    defaultVendorCost: parsed.defaultVendorCost,
    defaultFittingCharge: parsed.defaultFittingCharge ?? null,
    defaultLeadTimeDays: parsed.defaultLeadTimeDays ?? null,
    status: parsed.status,
    updatedAt: nowIso(),
  };
  list[idx] = updated;
  writeCollection("products", list);
  return updated;
}

export function deactivateProduct(id: number): void {
  const list = products();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) throw new ApiError("Product not found", 404);
  list[idx] = { ...list[idx], status: "Inactive", updatedAt: nowIso() };
  writeCollection("products", list);
}

// ---------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------

function orders(): OrderRecord[] {
  return readCollection<OrderRecord>("orders");
}

function generateOrderNo(bookingDate: string, settings: SettingsMap): string {
  const prefix = settings.orderPrefix || "FRN";
  const year = new Date(bookingDate).getFullYear();
  const yearPrefix = `${prefix}-${year}-`;
  const seqNums = orders()
    .filter((o) => o.orderNo.startsWith(yearPrefix))
    .map((o) => Number(o.orderNo.slice(yearPrefix.length)))
    .filter((n) => Number.isFinite(n));
  const next = seqNums.length > 0 ? Math.max(...seqNums) + 1 : 1;
  return `${yearPrefix}${String(next).padStart(4, "0")}`;
}

function withVendor(order: OrderRecord) {
  const vendor = order.vendorId ? vendors().find((v) => v.id === order.vendorId) ?? null : null;
  return { ...order, vendor };
}

type OrderInput = ReturnType<typeof orderInputSchema.parse>;

function buildOrderFields(input: OrderInput, settings: SettingsMap) {
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
    bookingDate: new Date(input.bookingDate).toISOString(),
    deliveryDateExpected: input.deliveryDateExpected ? new Date(input.deliveryDateExpected).toISOString() : null,
    deliveryDateActual: input.deliveryDateActual ? new Date(input.deliveryDateActual).toISOString() : null,
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
    paymentDate: input.paymentDate ? new Date(input.paymentDate).toISOString() : null,
    paymentMethod: input.paymentMethod || null,
    paymentNotes: input.paymentNotes || null,
    vendorProductCost: input.vendorProductCost,
    vendorDeliveryCost: input.vendorDeliveryCost,
    vendorOtherCost: input.vendorOtherCost,
    vendorTotalCost: calc.vendorTotalCost,
    vendorPaid: input.vendorPaid,
    vendorPending: calc.vendorPending,
    vendorPaymentStatus: calc.vendorPaymentStatus,
    vendorPaymentDate: input.vendorPaymentDate ? new Date(input.vendorPaymentDate).toISOString() : null,
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

export interface OrderListFilters {
  search?: string;
  vendorId?: number;
  deliveryStatus?: string;
  paymentStatus?: string;
  floor?: string;
  fitting?: "yes" | "no";
  lift?: "yes" | "no";
  customerPendingOnly?: boolean;
  vendorPendingOnly?: boolean;
  archived?: boolean;
  dateField?: "booking" | "delivery";
  from?: string;
  to?: string;
}

export function listOrders(filters: OrderListFilters) {
  let list = orders().filter((o) => o.isArchived === Boolean(filters.archived));

  if (filters.search) {
    const q = filters.search.toLowerCase();
    const allVendors = vendors();
    list = list.filter((o) => {
      const vendorName = o.vendorId ? allVendors.find((v) => v.id === o.vendorId)?.name ?? "" : "";
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.contact.toLowerCase().includes(q) ||
        o.orderNo.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        (o.postcode ?? "").toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        vendorName.toLowerCase().includes(q)
      );
    });
  }
  if (filters.vendorId) list = list.filter((o) => o.vendorId === filters.vendorId);
  if (filters.deliveryStatus) list = list.filter((o) => o.deliveryStatus === filters.deliveryStatus);
  if (filters.paymentStatus) list = list.filter((o) => o.paymentStatus === filters.paymentStatus);
  if (filters.floor) list = list.filter((o) => o.floor === filters.floor);
  if (filters.fitting) list = list.filter((o) => o.fittingRequired === (filters.fitting === "yes"));
  if (filters.lift) list = list.filter((o) => o.liftAvailable === (filters.lift === "yes"));
  if (filters.customerPendingOnly) list = list.filter((o) => o.customerPending > 0);
  if (filters.vendorPendingOnly) list = list.filter((o) => o.vendorPending > 0);
  if (filters.from || filters.to) {
    const field = filters.dateField === "booking" ? "bookingDate" : "deliveryDateExpected";
    const from = filters.from ? new Date(filters.from).getTime() : -Infinity;
    const to = filters.to ? new Date(`${filters.to}T23:59:59`).getTime() : Infinity;
    list = list.filter((o) => {
      const v = o[field as "bookingDate" | "deliveryDateExpected"];
      if (!v) return false;
      const t = new Date(v).getTime();
      return t >= from && t <= to;
    });
  }

  list = list.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return list.map(withVendor);
}

export function getOrder(id: number) {
  const order = orders().find((o) => o.id === id);
  if (!order) throw new ApiError("Order not found", 404);
  const payments = readCollection<PaymentRecord>("payments")
    .filter((p) => p.orderId === id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const reminders = readCollection<ReminderRecord>("reminders")
    .filter((r) => r.orderId === id)
    .sort((a, b) => a.date.localeCompare(b.date));
  return { ...withVendor(order), payments, reminders };
}

export function createOrder(input: unknown) {
  const parsed = orderInputSchema.parse(input);
  const settings = getSettings();
  const fields = buildOrderFields(parsed, settings);
  const orderNo = generateOrderNo(parsed.bookingDate, settings);
  const record: OrderRecord = {
    id: nextId("orders"),
    orderNo,
    ...fields,
    isArchived: false,
    isDemo: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  writeCollection("orders", [...orders(), record]);
  return withVendor(record);
}

export function updateOrder(id: number, input: unknown) {
  const parsed = orderInputSchema.parse(input);
  const settings = getSettings();
  const list = orders();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new ApiError("Order not found", 404);
  const fields = buildOrderFields(parsed, settings);
  const updated: OrderRecord = { ...list[idx], ...fields, updatedAt: nowIso() };
  list[idx] = updated;
  writeCollection("orders", list);
  return withVendor(updated);
}

export function archiveOrder(id: number) {
  const list = orders();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new ApiError("Order not found", 404);
  list[idx] = { ...list[idx], isArchived: true, updatedAt: nowIso() };
  writeCollection("orders", list);
  return list[idx];
}

export function restoreOrder(id: number) {
  const list = orders();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new ApiError("Order not found", 404);
  list[idx] = { ...list[idx], isArchived: false, updatedAt: nowIso() };
  writeCollection("orders", list);
  return list[idx];
}

export function duplicateOrder(id: number) {
  const source = orders().find((o) => o.id === id);
  if (!source) throw new ApiError("Order not found", 404);
  const settings = getSettings();
  const orderNo = generateOrderNo(nowIso(), settings);
  const record: OrderRecord = {
    ...source,
    id: nextId("orders"),
    orderNo,
    bookingDate: nowIso(),
    deliveryDateActual: null,
    amountPaid: 0,
    customerPending: source.customerTotal,
    paymentStatus: "Not Paid",
    paymentDate: null,
    vendorPaid: 0,
    vendorPending: source.vendorTotalCost,
    vendorPaymentStatus: "Not Paid",
    vendorPaymentDate: null,
    deliveryStatus: "New Order",
    isArchived: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  writeCollection("orders", [...orders(), record]);
  return withVendor(record);
}

export function updateOrderStatus(id: number, status: string) {
  if (!(DELIVERY_STATUSES as readonly string[]).includes(status)) {
    throw new ApiError("Invalid delivery status", 400);
  }
  const list = orders();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new ApiError("Order not found", 404);
  const updated: OrderRecord = {
    ...list[idx],
    deliveryStatus: status,
    deliveryDateActual: status === "Delivered" ? nowIso() : list[idx].deliveryDateActual,
    updatedAt: nowIso(),
  };
  list[idx] = updated;
  writeCollection("orders", list);
  return withVendor(updated);
}

export function recordPayment(orderId: number, input: unknown) {
  const parsed = paymentInputSchema.parse({ ...(input as object), orderId });
  const list = orders();
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new ApiError("Order not found", 404);
  const order = list[idx];

  const paymentRecord: PaymentRecord = {
    id: nextId("payments"),
    orderId,
    type: parsed.type,
    amount: parsed.amount,
    date: new Date(parsed.date).toISOString(),
    method: parsed.method || null,
    notes: parsed.notes || null,
    createdAt: nowIso(),
  };
  writeCollection("payments", [...readCollection<PaymentRecord>("payments"), paymentRecord]);

  let updated: OrderRecord;
  if (parsed.type === "customer") {
    const amountPaid = Math.max(0, order.amountPaid + parsed.amount);
    updated = {
      ...order,
      amountPaid,
      customerPending: calcCustomerPending(order.customerTotal, amountPaid),
      paymentStatus: derivePaymentStatus(order.customerTotal, amountPaid, order.paymentStatus),
      paymentDate: paymentRecord.date,
      paymentMethod: parsed.method || order.paymentMethod,
      updatedAt: nowIso(),
    };
  } else {
    const vendorPaid = Math.max(0, order.vendorPaid + parsed.amount);
    updated = {
      ...order,
      vendorPaid,
      vendorPending: calcVendorPending(order.vendorTotalCost, vendorPaid),
      vendorPaymentStatus: deriveVendorPaymentStatus(order.vendorTotalCost, vendorPaid),
      vendorPaymentDate: paymentRecord.date,
      updatedAt: nowIso(),
    };
  }
  list[idx] = updated;
  writeCollection("orders", list);
  return withVendor(updated);
}

export function exportOrdersCsv(includeArchived = false): string {
  const list = orders()
    .filter((o) => includeArchived || !o.isArchived)
    .slice()
    .sort((a, b) => a.orderNo.localeCompare(b.orderNo))
    .map(withVendor);

  const columns = [
    "Order ID", "Booking Date", "Delivery Date", "Customer Name", "Contact", "WhatsApp",
    "Address", "Postcode", "City", "Product", "Product Code", "Colour", "Quantity",
    "Vendor", "Product Price", "Floor", "Lift", "Floor Charge", "Fitting Required",
    "Fitting Charge", "Additional Charge", "Discount", "Customer Total", "Amount Paid",
    "Customer Pending", "Payment Status", "Vendor Product Cost", "Vendor Delivery Cost",
    "Vendor Other Cost", "Vendor Total Cost", "Vendor Paid", "Vendor Pending",
    "Commission", "Other Business Cost", "Net Profit", "Delivery Status", "Notes",
    "Created At", "Updated At",
  ];
  const rows = list.map((o) => ({
    "Order ID": o.orderNo,
    "Booking Date": o.bookingDate.slice(0, 10),
    "Delivery Date": o.deliveryDateExpected?.slice(0, 10) ?? "",
    "Customer Name": o.customerName,
    Contact: o.contact,
    WhatsApp: o.whatsapp ?? "",
    Address: o.address,
    Postcode: o.postcode ?? "",
    City: o.city ?? "",
    Product: o.productName,
    "Product Code": o.productCode ?? "",
    Colour: o.colour ?? "",
    Quantity: o.quantity,
    Vendor: o.vendor?.name ?? "",
    "Product Price": o.productPrice,
    Floor: o.floor,
    Lift: o.liftAvailable ? "Yes" : "No",
    "Floor Charge": o.floorCharge,
    "Fitting Required": o.fittingRequired ? "Yes" : "No",
    "Fitting Charge": o.fittingCharge,
    "Additional Charge": o.additionalCharge,
    Discount: o.discount,
    "Customer Total": o.customerTotal,
    "Amount Paid": o.amountPaid,
    "Customer Pending": o.customerPending,
    "Payment Status": o.paymentStatus,
    "Vendor Product Cost": o.vendorProductCost,
    "Vendor Delivery Cost": o.vendorDeliveryCost,
    "Vendor Other Cost": o.vendorOtherCost,
    "Vendor Total Cost": o.vendorTotalCost,
    "Vendor Paid": o.vendorPaid,
    "Vendor Pending": o.vendorPending,
    Commission: o.commissionAmount,
    "Other Business Cost": o.otherBusinessCost,
    "Net Profit": o.netProfit,
    "Delivery Status": o.deliveryStatus,
    Notes: o.notes ?? "",
    "Created At": o.createdAt,
    "Updated At": o.updatedAt,
  }));
  return toCsv(rows, columns);
}

// ---------------------------------------------------------------------
// Reminders
// ---------------------------------------------------------------------

export function listReminders(status?: string) {
  const allOrders = orders();
  let list = readCollection<ReminderRecord>("reminders");
  if (status) list = list.filter((r) => r.status === status);
  return list
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => {
      const order = r.orderId ? allOrders.find((o) => o.id === r.orderId) : null;
      return { ...r, order: order ? { orderNo: order.orderNo, customerName: order.customerName, contact: order.contact } : null };
    });
}

export function createReminder(input: unknown): ReminderRecord {
  const parsed = reminderInputSchema.parse(input);
  const record: ReminderRecord = {
    id: nextId("reminders"),
    orderId: parsed.orderId ?? null,
    customerName: parsed.customerName || null,
    type: parsed.type,
    date: new Date(parsed.date).toISOString(),
    time: parsed.time || null,
    notes: parsed.notes || null,
    status: parsed.status,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  writeCollection("reminders", [...readCollection<ReminderRecord>("reminders"), record]);
  return record;
}

export function updateReminderStatus(id: number, status: string): ReminderRecord {
  const list = readCollection<ReminderRecord>("reminders");
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) throw new ApiError("Reminder not found", 404);
  list[idx] = { ...list[idx], status, updatedAt: nowIso() };
  writeCollection("reminders", list);
  return list[idx];
}

export function deleteReminder(id: number): void {
  writeCollection(
    "reminders",
    readCollection<ReminderRecord>("reminders").filter((r) => r.id !== id)
  );
}

// ---------------------------------------------------------------------
// Delivery schedule (postcode checker)
// ---------------------------------------------------------------------

export function getDeliverySchedule(): DeliveryScheduleRecord[] {
  return readCollection<DeliveryScheduleRecord>("deliverySchedule").sort((a, b) =>
    a.postcodePrefix.localeCompare(b.postcodePrefix)
  );
}

export function saveDeliverySchedule(rows: { postcodePrefix: string; areaName?: string; days: string[] }[]) {
  const data: DeliveryScheduleRecord[] = [];
  for (const r of rows) {
    const prefix = String(r.postcodePrefix ?? "").trim().toUpperCase();
    if (!prefix) continue;
    const days = new Set((r.days ?? []).map((d) => String(d).toLowerCase()));
    data.push({
      postcodePrefix: prefix,
      areaName: r.areaName?.trim() || null,
      monday: days.has("monday"),
      tuesday: days.has("tuesday"),
      wednesday: days.has("wednesday"),
      thursday: days.has("thursday"),
      friday: days.has("friday"),
      saturday: days.has("saturday"),
      sunday: days.has("sunday"),
    });
  }
  writeCollection("deliverySchedule", data);
  return getDeliverySchedule();
}

export function checkPostcode(postcode: string, fromDate: string) {
  const from = fromDate ? new Date(fromDate) : new Date();
  const rows = getDeliverySchedule() as ScheduleRow[];
  const match = matchPostcode(postcode, rows);
  if (!match) {
    return {
      matched: false,
      postcode,
      message: "No delivery schedule configured for this postcode yet. Add it from Manage Schedule.",
    };
  }
  const daysServed = daysServedByRow(match);
  const nextDate = nextServiceDate(match, from);
  return {
    matched: true,
    postcode,
    matchedPrefix: match.postcodePrefix,
    areaName: match.areaName,
    daysServed,
    nextDeliveryDate: nextDate ? format(nextDate, "yyyy-MM-dd") : null,
  };
}

// ---------------------------------------------------------------------
// Delivery-date checker (lead time based)
// ---------------------------------------------------------------------

export function checkDeliveryLeadTime(params: {
  productId?: number;
  vendorId?: number;
  bookingDate: string;
  leadTimeDays?: number;
}) {
  const settings = getSettings();
  const product = params.productId ? products().find((p) => p.id === params.productId) ?? null : null;
  const vendor = params.vendorId
    ? vendors().find((v) => v.id === params.vendorId) ?? null
    : product?.defaultVendorId
      ? vendors().find((v) => v.id === product.defaultVendorId) ?? null
      : null;

  let days: number;
  let source: "manual" | "product" | "vendor" | "default";
  if (params.leadTimeDays != null) {
    days = params.leadTimeDays;
    source = "manual";
  } else if (product?.defaultLeadTimeDays != null) {
    days = product.defaultLeadTimeDays;
    source = "product";
  } else if (vendor?.defaultLeadTimeDays != null) {
    days = vendor.defaultLeadTimeDays;
    source = "vendor";
  } else {
    days = Number(settings.deliveryDefaultLeadTimeDays) || 14;
    source = "default";
  }

  const skipWeekends = settings.deliverySkipWeekends !== "false";
  const windowDays = Math.max(0, Number(settings.deliverySuggestionWindowDays) || 0);
  const bookingDate = new Date(params.bookingDate);

  function addLeadDays(start: Date, n: number): Date {
    if (!skipWeekends) {
      const d = new Date(start);
      d.setDate(d.getDate() + n);
      return d;
    }
    let date = new Date(start);
    let remaining = n;
    while (remaining > 0) {
      date.setDate(date.getDate() + 1);
      const day = date.getDay();
      if (day !== 0 && day !== 6) remaining -= 1;
    }
    return date;
  }

  const earliest = addLeadDays(bookingDate, days);
  const suggested: Date[] = [earliest];
  let cursor = earliest;
  while (suggested.length <= windowDays) {
    cursor = addLeadDays(cursor, 1);
    suggested.push(cursor);
  }

  return {
    earliestDate: format(earliest, "yyyy-MM-dd"),
    suggestedDates: suggested.map((d) => format(d, "yyyy-MM-dd")),
    leadTimeDays: days,
    leadTimeSource: source,
    skippedWeekends: skipWeekends,
    product: product ? { id: product.id, name: product.name } : null,
    vendor: vendor ? { id: vendor.id, name: vendor.name } : null,
  };
}

// ---------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------

export function getDashboardStats(rangeKey: DateRangeKey, custom?: { from?: string; to?: string }) {
  const { from, to } = resolveDateRange(rangeKey, custom);
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const active = orders().filter((o) => !o.isArchived);

  const inRangeBooking = active.filter((o) => {
    const t = new Date(o.bookingDate).getTime();
    return t >= from.getTime() && t <= to.getTime();
  });

  const todaysOrders = active.filter((o) => {
    const t = new Date(o.bookingDate).getTime();
    return t >= todayStart.getTime() && t <= todayEnd.getTime();
  }).length;

  const todaysDeliveries = active.filter((o) => {
    if (!o.deliveryDateExpected) return false;
    const t = new Date(o.deliveryDateExpected).getTime();
    return t >= todayStart.getTime() && t <= todayEnd.getTime();
  }).length;

  const pendingDeliveries = active.filter(
    (o) => !["Delivered", "Cancelled", "Returned"].includes(o.deliveryStatus)
  ).length;

  const deliveredInRange = inRangeBooking.filter((o) => o.deliveryStatus === "Delivered").length;
  const cancelledInRange = inRangeBooking.filter((o) => o.deliveryStatus === "Cancelled").length;

  const totals = inRangeBooking.reduce(
    (acc, o) => {
      acc.revenue += o.customerTotal;
      acc.vendorCost += o.vendorTotalCost;
      acc.profit += o.netProfit;
      return acc;
    },
    { revenue: 0, vendorCost: 0, profit: 0 }
  );

  return {
    range: { key: rangeKey, from, to },
    cards: {
      todaysOrders,
      todaysDeliveries,
      pendingDeliveries,
      deliveredOrders: deliveredInRange,
      cancelledOrders: cancelledInRange,
      customerPaymentsPending: active.reduce((s, o) => s + o.customerPending, 0),
      vendorPaymentsPending: active.reduce((s, o) => s + o.vendorPending, 0),
      totalRevenue: totals.revenue,
      totalVendorCost: totals.vendorCost,
      totalProfit: totals.profit,
      ordersInRange: inRangeBooking.length,
    },
  };
}

// ---------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------

export function vendorDailyReport(date: string, vendorId?: number) {
  const start = new Date(`${date}T00:00:00`).getTime();
  const end = new Date(`${date}T23:59:59`).getTime();
  const list = orders()
    .filter((o) => !o.isArchived)
    .filter((o) => o.deliveryDateExpected && new Date(o.deliveryDateExpected).getTime() >= start && new Date(o.deliveryDateExpected).getTime() <= end)
    .filter((o) => !vendorId || o.vendorId === vendorId)
    .map(withVendor);
  return { orders: list, date };
}

export function deliveryDailyReport(date: string) {
  const start = new Date(`${date}T00:00:00`).getTime();
  const end = new Date(`${date}T23:59:59`).getTime();
  const list = orders()
    .filter((o) => !o.isArchived)
    .filter((o) => o.deliveryDateExpected && new Date(o.deliveryDateExpected).getTime() >= start && new Date(o.deliveryDateExpected).getTime() <= end)
    .map(withVendor);

  const groups = new Map<string, typeof list>();
  for (const o of list) {
    const key = o.vendor?.name ?? "No Vendor";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(o);
  }
  return { date, groups: Array.from(groups.entries()).map(([vendor, items]) => ({ vendor, orders: items })) };
}

export function paymentsReport(rangeKey: DateRangeKey, custom?: { from?: string; to?: string }) {
  const { from, to } = resolveDateRange(rangeKey, custom);
  const list = orders().filter((o) => {
    if (o.isArchived) return false;
    const t = new Date(o.bookingDate).getTime();
    return t >= from.getTime() && t <= to.getTime();
  });
  const totals = list.reduce(
    (acc, o) => {
      acc.customerTotal += o.customerTotal;
      acc.customerReceived += o.amountPaid;
      acc.customerPending += o.customerPending;
      acc.vendorTotal += o.vendorTotalCost;
      acc.vendorPaid += o.vendorPaid;
      acc.vendorPending += o.vendorPending;
      acc.commission += o.commissionAmount;
      return acc;
    },
    { customerTotal: 0, customerReceived: 0, customerPending: 0, vendorTotal: 0, vendorPaid: 0, vendorPending: 0, commission: 0 }
  );
  return { range: { from, to }, totals };
}

export function profitReport(rangeKey: DateRangeKey, custom?: { from?: string; to?: string }) {
  const { from, to } = resolveDateRange(rangeKey, custom);
  const list = orders().filter((o) => {
    if (o.isArchived) return false;
    const t = new Date(o.bookingDate).getTime();
    return t >= from.getTime() && t <= to.getTime();
  });

  const byDay = new Map<string, { revenue: number; profit: number }>();
  const byMonth = new Map<string, { revenue: number; profit: number }>();
  const byVendor = new Map<string, number>();
  const byProduct = new Map<string, number>();
  const byDeliveryStatus = new Map<string, number>();
  const byPaymentStatus = new Map<string, number>();
  let totalRevenue = 0,
    totalVendorCost = 0,
    totalOtherCost = 0,
    grossProfit = 0,
    netProfit = 0;

  const allVendors = vendors();
  for (const o of list) {
    const bookingDate = new Date(o.bookingDate);
    const dayKey = format(bookingDate, "yyyy-MM-dd");
    const monthKey = format(bookingDate, "yyyy-MM");
    const day = byDay.get(dayKey) ?? { revenue: 0, profit: 0 };
    day.revenue += o.customerTotal;
    day.profit += o.netProfit;
    byDay.set(dayKey, day);
    const month = byMonth.get(monthKey) ?? { revenue: 0, profit: 0 };
    month.revenue += o.customerTotal;
    month.profit += o.netProfit;
    byMonth.set(monthKey, month);

    const vendorName = o.vendorId ? allVendors.find((v) => v.id === o.vendorId)?.name ?? "No Vendor" : "No Vendor";
    byVendor.set(vendorName, (byVendor.get(vendorName) ?? 0) + 1);
    byProduct.set(o.productName, (byProduct.get(o.productName) ?? 0) + 1);
    byDeliveryStatus.set(o.deliveryStatus, (byDeliveryStatus.get(o.deliveryStatus) ?? 0) + 1);
    byPaymentStatus.set(o.paymentStatus, (byPaymentStatus.get(o.paymentStatus) ?? 0) + 1);

    totalRevenue += o.customerTotal;
    totalVendorCost += o.vendorTotalCost;
    totalOtherCost += o.otherBusinessCost;
    grossProfit += o.grossProfit;
    netProfit += o.netProfit;
  }

  const sortEntries = (m: Map<string, unknown>) => Array.from(m.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1));

  return {
    range: { from, to },
    summary: { totalRevenue, totalVendorCost, totalOtherCost, grossProfit, netProfit },
    charts: {
      revenueByDay: sortEntries(byDay).map(([date, v]) => ({ date, ...(v as object) })),
      revenueByMonth: sortEntries(byMonth).map(([month, v]) => ({ month, ...(v as object) })),
      ordersByVendor: Array.from(byVendor.entries()).map(([name, count]) => ({ name, count })),
      ordersByProduct: Array.from(byProduct.entries()).map(([name, count]) => ({ name, count })),
      deliveryStatus: Array.from(byDeliveryStatus.entries()).map(([name, count]) => ({ name, count })),
      paymentStatus: Array.from(byPaymentStatus.entries()).map(([name, count]) => ({ name, count })),
    },
  };
}

export { ApiError };
