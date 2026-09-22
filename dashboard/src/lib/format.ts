export function formatMoney(amount: number, symbol = "£"): string {
  const n = Number.isFinite(amount) ? amount : 0;
  return `${symbol}${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function toDateInputValue(d: string | Date | null | undefined): string {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function telHref(phone: string | null | undefined): string {
  return `tel:${(phone ?? "").replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(phone: string | null | undefined, message?: string): string {
  const digits = (phone ?? "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}
