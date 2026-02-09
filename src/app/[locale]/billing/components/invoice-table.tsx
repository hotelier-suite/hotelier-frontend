"use client";

import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Eye } from "lucide-react";
import { Invoice } from "@/lib/types";
import { InvoiceStatusBadge, PaymentMethodBadge } from "./invoice-badges";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewDetails: (invoice: Invoice) => void;
  onProcessPayment: (invoiceId: string | number) => void;
  onDownloadInvoice: (invoiceId: string | number) => void;
}

export function InvoiceTable({
  invoices,
  onViewDetails,
  onProcessPayment,
  onDownloadInvoice,
}: InvoiceTableProps) {
  const { hasRole } = useAuthenticatedUser();
  const t = useTranslations("InvoiceTable");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("number")}</TableHead>
          <TableHead>{t("guest")}</TableHead>
          <TableHead>{t("room")}</TableHead>
          <TableHead>{t("date")}</TableHead>
          <TableHead>{t("total")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("paymentMethod")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.number}</TableCell>
            <TableCell>{invoice.guest}</TableCell>
            <TableCell>{invoice.room}</TableCell>
            <TableCell>
              {new Date(invoice.issueDate).toLocaleDateString(intlLocale)}
            </TableCell>
            <TableCell className="font-semibold">
              {formatCurrency(invoice.total)}
            </TableCell>
            <TableCell>
              <InvoiceStatusBadge status={invoice.status} />
            </TableCell>
            <TableCell>
              <PaymentMethodBadge method={invoice.paymentMethod} />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(invoice)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  {t("view")}
                </Button>
                {!hasRole("client") && invoice.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onProcessPayment(invoice.id)}
                  >
                    <CreditCard className="mr-1 h-4 w-4" />
                    {t("charge")}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownloadInvoice(invoice.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
