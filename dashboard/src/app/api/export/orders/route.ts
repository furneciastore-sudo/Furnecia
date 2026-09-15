import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toCsv } from "@/lib/csv";

/** Exports every order in the exact "Orders" sheet layout from the brief —
 * this is the file you import into Google Sheets to keep it in sync, or
 * open directly in Excel. */
const COLUMNS = [
  "Order ID", "Booking Date", "Delivery Date", "Customer Name", "Contact", "WhatsApp",
  "Address", "Postcode", "City", "Product", "Product Code", "Colour", "Quantity",
  "Vendor", "Product Price", "Floor", "Lift", "Floor Charge", "Fitting Required",
  "Fitting Charge", "Additional Charge", "Discount", "Customer Total", "Amount Paid",
  "Customer Pending", "Payment Status", "Vendor Product Cost", "Vendor Delivery Cost",
  "Vendor Other Cost", "Vendor Total Cost", "Vendor Paid", "Vendor Pending",
  "Commission", "Other Business Cost", "Net Profit", "Delivery Status", "Notes",
  "Created At", "Updated At",
];

export async function GET(req: NextRequest) {
  const includeArchived = req.nextUrl.searchParams.get("archived") === "1";
  const orders = await prisma.order.findMany({
    where: includeArchived ? {} : { isArchived: false },
    include: { vendor: true },
    orderBy: { orderNo: "asc" },
  });

  const rows = orders.map((o) => ({
    "Order ID": o.orderNo,
    "Booking Date": o.bookingDate.toISOString().slice(0, 10),
    "Delivery Date": o.deliveryDateExpected?.toISOString().slice(0, 10) ?? "",
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
    "Created At": o.createdAt.toISOString(),
    "Updated At": o.updatedAt.toISOString(),
  }));

  const csv = toCsv(rows, COLUMNS);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="furnecia-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
