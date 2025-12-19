"use client";

import { Badge } from "@/components/ui/badge";

interface InvoiceStatusBadgeProps {
  status: string;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const variants: Record<string, string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

interface PaymentMethodBadgeProps {
  method: string | null | undefined;
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  if (!method) return <Badge variant="outline">No payment</Badge>;

  const variants: Record<string, string> = {
    CREDIT_CARD: "bg-blue-100 text-blue-800",
    DEBIT_CARD: "bg-blue-100 text-blue-800",
    CASH: "bg-green-100 text-green-800",
    BANK_TRANSFER: "bg-purple-100 text-purple-800",
    MOBILE_PAYMENT: "bg-indigo-100 text-indigo-800",
    CRYPTOCURRENCY: "bg-yellow-100 text-yellow-800",
    GIFT_CARD: "bg-pink-100 text-pink-800",
    CHECK: "bg-orange-100 text-orange-800",
    tarjeta: "bg-blue-100 text-blue-800", // Legacy support
    efectivo: "bg-green-100 text-green-800", // Legacy support
    transferencia: "bg-purple-100 text-purple-800", // Legacy support
  };

  const getDisplayName = (method: string) => {
    const displayNames: Record<string, string> = {
      CASH: "Cash",
      CREDIT_CARD: "Credit Card",
      DEBIT_CARD: "Debit Card",
      BANK_TRANSFER: "Bank Transfer",
      CHECK: "Check",
      GIFT_CARD: "Gift Card",
    };
    return displayNames[method] || method;
  };

  return (
    <Badge className={variants[method] || "bg-gray-100 text-gray-800"}>
      {getDisplayName(method)}
    </Badge>
  );
}
