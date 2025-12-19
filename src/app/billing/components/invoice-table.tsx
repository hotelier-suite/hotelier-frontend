"use client";

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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Number</TableHead>
          <TableHead>Guest</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.number}</TableCell>
            <TableCell>{invoice.guest}</TableCell>
            <TableCell>{invoice.room}</TableCell>
            <TableCell>
              {new Date(invoice.issueDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="font-semibold">
              ${invoice.total.toLocaleString()}
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
                  View
                </Button>
                {!hasRole("client") && invoice.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onProcessPayment(invoice.id)}
                  >
                    <CreditCard className="mr-1 h-4 w-4" />
                    Charge
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
