"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "D" },
  { href: "/va-analytics", label: "VA Analytics", icon: "V" },
  { href: "/alerts", label: "Alerts", icon: "A" },
  { href: "/digital-twin", label: "Digital Twin", icon: "T" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <Link
        className="sidebar-brand"
        href="/dashboard"
        aria-label="IntelliPlant dashboard"
      >
        <span className="sidebar-brand-mark">IP</span>
        <span className="sidebar-brand-text">IntelliPlant</span>
      </Link>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              href={item.href}
              key={item.href}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
