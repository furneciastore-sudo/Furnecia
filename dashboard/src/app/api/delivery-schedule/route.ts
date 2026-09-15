import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.deliverySchedule.findMany({ orderBy: { postcodePrefix: "asc" } });
  return NextResponse.json({ rows });
}

interface BulkRow {
  postcodePrefix: string;
  areaName?: string;
  days: string[]; // lowercase day keys
}

/** Full replace — this table is meant to be maintained entirely from the
 * app's bulk editor, so saving overwrites it with exactly what's shown. */
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const rows: BulkRow[] = Array.isArray(body?.rows) ? body.rows : [];

  const data: Prisma.DeliveryScheduleCreateInput[] = [];
  for (const r of rows) {
    const prefix = String(r.postcodePrefix ?? "").trim().toUpperCase();
    if (!prefix) continue;
    const days = new Set((r.days ?? []).map((d) => String(d).toLowerCase()));
    const row: Prisma.DeliveryScheduleCreateInput = {
      postcodePrefix: prefix,
      areaName: r.areaName?.trim() || null,
      monday: days.has("monday"),
      tuesday: days.has("tuesday"),
      wednesday: days.has("wednesday"),
      thursday: days.has("thursday"),
      friday: days.has("friday"),
      saturday: days.has("saturday"),
      sunday: days.has("sunday"),
    };
    data.push(row);
  }

  await prisma.$transaction([
    prisma.deliverySchedule.deleteMany({}),
    ...data.map((row) => prisma.deliverySchedule.create({ data: row })),
  ]);

  const saved = await prisma.deliverySchedule.findMany({ orderBy: { postcodePrefix: "asc" } });
  return NextResponse.json({ rows: saved });
}
