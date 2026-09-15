"use client";

import { useEffect, useState } from "react";
import { getSettings } from "@/lib/localApi";
import { SettingsForm } from "@/components/SettingsForm";
import type { SettingsMap } from "@/lib/settingsShared";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsMap | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Nothing here is hard-coded — change any charge and every order recalculates using it going forward.</p>
      </div>
      {settings && <SettingsForm initial={settings} />}
    </div>
  );
}
