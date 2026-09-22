import clsx from "clsx";

const DELIVERY_COLORS: Record<string, string> = {
  "New Order": "bg-gray-100 text-gray-700",
  Confirmed: "bg-blue-50 text-blue-700",
  "Vendor Confirmed": "bg-indigo-50 text-indigo-700",
  "Ready for Delivery": "bg-cyan-50 text-cyan-700",
  "Delivery Scheduled": "bg-purple-50 text-purple-700",
  "Out for Delivery": "bg-amber-50 text-amber-700",
  Delivered: "bg-green-50 text-green-700",
  "Delivery Failed": "bg-red-50 text-red-700",
  Rescheduled: "bg-orange-50 text-orange-700",
  Cancelled: "bg-red-100 text-red-800",
  Returned: "bg-rose-50 text-rose-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  "Not Paid": "bg-red-50 text-red-700",
  "Deposit Paid": "bg-amber-50 text-amber-700",
  "Partially Paid": "bg-amber-100 text-amber-800",
  "Fully Paid": "bg-green-50 text-green-700",
  COD: "bg-blue-50 text-blue-700",
  Cancelled: "bg-gray-100 text-gray-600",
  Refunded: "bg-purple-50 text-purple-700",
};

export function DeliveryStatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx("badge", DELIVERY_COLORS[status] ?? "bg-gray-100 text-gray-700")}>
      {status}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx("badge", PAYMENT_COLORS[status] ?? "bg-gray-100 text-gray-700")}>
      {status}
    </span>
  );
}

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "green" | "red" | "amber" | "blue" }) {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  };
  return <span className={clsx("badge", tones[tone])}>{children}</span>;
}
