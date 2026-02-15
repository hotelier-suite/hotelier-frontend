import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ClientLayoutWrapper } from "./client-layout-wrapper";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const pageT = await getTranslations({ locale, namespace: "PageTitles" });

  return {
    title: {
      template: "Hotelier %s",
      default: `Hotelier ${pageT("dashboard")}`,
    },
    description: t("description"),
    openGraph: {
      title: "Hotelier",
      description: t("ogDescription"),
      type: "website",
      locale: locale === "es" ? "es_CO" : "en_US",
      siteName: "Hotelier",
    },
    twitter: {
      card: "summary_large_image",
      title: "Hotelier",
      description: t("ogDescription"),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
    </NextIntlClientProvider>
  );
}
