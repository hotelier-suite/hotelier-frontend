"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "./badge";

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  showDual?: boolean;
  className?: string;
}

interface DualCurrencyData {
  cop: { amount: number; formatted: string };
  usd: { amount: number; formatted: string };
}

export function CurrencyDisplay({
  amount,
  currency,
  showDual = false,
  className = "",
}: CurrencyDisplayProps) {
  const [dualDisplay, setDualDisplay] = useState<DualCurrencyData | null>(null);
  const [loading, setLoading] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    if (!showDual) return;

    const fetchDualDisplay = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/currency/dual-display?amount=${amount}&currency=${currency}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setDualDisplay(data);
        }
      } catch (error) {
        console.error("Error fetching dual currency display:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDualDisplay();
  }, [amount, currency, showDual]);

  const formatAmount = (value: number, curr: string): string => {
    const fmtLocale =
      curr === "COP" ? "es-CO" : locale === "es" ? "es-ES" : "en-US";
    return new Intl.NumberFormat(fmtLocale, {
      style: "currency",
      currency: curr.toUpperCase(),
      minimumFractionDigits: curr === "COP" ? 0 : 2,
      maximumFractionDigits: curr === "COP" ? 0 : 2,
    }).format(value);
  };

  if (!showDual) {
    return <span className={className}>{formatAmount(amount, currency)}</span>;
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  if (!dualDisplay) {
    return <span className={className}>{formatAmount(amount, currency)}</span>;
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="font-medium">
        {currency === "COP"
          ? dualDisplay.cop.formatted
          : dualDisplay.usd.formatted}
      </span>
      <Badge variant="outline" className="text-xs w-fit">
        {currency === "COP"
          ? dualDisplay.usd.formatted
          : dualDisplay.cop.formatted}
      </Badge>
    </div>
  );
}

interface ConversionResult {
  amount: number;
  convertedAmount: number;
  rate: number;
  fromCurrency: string;
  toCurrency: string;
}

interface CurrencyConverterProps {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  onConvert?: (result: ConversionResult) => void;
}

export function CurrencyConverter({
  amount,
  fromCurrency,
  toCurrency,
  onConvert,
}: CurrencyConverterProps) {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const t = useTranslations("CurrencyConverter");

  useEffect(() => {
    const convertCurrency = async () => {
      if (fromCurrency === toCurrency) {
        const sameResult: ConversionResult = {
          amount: amount,
          fromCurrency: fromCurrency,
          convertedAmount: amount,
          toCurrency: toCurrency,
          rate: 1,
        };
        setResult(sameResult);
        onConvert?.(sameResult);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/currency/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setResult(data);
          onConvert?.(data);
        }
      } catch (error) {
        console.error("Error converting currency:", error);
      } finally {
        setLoading(false);
      }
    };

    convertCurrency();
  }, [amount, fromCurrency, toCurrency, onConvert]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="text-sm text-gray-600">
      {new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
        style: "currency",
        currency: result.toCurrency,
        minimumFractionDigits: result.toCurrency === "COP" ? 0 : 2,
      }).format(result.convertedAmount)}
      <span className="text-xs ml-1">
        ({t("rate")}: {result.rate})
      </span>
    </div>
  );
}
