import { prisma } from "@/lib/db";
import { DEFAULT_SETTINGS, type SettingsMap } from "@/lib/settingsShared";

export { DEFAULT_SETTINGS };
export type { SettingsMap };
export { num } from "@/lib/settingsShared";

export async function getSettings(): Promise<SettingsMap> {
  const rows = await prisma.setting.findMany();
  const map = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    (map as Record<string, string>)[row.key] = row.value;
  }
  return map;
}

export async function setSetting(key: string, value: string) {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function setSettings(values: Record<string, string>) {
  await prisma.$transaction(
    Object.entries(values).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
}
