import { prisma } from "@/lib/db";
import { DeliveryCheckerTabs } from "@/components/DeliveryCheckerTabs";

export default async function DeliveryCheckerPage() {
  const [vendors, products] = await Promise.all([
    prisma.vendor.findMany({ where: { status: "Active" }, orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { status: "Active" }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Delivery Date Checker</h1>
        <p className="text-sm text-gray-500">
          A standalone tool — separate from Orders. Check by customer postcode against your real delivery-day
          schedule, or by a product/vendor lead time.
        </p>
      </div>
      <DeliveryCheckerTabs vendors={vendors} products={products} />
    </div>
  );
}
