"use client";

import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Invoice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface InvoiceDetailsDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailsDialog({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailsDialogProps) {
  const t = useTranslations("InvoiceDetailsDialog");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("invoiceNumber", { number: invoice.number })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                {t("guest")}
              </h4>
              <p>{invoice.guest}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                {t("room")}
              </h4>
              <p>{invoice.room}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                {t("date")}
              </h4>
              <p>
                {new Date(invoice.issueDate).toLocaleDateString(intlLocale)}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                {t("status")}
              </h4>
              <Badge
                className={
                  invoice.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : invoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {t(
                  `status${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}`,
                )}
              </Badge>
            </div>
            {invoice.paymentMethod && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  {t("paymentMethod")}
                </h4>
                <p>{invoice.paymentMethod}</p>
              </div>
            )}
          </div>

          {/* Charge details */}
          <div className="space-y-4">
            <h4 className="font-medium">{t("chargeDetails")}</h4>
            <div className="space-y-2 border rounded-lg p-4">
              {invoice.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-muted-foreground">
                        {t("quantity")}: {item.quantity}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity, intlLocale)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals summary */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <p className="text-muted-foreground">{t("subtotal")}</p>
              <p>{formatCurrency(invoice.subtotal, intlLocale)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">{t("tax")}</p>
              <p>{formatCurrency(invoice.taxes, intlLocale)}</p>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <p>{t("total")}</p>
              <p>{formatCurrency(invoice.total, intlLocale)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
