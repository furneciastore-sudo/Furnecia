// Reads a free-text order description (typed or pasted into the Add Order
// chat box) and asks Claude or ChatGPT to extract structured order fields.
// This is the one feature in the app that needs internet — only while it's
// being used — plus an API key the user supplies themselves in Settings.
// The extracted fields are handed back for the form to pre-fill; nothing is
// saved until the user reviews and clicks Save, same as any other order.

import { FLOORS } from "@/lib/calculations";
import type { SettingsMap } from "@/lib/settingsShared";
import type { OrderFormValues, VendorOption, ProductOption } from "@/lib/orderFormTypes";

export class AiParseError extends Error {}

export type ParsedOrder = Partial<OrderFormValues> & { vendorName?: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function parseOrderText(
  text: string,
  settings: SettingsMap,
  vendors: VendorOption[],
  products: ProductOption[]
): Promise<ParsedOrder> {
  const apiKey = settings.aiApiKey?.trim();
  const provider = settings.aiProvider === "openai" ? "openai" : "claude";
  if (!apiKey) {
    throw new AiParseError("No AI API key set yet. Add one in Settings → AI Auto-fill.");
  }
  if (!text.trim()) {
    throw new AiParseError("Type or paste the order details first.");
  }

  const today = new Date().toISOString().slice(0, 10);
  const vendorNames = vendors.map((v) => v.name).join(", ") || "(none saved yet)";
  const productNames = products.map((p) => p.name).join(", ") || "(none saved yet)";

  const system = [
    "You extract furniture order details from free-form text written by a shop owner.",
    "Reply with ONLY a single JSON object — no prose, no markdown code fences.",
    `Today's date is ${today}. Currency is ${settings.currencySymbol}.`,
    `Known vendor names: ${vendorNames}`,
    `Known product names: ${productNames}`,
    "JSON fields to include, ONLY when clearly stated or clearly implied in the text (omit anything you're not sure about, never invent a value):",
    "customerName (string), contact (string, phone number), whatsapp (string), address (string, full delivery address), postcode (string), city (string),",
    "productName (string), productCode (string), colour (string), quantity (integer, default 1), productPrice (number),",
    `vendorName (string — copy one of the Known vendor names above only if it clearly matches, otherwise omit),`,
    "bookingDate (YYYY-MM-DD, use today's date if not stated), deliveryDateExpected (YYYY-MM-DD),",
    `floor (exactly one of: ${FLOORS.join(", ")}), liftAvailable (boolean), fittingRequired (boolean),`,
    "additionalCharge (number), discount (number), amountPaid (number),",
    "notes (string — mention anything mentioned in the text that didn't fit another field, or that you're unsure about).",
    "Be accurate over complete: a missing field the shop owner can fill in by hand is fine, a wrong guess is not.",
  ].join("\n");

  const raw =
    provider === "openai"
      ? await callOpenAi(apiKey, settings.aiModel, system, text)
      : await callClaude(apiKey, settings.aiModel, system, text);

  const json = parseJsonLoose(raw);
  return normalise(json, vendors);
}

function parseJsonLoose(raw: string): Record<string, unknown> {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new AiParseError("The AI didn't return a readable result. Try rephrasing, or fill the form manually.");
  }
}

function normalise(json: Record<string, unknown>, vendors: VendorOption[]): ParsedOrder {
  const out: ParsedOrder = {};
  const str = (k: string) => (typeof json[k] === "string" && (json[k] as string).trim() ? (json[k] as string).trim() : undefined);
  const num = (k: string) => {
    const v = Number(json[k]);
    return Number.isFinite(v) ? v : undefined;
  };
  const bool = (k: string) => (typeof json[k] === "boolean" ? (json[k] as boolean) : undefined);

  out.customerName = str("customerName");
  out.contact = str("contact");
  out.whatsapp = str("whatsapp");
  out.address = str("address");
  out.postcode = str("postcode");
  out.city = str("city");
  out.productName = str("productName");
  out.productCode = str("productCode");
  out.colour = str("colour");
  const quantity = num("quantity");
  if (quantity !== undefined) out.quantity = Math.max(1, Math.round(quantity));
  out.productPrice = num("productPrice");

  const vendorName = str("vendorName");
  if (vendorName) {
    const match = vendors.find((v) => v.name.toLowerCase() === vendorName.toLowerCase());
    if (match) out.vendorId = match.id;
  }

  const bookingDate = str("bookingDate");
  if (bookingDate && DATE_RE.test(bookingDate)) out.bookingDate = bookingDate;
  const deliveryDateExpected = str("deliveryDateExpected");
  if (deliveryDateExpected && DATE_RE.test(deliveryDateExpected)) out.deliveryDateExpected = deliveryDateExpected;

  const floor = str("floor");
  if (floor && (FLOORS as readonly string[]).includes(floor)) out.floor = floor;
  out.liftAvailable = bool("liftAvailable");
  out.fittingRequired = bool("fittingRequired");

  out.additionalCharge = num("additionalCharge");
  out.discount = num("discount");
  out.amountPaid = num("amountPaid");
  out.notes = str("notes");

  return out;
}

async function callClaude(apiKey: string, model: string, system: string, userText: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: model?.trim() || "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        system,
        messages: [{ role: "user", content: userText }],
      }),
    });
  } catch {
    throw new AiParseError("Could not reach Claude — check your internet connection.");
  }
  if (!res.ok) {
    throw new AiParseError(`Claude API error (${res.status}). ${await apiErrorMessage(res)}`);
  }
  const data = await res.json();
  const out = data?.content?.[0]?.text;
  if (!out) throw new AiParseError("Claude returned an empty response.");
  return out;
}

async function callOpenAi(apiKey: string, model: string, system: string, userText: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model?.trim() || "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: userText },
        ],
      }),
    });
  } catch {
    throw new AiParseError(
      "Could not reach ChatGPT — check your internet connection, or this device may be blocking the request (try the Claude option instead)."
    );
  }
  if (!res.ok) {
    throw new AiParseError(`ChatGPT API error (${res.status}). ${await apiErrorMessage(res)}`);
  }
  const data = await res.json();
  const out = data?.choices?.[0]?.message?.content;
  if (!out) throw new AiParseError("ChatGPT returned an empty response.");
  return out;
}

async function apiErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body?.error?.message || "";
  } catch {
    return "";
  }
}
