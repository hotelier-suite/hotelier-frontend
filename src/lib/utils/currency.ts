// Currency utilities for multi-currency support (UR-043)

export type SupportedCurrency = "USD" | "COP";

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    decimals: 2,
  },
  COP: {
    code: "COP",
    symbol: "$",
    name: "Peso Colombiano",
    locale: "es-CO",
    decimals: 0,
  },
};

export function formatCurrency(
  amount: number,
  currencyCode: string = "COP",
): string {
  const key = currencyCode as SupportedCurrency;
  const config = CURRENCIES[key] || CURRENCIES.COP;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(amount);
  } catch (error) {
    console.warn(`Error formatting currency ${currencyCode}:`, error);
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

export function parseCurrencyAmount(value: string): number {
  // Remove currency symbols and formatting
  const cleanValue = value.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

export function getCurrencySymbol(currencyCode: SupportedCurrency): string {
  return CURRENCIES[currencyCode]?.symbol || "$";
}

export function validateCurrencyCode(code: string): code is SupportedCurrency {
  return code === "USD" || code === "COP";
}

// Exchange rate utilities (would connect to real API in production)
export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  exchangeRate?: number,
): number {
  if (from === to) return amount;

  // Mock exchange rate - in production this would come from a real API
  const mockRates = {
    "USD-COP": 4200,
    "COP-USD": 1 / 4200,
  };

  const rateKey = `${from}-${to}` as keyof typeof mockRates;
  const rate = exchangeRate || mockRates[rateKey] || 1;

  return amount * rate;
}
