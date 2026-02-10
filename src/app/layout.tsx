import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotelier",
  keywords: [
    "hotel",
    "management",
    "hotel management",
    "PMS",
    "hotel system",
    "hotelier",
  ],
  authors: [{ name: "Hotelier Team" }],
  creator: "Hotelier",
  publisher: "Hotelier",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// The root layout is intentionally minimal.
// Locale-specific rendering (lang attr, providers) is in [locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
