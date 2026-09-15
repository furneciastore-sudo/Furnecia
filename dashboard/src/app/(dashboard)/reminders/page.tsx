import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { RemindersManager } from "@/components/RemindersManager";

export default async function RemindersPage() {
  const orders = await prisma.order.findMany({
    where: { isArchived: false },
    select: { id: true, orderNo: true, customerName: true },
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return (
    <Suspense>
      <RemindersManager orders={orders} />
    </Suspense>
  );
}
