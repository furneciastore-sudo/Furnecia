import clsx from "clsx";
import Link from "next/link";

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "warning" | "danger" | "success";
  href?: string;
}) {
  const toneClasses: Record<string, string> = {
    default: "text-gray-900",
    warning: "text-amber-600",
    danger: "text-red-600",
    success: "text-green-600",
  };

  const content = (
    <div className="card flex flex-col gap-1 hover:shadow-md transition-shadow">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <span className={clsx("text-2xl font-semibold", toneClasses[tone])}>{value}</span>
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
