import { enUS, es } from "date-fns/locale";
import type { Locale } from "date-fns";

/**
 * Maps a next-intl locale string to a date-fns Locale object.
 */
export function getDateFnsLocale(locale: string): Locale {
  switch (locale) {
    case "es":
      return es;
    default:
      return enUS;
  }
}

/**
 * Maps a next-intl locale string to an Intl-compatible locale string
 * for use with Intl.NumberFormat, toLocaleString, etc.
 */
export function getIntlLocale(locale: string): string {
  switch (locale) {
    case "es":
      return "es-CO";
    default:
      return "en-US";
  }
}
