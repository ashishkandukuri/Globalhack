"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "va-analytics": "VA Analytics",
  VA: "VA Analytics",
  alerts: "Alerts",
  "digital-twin": "Digital Twin",
  "digital twin": "Digital Twin",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  const currentPage = segments.at(-1);

  return (
    <header className="topbar">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/dashboard">Home</Link>
        {currentPage && (
          <>
            <span aria-hidden="true">/</span>
            <span>{routeLabels[currentPage] ?? currentPage}</span>
          </>
        )}
      </nav>
    </header>
  );
}
