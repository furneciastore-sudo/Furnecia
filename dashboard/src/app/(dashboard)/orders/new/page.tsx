import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { OrderForm } from "@/components/OrderForm";
import { emptyOrderForm } from "@/lib/orderFormTypes";

export default async function NewOrderPage() {
  const [vendors, products, settings] = await Promise.all([
    prisma.vendor.findMany({ where: { status: "Active" }, orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { status: "Active" }, orderBy: { name: "asc" } }),
    getSettings(),
  ]);

  const initial = emptyOrderForm({
    bookingDate: new Date().toISOString().slice(0, 10),
    floor: "Ground Floor",
    commissionType: settings.commissionDefaultType,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Add New Order</h1>
        <p className="text-sm text-gray-500">
          Fill in the basics — totals, charges, vendor pending and your profit calculate automatically.
        </p>
      </div>
      <OrderForm
        mode="create"
        initial={initial}
        vendors={vendors}
        products={products}
        settings={settings}
      />
    </div>
  );
}
