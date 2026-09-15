import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";

/** Generates the next unique order number, e.g. FRN-2026-0001, per calendar year. */
export async function generateOrderNo(date: Date = new Date()): Promise<string> {
  const settings = await getSettings();
  const prefix = settings.orderPrefix || "FRN";
  const year = date.getFullYear();
  const yearPrefix = `${prefix}-${year}-`;

  const last = await prisma.order.findFirst({
    where: { orderNo: { startsWith: yearPrefix } },
    orderBy: { orderNo: "desc" },
    select: { orderNo: true },
  });

  let nextSeq = 1;
  if (last) {
    const parts = last.orderNo.split("-");
    const seq = Number(parts[parts.length - 1]);
    if (Number.isFinite(seq)) nextSeq = seq + 1;
  }

  const orderNo = `${yearPrefix}${String(nextSeq).padStart(4, "0")}`;

  // Guard against a rare race by checking uniqueness before returning.
  const clash = await prisma.order.findUnique({ where: { orderNo } });
  if (clash) {
    return generateOrderNo(date);
  }
  return orderNo;
}
