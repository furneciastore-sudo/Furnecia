// Drop-in replacement for `fetch()` used throughout the UI. Every call
// site already does `fetch('/api/...', { method, body })` and reads
// `res.ok` / `res.json()` — this keeps that exact shape, but resolves
// the "request" against the local, offline data layer instead of the
// network, so none of the calling components had to change their logic.

import * as api from "@/lib/localApi";
import { ApiError } from "@/lib/localApi";

class LocalResponse {
  ok: boolean;
  status: number;
  private data: unknown;

  constructor(data: unknown, status = 200) {
    this.data = data;
    this.status = status;
    this.ok = status >= 200 && status < 300;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async json(): Promise<any> {
    return this.data;
  }
}

function parseBody(init?: RequestInit): unknown {
  if (!init?.body) return undefined;
  try {
    return JSON.parse(init.body as string);
  } catch {
    return undefined;
  }
}

function num(v: string | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function localFetch(url: string, init?: RequestInit): Promise<LocalResponse> {
  const method = (init?.method ?? "GET").toUpperCase();
  const [path, queryString] = url.split("?");
  const sp = new URLSearchParams(queryString ?? "");
  const body = parseBody(init);
  const segments = path.replace(/^\/api\//, "").split("/").filter(Boolean);

  try {
    // orders
    if (segments[0] === "orders") {
      if (segments.length === 1) {
        if (method === "GET") {
          return new LocalResponse({
            orders: api.listOrders({
              search: sp.get("search") ?? undefined,
              vendorId: num(sp.get("vendorId")),
              deliveryStatus: sp.get("deliveryStatus") ?? undefined,
              paymentStatus: sp.get("paymentStatus") ?? undefined,
              floor: sp.get("floor") ?? undefined,
              fitting: (sp.get("fitting") as "yes" | "no") ?? undefined,
              lift: (sp.get("lift") as "yes" | "no") ?? undefined,
              customerPendingOnly: sp.get("customerPendingOnly") === "1",
              vendorPendingOnly: sp.get("vendorPendingOnly") === "1",
              archived: sp.get("archived") === "1",
              dateField: sp.get("dateField") === "booking" ? "booking" : "delivery",
              from: sp.get("from") ?? undefined,
              to: sp.get("to") ?? undefined,
            }),
          });
        }
        if (method === "POST") return new LocalResponse({ order: api.createOrder(body) }, 201);
      }
      const id = Number(segments[1]);
      if (segments.length === 2) {
        if (method === "GET") return new LocalResponse({ order: api.getOrder(id) });
        if (method === "PUT") return new LocalResponse({ order: api.updateOrder(id, body) });
        if (method === "DELETE") return new LocalResponse({ order: api.archiveOrder(id) });
      }
      if (segments[2] === "restore" && method === "POST") return new LocalResponse({ order: api.restoreOrder(id) });
      if (segments[2] === "duplicate" && method === "POST") return new LocalResponse({ order: api.duplicateOrder(id) }, 201);
      if (segments[2] === "status" && method === "PATCH") {
        const b = body as { deliveryStatus: string };
        return new LocalResponse({ order: api.updateOrderStatus(id, b.deliveryStatus) });
      }
      if (segments[2] === "payments" && method === "POST") {
        return new LocalResponse({ order: api.recordPayment(id, body) });
      }
    }

    // vendors
    if (segments[0] === "vendors") {
      if (segments.length === 1) {
        if (method === "GET") return new LocalResponse({ vendors: api.listVendorsWithStats() });
        if (method === "POST") return new LocalResponse({ vendor: api.createVendor(body) }, 201);
      }
      const id = Number(segments[1]);
      if (method === "GET") return new LocalResponse({ vendor: api.getVendor(id) });
      if (method === "PUT") return new LocalResponse({ vendor: api.updateVendor(id, body) });
      if (method === "DELETE") return new LocalResponse(api.deleteVendor(id));
    }

    // products
    if (segments[0] === "products") {
      if (segments.length === 1) {
        if (method === "GET") return new LocalResponse({ products: api.listProducts() });
        if (method === "POST") return new LocalResponse({ product: api.createProduct(body) }, 201);
      }
      const id = Number(segments[1]);
      if (method === "PUT") return new LocalResponse({ product: api.updateProduct(id, body) });
      if (method === "DELETE") {
        api.deactivateProduct(id);
        return new LocalResponse({ ok: true });
      }
    }

    // settings
    if (segments[0] === "settings") {
      if (method === "GET") return new LocalResponse({ settings: api.getSettings() });
      if (method === "PUT") return new LocalResponse({ settings: api.setSettings(body as Record<string, string>) });
    }

    // reminders
    if (segments[0] === "reminders") {
      if (segments.length === 1) {
        if (method === "GET") return new LocalResponse({ reminders: api.listReminders(sp.get("status") ?? undefined) });
        if (method === "POST") return new LocalResponse({ reminder: api.createReminder(body) }, 201);
      }
      const id = Number(segments[1]);
      if (method === "PATCH") {
        const b = body as { status: string };
        return new LocalResponse({ reminder: api.updateReminderStatus(id, b.status) });
      }
      if (method === "DELETE") {
        api.deleteReminder(id);
        return new LocalResponse({ ok: true });
      }
    }

    // delivery schedule
    if (segments[0] === "delivery-schedule") {
      if (method === "GET") return new LocalResponse({ rows: api.getDeliverySchedule() });
      if (method === "PUT") {
        const b = body as { rows: { postcodePrefix: string; areaName?: string; days: string[] }[] };
        return new LocalResponse({ rows: api.saveDeliverySchedule(b.rows) });
      }
    }

    // postcode check
    if (segments[0] === "postcode-check" && method === "GET") {
      return new LocalResponse(api.checkPostcode(sp.get("postcode") ?? "", sp.get("from") ?? new Date().toISOString()));
    }

    // lead-time delivery check
    if (segments[0] === "delivery-check" && method === "GET") {
      return new LocalResponse(
        api.checkDeliveryLeadTime({
          productId: num(sp.get("productId")),
          vendorId: num(sp.get("vendorId")),
          bookingDate: sp.get("bookingDate") ?? new Date().toISOString(),
          leadTimeDays: num(sp.get("leadTimeDays")),
        })
      );
    }

    // dashboard stats
    if (segments[0] === "dashboard" && segments[1] === "stats" && method === "GET") {
      return new LocalResponse(
        api.getDashboardStats((sp.get("range") as never) ?? "today", {
          from: sp.get("from") ?? undefined,
          to: sp.get("to") ?? undefined,
        })
      );
    }

    // reports
    if (segments[0] === "reports") {
      if (segments[1] === "vendor-daily" && method === "GET") {
        return new LocalResponse(api.vendorDailyReport(sp.get("date") ?? "", num(sp.get("vendorId"))));
      }
      if (segments[1] === "delivery-daily" && method === "GET") {
        return new LocalResponse(api.deliveryDailyReport(sp.get("date") ?? new Date().toISOString().slice(0, 10)));
      }
      if (segments[1] === "payments" && method === "GET") {
        return new LocalResponse(
          api.paymentsReport((sp.get("range") as never) ?? "thisMonth", { from: sp.get("from") ?? undefined, to: sp.get("to") ?? undefined })
        );
      }
      if (segments[1] === "profit" && method === "GET") {
        return new LocalResponse(
          api.profitReport((sp.get("range") as never) ?? "thisMonth", { from: sp.get("from") ?? undefined, to: sp.get("to") ?? undefined })
        );
      }
    }

    return new LocalResponse({ error: "Not found" }, 404);
  } catch (e) {
    if (e instanceof ApiError) return new LocalResponse({ error: e.message }, e.status);
    if (e && typeof e === "object" && "issues" in e) {
      // zod validation error
      return new LocalResponse({ error: { formErrors: [String((e as { issues: unknown }).issues)] } }, 400);
    }
    return new LocalResponse({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
}
