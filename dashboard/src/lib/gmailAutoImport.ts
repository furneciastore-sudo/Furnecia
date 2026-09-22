// Fully automatic order import from Gmail — reads new "New Order — ..."
// emails (the ones js/order-email.js sends from the website) and creates
// orders straight away, no review step, no tap needed once it's set up.
//
// Like AI Auto-fill, this is the one part of the app that needs internet,
// and only runs while the app is open (a phone browser/WebView can't run
// a true background service without a real always-on server, which is
// the offline-vs-server tradeoff already decided against elsewhere in
// this app). Opening the app checks Gmail once; nothing else needed.
//
// Setup lives in Settings -> Auto Import from Gmail: a Google Cloud OAuth
// Client ID (gmailClientId) the user creates themselves, then "Connect
// Gmail" to grant read/modify access via Google's own consent screen.
// Leaving gmailClientId blank means this quietly does nothing.

import { createOrder, createReminder, listVendorsWithStats, listProducts, getSettings } from "@/lib/localApi";
import { parseOrderText, type ParsedOrder } from "@/lib/aiOrderParser";
import { FLOORS } from "@/lib/calculations";
import { readValue, writeValue } from "@/lib/localStore";
import type { SettingsMap } from "@/lib/settingsShared";

const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
const LABEL_NAME = "FurneciaImported";
const TOKEN_KEY = "gmailAccessToken";
const TOKEN_EXPIRY_KEY = "gmailAccessTokenExpiry";

export interface GmailImportSummary {
  checkedAt: string;
  imported: number;
  needsManualEntry: number;
  error?: string;
}

function gmailConfigured(settings: SettingsMap): boolean {
  return !!settings.gmailClientId?.trim();
}

// ---- Google Identity Services (OAuth token client), loaded lazily ----

let gisLoadPromise: Promise<boolean> | null = null;

function ensureGisLoaded(): Promise<boolean> {
  if (gisLoadPromise) return gisLoadPromise;
  gisLoadPromise = new Promise((resolve) => {
    if ((window as any).google?.accounts?.oauth2) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return gisLoadPromise;
}

function storedToken(): string | null {
  const token = readValue(TOKEN_KEY);
  const expiry = Number(readValue(TOKEN_EXPIRY_KEY) || "0");
  if (!token || Date.now() >= expiry) return null;
  return token;
}

function saveToken(token: string, expiresInSeconds: number): void {
  writeValue(TOKEN_KEY, token);
  writeValue(TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000 - 60_000));
}

// Interactive connect — call this from a button click (Settings page).
// Opens Google's consent screen; the "app not verified" warning is
// expected for a personal, unpublished OAuth client.
export async function connectGmail(clientId: string): Promise<{ ok: boolean; error?: string }> {
  const loaded = await ensureGisLoaded();
  if (!loaded) return { ok: false, error: "Could not load Google's sign-in script — check your internet connection." };
  return new Promise((resolve) => {
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GMAIL_SCOPE,
        callback: (resp: any) => {
          if (resp.error) {
            resolve({ ok: false, error: resp.error_description || resp.error });
            return;
          }
          saveToken(resp.access_token, resp.expires_in || 3600);
          resolve({ ok: true });
        },
      });
      client.requestAccessToken({ prompt: "consent" });
    } catch (err) {
      resolve({ ok: false, error: err instanceof Error ? err.message : "Could not start Google sign-in." });
    }
  });
}

// Silent re-auth attempt (no popup) — used on app open so a still-valid
// Google session doesn't need a fresh click every hour. If this fails,
// the caller just skips this cycle; nothing breaks.
async function silentReauth(clientId: string): Promise<string | null> {
  const loaded = await ensureGisLoaded();
  if (!loaded) return null;
  return new Promise((resolve) => {
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GMAIL_SCOPE,
        callback: (resp: any) => {
          if (resp.error) {
            resolve(null);
            return;
          }
          saveToken(resp.access_token, resp.expires_in || 3600);
          resolve(resp.access_token);
        },
      });
      client.requestAccessToken({ prompt: "" });
    } catch {
      resolve(null);
    }
  });
}

async function getToken(clientId: string): Promise<string | null> {
  const existing = storedToken();
  if (existing) return existing;
  return silentReauth(clientId);
}

// ---- Gmail API calls ----

