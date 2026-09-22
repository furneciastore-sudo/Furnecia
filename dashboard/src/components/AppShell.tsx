"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/orders", label: "Orders", icon: "📦" },
  { href: "/orders/new", label: "Add Order", icon: "➕" },
  { href: "/delivery-checker", label: "Delivery Checker", icon: "📅" },
  { href: "/reminders", label: "Reminders", icon: "⏰" },
  { href: "/vendors", label: "Vendors", icon: "🚚" },
  { href: "/products", label: "Products", icon: "🛋️" },
  { href: "/reports", label: "Reports", icon: "📊" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function AppShell({
  children,
  businessName,
}: {
  children: React.ReactNode;
  businessName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      {/* Mobile top bar */}
      <div className="no-print flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-2xl leading-none hover:bg-gray-100"
        >
          ☰
        </button>
        <span className="font-semibold text-brand-800">{businessName}</span>
        <Link href="/orders/new" className="btn-primary px-3 py-1.5 text-xs">
          + Order
        </Link>
      </div>

      {/* Mobile slide-over */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white p-4 shadow-xl">
            <SidebarContent pathname={pathname} businessName={businessName} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="no-print hidden w-64 shrink-0 border-r border-gray-200 bg-white p-4 lg:block">
        <SidebarContent pathname={pathname} businessName={businessName} />
      </aside>

      <main className="min-h-screen flex-1 bg-gray-50 p-4 lg:p-6">{children}</main>
    </div>
  );
}

function SidebarContent({
  pathname,
  businessName,
  onNavigate,
}: {
  pathname: string;
  businessName: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 hidden items-center gap-2 lg:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
          F
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{businessName}</p>
          <p className="text-xs text-gray-400">Order Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                active ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
