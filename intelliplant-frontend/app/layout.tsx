import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Breadcrumb from "./breadcrumb/Breadcrumb";
import "./globals.css";
import "./sidebar/styles.css";
import "./breadcrumb/styles.css";
import "./dashboard/styles.css";
import "./va-analytics/styles.css";
import "./alerts/styles.css";
import Sidebar from "./sidebar/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntelliPlant",
  description: "IntelliPlant dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="app-main">
            <Breadcrumb />
            <div className="app-content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
