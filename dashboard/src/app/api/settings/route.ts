import { NextRequest, NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
  }
  const values: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    values[key] = String(value);
  }
  await setSettings(values);
  const settings = await getSettings();
  return NextResponse.json({ settings });
}