async function gmailFetch(token: string, path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, {
    ...init,
    headers: { ...(init?.headers || {}), authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Gmail API error (${res.status})`);
  return res.json();
}

async function ensureLabel(token: string): Promise<string> {
  const list = await gmailFetch(token, "labels");
  const existing = (list.labels || []).find((l: any) => l.name === LABEL_NAME);
  if (existing) return existing.id;
  const created = await gmailFetch(token, "labels", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: LABEL_NAME, labelListVisibility: "labelHide", messageListVisibility: "hide" }),
  });
  return created.id;
}

function base64UrlDecode(data: string): string {
  const normalised = data.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return decodeURIComponent(
      atob(normalised)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
  } catch {
    return atob(normalised);
  }
}

function extractPlainText(payload: any): string {
  if (!payload) return "";
  if (payload.mimeType === "text/plain" && payload.body?.data) return base64UrlDecode(payload.body.data);
  if (payload.parts) {
    for (const part of payload.parts) {
      const text = extractPlainText(part);
      if (text) return text;
    }
  }
  if (payload.body?.data) return base64UrlDecode(payload.body.data);
  return "";
}

// ---- Order creation from a parsed email ----

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function buildOrderInput(parsed: ParsedOrder, settings: SettingsMap) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    customerName: parsed.customerName || "",
    contact: parsed.contact || "",
    whatsapp: parsed.whatsapp || "",
    address: parsed.address || "",
    postcode: parsed.postcode || "",
    city: parsed.city || "",
    productName: parsed.productName || "",
    productCode: parsed.productCode || "",
    colour: parsed.colour || "",
    quantity: parsed.quantity ?? 1,
    productPrice: parsed.productPrice ?? 0,
    vendorId: parsed.vendorId ?? null,
    bookingDate: parsed.bookingDate && DATE_RE.test(parsed.bookingDate) ? parsed.bookingDate : today,
    deliveryDateExpected: parsed.deliveryDateExpected && DATE_RE.test(parsed.deliveryDateExpected) ? parsed.deliveryDateExpected : null,
    floor: parsed.floor && (FLOORS as readonly string[]).includes(parsed.floor) ? parsed.floor : "Ground Floor",
    liftAvailable: parsed.liftAvailable ?? false,
    fittingRequired: parsed.fittingRequired ?? false,
    additionalCharge: parsed.additionalCharge ?? 0,
    discount: parsed.discount ?? 0,
    amountPaid: parsed.amountPaid ?? 0,
    commissionType: settings.commissionDefaultType,
    commissionValue: Number(settings.commissionDefaultValue) || 0,
    notes: `[Auto-imported from Gmail]${parsed.notes ? " " + parsed.notes : ""}`,
  };
}

function hasRequiredFields(input: ReturnType<typeof buildOrderInput>): boolean {
  return !!(input.customerName && input.contact && input.address && input.productName && input.bookingDate);
}

// Checks Gmail for new order emails and creates/queues them. Safe to call
// even if not configured or not connected — resolves to null quietly.
export async function runGmailAutoImport(): Promise<GmailImportSummary | null> {
  const settings = getSettings();
  if (!gmailConfigured(settings)) return null;

  const token = await getToken(settings.gmailClientId.trim());
  if (!token) return null;

  const summary: GmailImportSummary = { checkedAt: new Date().toISOString(), imported: 0, needsManualEntry: 0 };

  try {
    const labelId = await ensureLabel(token);
    const list = await gmailFetch(
      token,
      `messages?q=${encodeURIComponent(`subject:"New Order —" -label:${LABEL_NAME}`)}&maxResults=25`
    );
    const messages: { id: string }[] = list.messages || [];
    if (!messages.length) return summary;

    const vendors = listVendorsWithStats();
    const products = listProducts();

    for (const m of messages) {
      const full = await gmailFetch(token, `messages/${m.id}?format=full`);
      const bodyText = extractPlainText(full.payload) || full.snippet || "";

      try {
        const parsed = await parseOrderText(bodyText, settings, vendors, products);
        const input = buildOrderInput(parsed, settings);
        if (hasRequiredFields(input)) {
          createOrder(input);
          summary.imported += 1;
        } else {
          createReminder({
            type: "Manual Order Entry Needed",
            date: new Date().toISOString().slice(0, 10),
            notes: `Couldn't auto-import this order email (missing required details). Original text:\n\n${bodyText.slice(0, 1500)}`,
          });
          summary.needsManualEntry += 1;
        }
      } catch {
        createReminder({
          type: "Manual Order Entry Needed",
          date: new Date().toISOString().slice(0, 10),
          notes: `Couldn't auto-import this order email. Original text:\n\n${bodyText.slice(0, 1500)}`,
        });
        summary.needsManualEntry += 1;
      }

      // Label it either way so it's never re-processed on the next check.
      await gmailFetch(token, `messages/${m.id}/modify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ addLabelIds: [labelId] }),
      }).catch(() => {});
    }
  } catch (err) {
    summary.error = err instanceof Error ? err.message : "Gmail check failed.";
  }

  return summary;
}

export function isGmailConfigured(): boolean {
  return gmailConfigured(getSettings());
}

export function isGmailConnected(): boolean {
  return !!storedToken();
}
