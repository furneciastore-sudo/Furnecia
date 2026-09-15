import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Nothing here is hard-coded — change any charge and every order recalculates using it going forward.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
