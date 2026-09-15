import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { OrderForm } from "@/components/OrderForm";
import { OrderActions } from "@/components/OrderActions";
import { RecordPayment } from "@/components/RecordPayment";
import { orderToFormValues } from "@/lib/orderFormTypes";
import { formatDate, formatMoney } from "@/lib/format";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string };
}) {
  const id = Number(params.id);
  const [order, vendors, products, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: {
        vendor: true,
        payments: { orderBy: { date: "desc" } },
        reminders: { orderBy: { date: "asc" } },
      },
    }),
    prisma.vendor.findMany({ where: { status: "Active" }, orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { status: "Active" }, orderBy: { name: "asc" } }),
    getSettings(),
  ]);

  if (!order) notFound();

  const currency = settings.currencySymbol;

  return (
    <div className="space-y-4">
      {searchParams.saved === "1" && (
        <div className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-800">
          ✅ Order {order.orderNo} created successfully.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Order {order.orderNo} {order.isArchived && <span className="badge bg-gray-200 text-gray-600 ml-2">Archived</span>}
          </h1>
          <p className="text-sm text-gray-500">Booked {formatDate(order.bookingDate)} · {order.customerName}</p>
        </div>
        <OrderActions orderId={order.id} isArchived={order.isArchived} />
      </div>

      <OrderForm
        mode="edit"
        orderId={order.id}
        orderNo={order.orderNo}
        initial={orderToFormValues(order)}
        vendors={vendors}
        products={products}
        settings={settings}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Customer Payment History</h3>
            <RecordPayment orderId={order.id} type="customer" currency={currency} />
          </div>
          {order.payments.filter((p) => p.type === "customer").length === 0 ? (
            <p className="text-sm text-gray-400">No customer payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {order.payments.filter((p) => p.type === "customer").map((p) => (
                <li key={p.id} className="flex justify-between py-1.5">
                  <span>{formatDate(p.date)} {p.method ? `· ${p.method}` : ""}</span>
                  <span className="font-medium">{formatMoney(p.amount, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Vendor Payment History</h3>
            <RecordPayment orderId={order.id} type="vendor" currency={currency} />
          </div>
          {order.payments.filter((p) => p.type === "vendor").length === 0 ? (
            <p className="text-sm text-gray-400">No vendor payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {order.payments.filter((p) => p.type === "vendor").map((p) => (
                <li key={p.id} className="flex justify-between py-1.5">
                  <span>{formatDate(p.date)} {p.method ? `· ${p.method}` : ""}</span>
                  <span className="font-medium">{formatMoney(p.amount, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
