import { getVendorsWithStats } from "@/lib/vendors";
import { getSettings } from "@/lib/settings";
import { VendorsManager } from "@/components/VendorsManager";

export default async function VendorsPage() {
  const [vendors, settings] = await Promise.all([getVendorsWithStats(), getSettings()]);
  return <VendorsManager vendors={vendors} currency={settings.currencySymbol} />;
}
