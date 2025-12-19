import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "./client-layout-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotelier",
  description:
    "Comprehensive hotel management system. Simplify your hotel administration with modern and efficient tools.",
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
  openGraph: {
    title: "Hotelier",
    description: "Comprehensive hotel management system",
    type: "website",
    locale: "en_US",
    siteName: "Hotelier",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotelier",
    description: "Comprehensive hotel management system",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
