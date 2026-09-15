import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { DeliveryStatusBadge, PaymentStatusBadge } from "@/components/Badge";
import { formatDate, formatMoney, telHref, whatsappHref } from "@/lib/format";

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: Number(params.id) },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });
  if (!vendor) notFound();
  const settings = await getSettings();
  const currency = settings.currencySymbol;

  return (
    <div className="space-y-4">
      <div>
        <Link href="/vendors" className="text-sm text-brand-600 hover:underline">← Back to Vendors</Link>
        <h1 className="text-xl font-semibold text-gray-900">{vendor.name}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          {vendor.contactPerson && <span>{vendor.contactPerson}</span>}
          {vendor.phone && <a className="text-brand-600" href={telHref(vendor.phone)}>{vendor.phone}</a>}
          {vendor.whatsapp && <a className="text-green-600" href={whatsappHref(vendor.whatsapp)} target="_blank" rel="noreferrer">WhatsApp</a>}
          {vendor.email && <span>{vendor.email}</span>}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Order History</h3>
        {vendor.orders.length === 0 ? (
          <p className="text-sm text-gray-400">No orders yet for this vendor.</p>
        ) : (
          <table className="min-w-[900px] w-full text-left text-xs">
            <thead className="text-gray-500">
              <tr>
                <th className="py-1.5">Order ID</th>
                <th className="py-1.5">Customer</th>
                <th className="py-1.5">Delivery Date</th>
                <th className="py-1.5">Vendor Cost</th>
                <th className="py-1.5">Paid</th>
                <th className="py-1.5">Pending</th>
                <th className="py-1.5">Delivery</th>
                <th className="py-1.5">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendor.orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-1.5"><Link href={`/orders/${o.id}`} className="font-medium text-brand-700">{o.orderNo}</Link></td>
                  <td className="py-1.5">{o.customerName}</td>
                  <td className="py-1.5">{formatDate(o.deliveryDateExpected)}</td>
                  <td className="py-1.5">{formatMoney(o.vendorTotalCost, currency)}</td>
                  <td className="py-1.5">{formatMoney(o.vendorPaid, currency)}</td>
                  <td className="py-1.5 text-amber-600">{formatMoney(o.vendorPending, currency)}</td>
                  <td className="py-1.5"><DeliveryStatusBadge status={o.deliveryStatus} /></td>
                  <td className="py-1.5"><PaymentStatusBadge status={o.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
