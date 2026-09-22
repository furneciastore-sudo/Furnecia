// Client-side storage — the entire "database" for the offline app lives
// in the browser/WebView's own localStorage. No server, no network call,
// ever. Each collection is a JSON array under its own key; settings and
// the id counters are simple key/value entries.

const PREFIX = "furnecia:";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readCollection<T>(name: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(PREFIX + name);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function writeCollection<T>(name: string, items: T[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PREFIX + name, JSON.stringify(items));
}

export function nextId(name: string): number {
  if (!isBrowser()) return Date.now();
  const key = PREFIX + name + ":seq";
  const current = Number(window.localStorage.getItem(key) || "0") + 1;
  window.localStorage.setItem(key, String(current));
  return current;
}

export function readValue(key: string): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(PREFIX + key);
}

export function writeValue(key: string, value: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PREFIX + key, value);
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = readValue(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  writeValue(key, JSON.stringify(value));
}

export function hasAnyData(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(PREFIX + "seeded") === "1";
}

export function markSeeded(): void {
  writeValue("seeded", "1");
}
