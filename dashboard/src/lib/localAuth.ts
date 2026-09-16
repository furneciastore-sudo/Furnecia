// A soft app-lock for the offline app — everything lives on this one
// phone, so this is just a PIN check done in the browser/WebView, not a
// real multi-user authentication system.

import { getSettings } from "@/lib/localApi";

const SESSION_KEY = "furnecia:unlocked";

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export function tryUnlock(password: string): boolean {
  const settings = getSettings();
  if (password === settings.appPassword) {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function lock(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}
