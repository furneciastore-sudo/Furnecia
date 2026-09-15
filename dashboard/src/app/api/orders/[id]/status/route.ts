import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DELIVERY_STATUSES } from "@/lib/calculations";

/** One-click delivery status update. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const status = body?.deliveryStatus;
  if (!DELIVERY_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid delivery status" }, { status: 400 });
  }

  const data: { deliveryStatus: string; deliveryDateActual?: Date } = { deliveryStatus: status };
  if (status === "Delivered") data.deliveryDateActual = new Date();

  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data,
    include: { vendor: true },
  });
  return NextResponse.json({ order });
}
