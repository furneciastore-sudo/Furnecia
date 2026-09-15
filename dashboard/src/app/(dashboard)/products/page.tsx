import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { ProductsManager } from "@/components/ProductsManager";

export default async function ProductsPage() {
  const [products, vendors, settings] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" }, include: { defaultVendor: true } }),
    prisma.vendor.findMany({ where: { status: "Active" }, orderBy: { name: "asc" } }),
    getSettings(),
  ]);

  return <ProductsManager products={products} vendors={vendors} currency={settings.currencySymbol} />;
}
