import { PrismaClient } from "@prisma/client";
import {
  calcFloorCharge,
  calcFittingCharge,
  calcCustomerTotal,
  calcCustomerPending,
  derivePaymentStatus,
  calcVendorTotal,
  calcVendorPending,
  deriveVendorPaymentStatus,
  calcProfit,
} from "../src/lib/calculations";
import { DEFAULT_SETTINGS } from "../src/lib/settingsShared";

const prisma = new PrismaClient();

// ⚠️ DEMO DATA — fake customers, vendors and orders for testing only.
const VENDORS = [
  { name: "Vendor A — Oak & Co Furniture", contactPerson: "Imran Malik", phone: "+44 7700 900111", whatsapp: "+44 7700 900111", email: "orders@oakandco.example", address: "Unit 4, Wembley Trade Park, London", products: "Sofas, Sofa Beds" },
  { name: "Vendor B — Britannia Beds Ltd", contactPerson: "Sarah Lewis", phone: "+44 7700 900222", whatsapp: "+44 7700 900222", email: "sales@britanniabeds.example", address: "12 Industrial Rd, Luton", products: "Beds, Mattresses" },
  { name: "Vendor C — Home Comfort Wholesale", contactPerson: "David Chen", phone: "+44 7700 900333", whatsapp: "+44 7700 900333", email: "hello@homecomfort.example", address: "Unit 9, Slough Trading Estate", products: "Wardrobes, Dining Sets" },
  { name: "Vendor D — Metro Furniture Supplies", contactPerson: "Fatima Rahman", phone: "+44 7700 900444", whatsapp: "+44 7700 900444", email: "info@metrofurniture.example", address: "45 Long Lane, Birmingham", products: "Recliners, Coffee Tables" },
  { name: "Vendor E — Cosy Living Imports", contactPerson: "James O'Neil", phone: "+44 7700 900555", whatsapp: "+44 7700 900555", email: "contact@cosyliving.example", address: "3 Riverside Way, Manchester", products: "Corner Sofas, Bunk Beds" },
];

const PRODUCTS = [
  { name: "3-Seater Fabric Sofa", code: "SF-301", category: "Sofas", defaultPrice: 380, vendorIdx: 0, defaultVendorCost: 260, defaultFittingCharge: 30 },
  { name: "Corner Sofa L-Shape", code: "SF-450", category: "Sofas", defaultPrice: 620, vendorIdx: 4, defaultVendorCost: 430, defaultFittingCharge: 40 },
  { name: "Double Divan Bed with Storage", code: "BD-210", category: "Beds", defaultPrice: 290, vendorIdx: 1, defaultVendorCost: 190, defaultFittingCharge: 25 },
  { name: "Memory Foam Mattress (King)", code: "MT-500", category: "Mattresses", defaultPrice: 220, vendorIdx: 1, defaultVendorCost: 140, defaultFittingCharge: null },
  { name: "3-Door Sliding Wardrobe", code: "WR-120", category: "Wardrobes", defaultPrice: 340, vendorIdx: 2, defaultVendorCost: 230, defaultFittingCharge: 35 },
  { name: "6-Seater Dining Set", code: "DN-600", category: "Dining", defaultPrice: 410, vendorIdx: 2, defaultVendorCost: 290, defaultFittingCharge: 20 },
  { name: "Recliner Armchair", code: "RC-100", category: "Recliners", defaultPrice: 260, vendorIdx: 3, defaultVendorCost: 175, defaultFittingCharge: null },
  { name: "Bunk Bed with Mattresses", code: "BD-330", category: "Beds", defaultPrice: 330, vendorIdx: 4, defaultVendorCost: 225, defaultFittingCharge: 30 },
];

