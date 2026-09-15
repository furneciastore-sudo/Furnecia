import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reminderInputSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const reminders = await prisma.reminder.findMany({
    where: status ? { status } : undefined,
    include: { order: { select: { orderNo: true, customerName: true, contact: true } } },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ reminders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = reminderInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date, ...rest } = parsed.data;
  const reminder = await prisma.reminder.create({
    data: { ...rest, date: new Date(date) },
  });
  return NextResponse.json({ reminder }, { status: 201 });
}
