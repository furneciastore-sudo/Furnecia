import { prisma } from "@/lib/db";
import { DeliveryChecker } from "@/components/DeliveryChecker";

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
          A standalone tool — separate from Orders — for checking delivery date estimates. Lead times are configured
          per Product/Vendor and in Settings, not tied to any fixed list of products.
        </p>
      </div>
      <DeliveryChecker vendors={vendors} products={products} />
    </div>
  );
}
