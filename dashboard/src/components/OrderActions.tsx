"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { localFetch as fetch } from "@/lib/localFetch";

export function OrderActions({ orderId, isArchived }: { orderId: number; isArchived: boolean }) {
  const router = useRouter();

  async function duplicate() {
    const res = await fetch(`/api/orders/${orderId}/duplicate`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      router.push(`/orders/view?id=${data.order.id}`);
    }
  }

  async function archive() {
    if (!confirm("Archive this order? It stays recoverable from Orders → View Archived Orders.")) return;
    await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    router.push("/orders");
  }

  async function restore() {
    await fetch(`/api/orders/${orderId}/restore`, { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/orders/print?id=${orderId}`} className="btn-secondary">Print</Link>
      <button onClick={duplicate} className="btn-secondary">Duplicate</button>
      {isArchived ? (
        <button onClick={restore} className="btn-secondary">Restore</button>
      ) : (
        <button onClick={archive} className="btn-danger">Archive</button>
      )}
    </div>
  );
}
