import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { computeDeliveryEstimate, resolveLeadTimeDays } from "@/lib/deliveryChecker";

export const dynamic = "force-dynamic";

/** Delivery Date Checker — a standalone tool, separate from Orders. Given
 * a product and/or vendor plus a booking date, suggests an earliest
 * delivery date. Nothing here writes to an order. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const productId = sp.get("productId");
  const vendorId = sp.get("vendorId");
  const bookingDateStr = sp.get("bookingDate");
  const manualLeadTimeStr = sp.get("leadTimeDays");

  if (!bookingDateStr) {
    return NextResponse.json({ error: "bookingDate is required" }, { status: 400 });
  }
  const bookingDate = new Date(bookingDateStr);
  if (Number.isNaN(bookingDate.getTime())) {
    return NextResponse.json({ error: "bookingDate is invalid" }, { status: 400 });
  }

  const settings = await getSettings();

  const [product, vendor] = await Promise.all([
    productId ? prisma.product.findUnique({ where: { id: Number(productId) }, include: { defaultVendor: true } }) : null,
    vendorId ? prisma.vendor.findUnique({ where: { id: Number(vendorId) } }) : null,
  ]);

  const effectiveVendor = vendor ?? product?.defaultVendor ?? null;

  const manualLeadTime = manualLeadTimeStr != null && manualLeadTimeStr !== "" ? Number(manualLeadTimeStr) : null;

  const { days, source } =
    manualLeadTime != null
      ? { days: manualLeadTime, source: "product" as const }
      : resolveLeadTimeDays({
          productLeadTimeDays: product?.defaultLeadTimeDays ?? null,
          vendorLeadTimeDays: effectiveVendor?.defaultLeadTimeDays ?? null,
          settings,
        });

  const estimate = computeDeliveryEstimate({ bookingDate, leadTimeDays: days, settings });

  return NextResponse.json({
    ...estimate,
    leadTimeSource: manualLeadTime != null ? "manual" : source,
    product: product ? { id: product.id, name: product.name } : null,
    vendor: effectiveVendor ? { id: effectiveVendor.id, name: effectiveVendor.name } : null,
  });
}