const CUSTOMERS = [
  { name: "Aisha Khan", contact: "07911 111111", address: "14 Elm Street", postcode: "E1 6AN", city: "London" },
  { name: "Tom Richards", contact: "07911 222222", address: "27 Baker Avenue", postcode: "M1 4BT", city: "Manchester" },
  { name: "Grace Okafor", contact: "07911 333333", address: "8 Kings Road", postcode: "B2 5RT", city: "Birmingham" },
  { name: "Liam O'Brien", contact: "07911 444444", address: "56 Victoria Lane", postcode: "LS1 2QP", city: "Leeds" },
  { name: "Priya Sharma", contact: "07911 555555", address: "3 Church Street", postcode: "L1 8JQ", city: "Liverpool" },
  { name: "Marcus Bell", contact: "07911 666666", address: "91 Park View", postcode: "S1 2HE", city: "Sheffield" },
  { name: "Fatima Al-Sayed", contact: "07911 777777", address: "22 Windsor Close", postcode: "NE1 4ST", city: "Newcastle" },
  { name: "Oliver Wright", contact: "07911 888888", address: "5 Mill Lane", postcode: "BS1 5TF", city: "Bristol" },
  { name: "Chen Wei", contact: "07911 999999", address: "10 Harbour Road", postcode: "CF10 1AA", city: "Cardiff" },
  { name: "Sophie Turner", contact: "07911 000000", address: "17 Meadow Drive", postcode: "G1 2FF", city: "Glasgow" },
];

