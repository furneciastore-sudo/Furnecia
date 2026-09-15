import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/dashboardStats";
import type { DateRangeKey } from "@/lib/dateRanges";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const rangeKey = (sp.get("range") as DateRangeKey) ?? "today";
  const stats = await getDashboardStats(rangeKey, {
    from: sp.get("from") ?? undefined,
    to: sp.get("to") ?? undefined,
  });
  return NextResponse.json(stats);
}
