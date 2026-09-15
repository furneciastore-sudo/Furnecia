import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { daysServedByRow, matchPostcode, nextServiceDate } from "@/lib/postcodeSchedule";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const postcode = sp.get("postcode")?.trim();
  const fromStr = sp.get("from");

  if (!postcode) {
    return NextResponse.json({ error: "postcode is required" }, { status: 400 });
  }

  const from = fromStr ? new Date(fromStr) : new Date();
  if (Number.isNaN(from.getTime())) {
    return NextResponse.json({ error: "from date is invalid" }, { status: 400 });
  }

  const rows = await prisma.deliverySchedule.findMany();
  const match = matchPostcode(postcode, rows);

  if (!match) {
    return NextResponse.json({
      matched: false,
      postcode,
      message: "No delivery schedule configured for this postcode yet. Add it from Manage Schedule.",
    });
  }

  const daysServed = daysServedByRow(match);
  const nextDate = nextServiceDate(match, from);

  return NextResponse.json({
    matched: true,
    postcode,
    matchedPrefix: match.postcodePrefix,
    areaName: match.areaName,
    daysServed,
    nextDeliveryDate: nextDate ? nextDate.toISOString().slice(0, 10) : null,
  });
}