const FLOORS = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "Ground Floor", "1st Floor"];
const DELIVERY_STATUSES_CYCLE = [
  "New Order", "Confirmed", "Vendor Confirmed", "Ready for Delivery", "Delivery Scheduled",
  "Out for Delivery", "Delivered", "Delivered", "Delivered", "Rescheduled", "Cancelled",
];

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  console.log("Seeding demo data...");

  await prisma.reminder.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.vendor.deleteMany({});

  const vendors = [];
  for (const v of VENDORS) {
    vendors.push(await prisma.vendor.create({ data: { ...v, isDemo: true } }));
  }

  const products = [];
  for (const p of PRODUCTS) {
    products.push(
      await prisma.product.create({
        data: {
          name: p.name,
          code: p.code,
          category: p.category,
          defaultPrice: p.defaultPrice,
          defaultVendorId: vendors[p.vendorIdx].id,
          defaultVendorCost: p.defaultVendorCost,
          defaultFittingCharge: p.defaultFittingCharge,
          isDemo: true,
        },
      })
    );
  }

  const settings = { ...DEFAULT_SETTINGS };
  let orderCount = 0;

  for (let i = 0; i < 20; i++) {
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    const product = products[i % products.length];
    const vendor = vendors.find((v) => v.id === product.defaultVendorId)!;
    const floor = FLOORS[i % FLOORS.length];
    const liftAvailable = i % 3 === 0;
    const fittingRequired = product.defaultFittingCharge != null && i % 2 === 0;
    const quantity = i % 7 === 0 ? 2 : 1;
    const additionalCharge = i % 5 === 0 ? 10 : 0;
    const discount = i % 6 === 0 ? 15 : 0;
    const deliveryStatus = DELIVERY_STATUSES_CYCLE[i % DELIVERY_STATUSES_CYCLE.length];

    const floorCharge = calcFloorCharge(floor, liftAvailable, settings);
    const fittingCharge = calcFittingCharge(fittingRequired, settings, product.defaultFittingCharge);
    const customerTotal = calcCustomerTotal({
      productPrice: product.defaultPrice,
      quantity,
      floorCharge,
      fittingCharge,
      additionalCharge,
      discount,
    });

    // Vary how much has been paid/delivered so demo data covers every status.
    const paidFraction = deliveryStatus === "Cancelled" ? 0 : [0, 0.5, 1, 1][i % 4];
    const amountPaid = Math.round(customerTotal * paidFraction * 100) / 100;
    const customerPending = calcCustomerPending(customerTotal, amountPaid);
    const paymentStatus = derivePaymentStatus(customerTotal, amountPaid, deliveryStatus === "Cancelled" ? "Cancelled" : undefined);

    const vendorProductCost = product.defaultVendorCost * quantity;
    const vendorDeliveryCost = i % 4 === 0 ? 10 : 0;
    const vendorOtherCost = 0;
    const vendorTotalCost = calcVendorTotal({ vendorProductCost, vendorDeliveryCost, vendorOtherCost });
    const vendorPaidFraction = [0, 1, 1, 0.5][i % 4];
    const vendorPaid = Math.round(vendorTotalCost * vendorPaidFraction * 100) / 100;
    const vendorPending = calcVendorPending(vendorTotalCost, vendorPaid);
    const vendorPaymentStatus = deriveVendorPaymentStatus(vendorTotalCost, vendorPaid);

    const otherBusinessCost = i % 8 === 0 ? 5 : 0;
    const { grossProfit, netProfit, commissionAmount } = calcProfit({
      customerTotal,
      vendorTotalCost,
      otherBusinessCost,
      commissionType: "profit",
      commissionValue: 0,
    });

    const bookingDate = daysAgo(30 - i);
    const deliveryDateExpected = daysAgo(30 - i - 5) > new Date() ? daysAgo(0) : daysFromNow(i % 10 === 0 ? 0 : (i % 5) - 2);
    const isDelivered = deliveryStatus === "Delivered";

    const year = bookingDate.getFullYear();
    orderCount += 1;
    const orderNo = `FRN-${year}-${String(orderCount).padStart(4, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderNo,
        customerName: customer.name,
        contact: customer.contact,
        whatsapp: customer.contact,
        address: customer.address,
        postcode: customer.postcode,
        city: customer.city,
        productName: product.name,
        productCode: product.code,
        colour: ["Grey", "Beige", "Brown", "Navy"][i % 4],
        quantity,
        productPrice: product.defaultPrice,
        vendorId: vendor.id,
        bookingDate,
        deliveryDateExpected,
        deliveryDateActual: isDelivered ? deliveryDateExpected : null,
        floor,
        liftAvailable,
        floorCharge,
        fittingRequired,
        fittingCharge,
        additionalCharge,
        discount,
        customerTotal,
        amountPaid,
        customerPending,
        paymentStatus,
        paymentDate: amountPaid > 0 ? bookingDate : null,
        paymentMethod: amountPaid > 0 ? ["Cash", "Card", "Bank Transfer"][i % 3] : null,
        vendorProductCost,
        vendorDeliveryCost,
        vendorOtherCost,
        vendorTotalCost,
        vendorPaid,
        vendorPending,
        vendorPaymentStatus,
        vendorPaymentDate: vendorPaid > 0 ? bookingDate : null,
        commissionType: "profit",
        commissionValue: 0,
        commissionAmount,
        otherBusinessCost,
        grossProfit,
        netProfit,
        deliveryStatus,
        notes: i % 9 === 0 ? "Customer requested morning delivery slot." : null,
        isDemo: true,
      },
    });

    if (amountPaid > 0) {
      await prisma.payment.create({
        data: { orderId: order.id, type: "customer", amount: amountPaid, date: bookingDate, method: order.paymentMethod },
      });
    }
    if (vendorPaid > 0) {
      await prisma.payment.create({
        data: { orderId: order.id, type: "vendor", amount: vendorPaid, date: bookingDate },
      });
    }

    // A spread of reminders: some overdue, some today, some upcoming, some done.
    if (i % 3 === 0 && customerPending > 0) {
      await prisma.reminder.create({
        data: {
          orderId: order.id,
          type: "Payment Follow-up",
          date: daysAgo(2 - (i % 5)),
          notes: `Follow up on ${customerPending.toFixed(2)} pending from ${customer.name}`,
          status: "Pending",
        },
      });
    }
    if (i % 4 === 0 && vendorPending > 0) {
      await prisma.reminder.create({
        data: {
          orderId: order.id,
          type: "Vendor Payment Follow-up",
          date: daysFromNow(i % 3),
          notes: `Settle ${vendorPending.toFixed(2)} with ${vendor.name}`,
          status: "Pending",
        },
      });
    }
    if (i % 5 === 0 && !isDelivered) {
      await prisma.reminder.create({
        data: {
          orderId: order.id,
          type: "Delivery Confirmation",
          date: daysFromNow(1),
          notes: "Confirm delivery slot with customer",
          status: "Pending",
        },
      });
    }
    if (i % 7 === 0) {
      await prisma.reminder.create({
        data: {
          orderId: order.id,
          type: "Customer Follow-up",
          date: daysAgo(1),
          notes: "Check customer is happy with the order",
          status: "Completed",
        },
      });
    }
  }

  console.log(`Seeded ${vendors.length} vendors, ${products.length} products, ${orderCount} orders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
