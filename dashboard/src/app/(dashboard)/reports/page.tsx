import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { ReportsTabs } from "@/components/reports/ReportsTabs";

export default async function ReportsPage() {
  const [vendors, settings] = await Promise.all([
    prisma.vendor.findMany({ orderBy: { name: "asc" } }),
    getSettings(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">Vendor sheets, delivery runs, payments and profit — ready to export or print.</p>
      </div>
      <ReportsTabs vendors={vendors} currency={settings.currencySymbol} />
    </div>
  );
}
