import { getSettings } from "@/lib/settings";
import { AppShell } from "@/components/AppShell";

// Every page under this layout reads live business data — never
// pre-render/cache it statically at build time.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <AppShell businessName={settings.businessName}>{children}</AppShell>;
}
