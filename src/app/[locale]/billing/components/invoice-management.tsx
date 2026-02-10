"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";
import { Invoice } from "@/lib/types";
import { type ReservationBillingDetails } from "@/lib/features/reservations/types";
import { reservationsService } from "@/lib/features/reservations/service";
import { InvoiceDetailsDialog } from "./invoice-details-dialog";
import { InvoiceFilters } from "./invoice-filters";
import { InvoiceTable } from "./invoice-table";
import { NewInvoiceDialog } from "./new-invoice-dialog";

interface InvoiceManagementProps {
  invoices: Invoice[];
  onProcessPayment: (
    invoiceId: string | number,
    paymentMethod: string,
    reference: string,
  ) => void;
  onDownloadInvoice: (invoiceId: string | number) => void;
  onInvoiceAdd: (invoice: Invoice) => void;
}

export default function InvoiceManagement({
  invoices,
  onProcessPayment,
  onDownloadInvoice,
  onInvoiceAdd,
}: InvoiceManagementProps) {
  const { hasRole } = useAuthenticatedUser();
  const t = useTranslations("InvoiceManagement");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reservationsBillingData, setReservationsBillingData] = useState<
    ReservationBillingDetails[]
  >([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Fetch reservations with billing details
  useEffect(() => {
    const fetchReservationsBillingData = async () => {
      setLoadingReservations(true);
      try {
        const billingData =
          await reservationsService.getReservationsWithBillingDetails();
        // Show ALL reservations without paid invoices (pending payment)
        setReservationsBillingData(
          billingData.filter((bd) => !bd.hasInvoice && bd.grandTotal > 0),
        );
      } catch (error) {
        console.error("Error fetching reservations billing data:", error);
      } finally {
        setLoadingReservations(false);
      }
    };

    fetchReservationsBillingData();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailsDialogOpen(true);
  };

  const handleProcessPayment = (invoiceId: string | number) => {
    // Find the current invoice
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    // Use the original payment method from the invoice or CASH as fallback
    const paymentMethod = invoice.paymentMethod || "CASH";
    onProcessPayment(invoiceId, paymentMethod, `REF-${Date.now()}`);
  };

  return (
    <div className="space-y-4">
      {/* Header with New Invoice Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{t("invoicesTitle")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("invoiceManagement")}
          </p>
          {reservationsBillingData.length > 0 && (
            <p className="text-sm font-medium text-orange-600 mt-1">
              {t("reservationsPendingPayment", {
                count: reservationsBillingData.length,
              })}
            </p>
          )}
        </div>
        {!hasRole("client") && (
          <NewInvoiceDialog
            reservationsBillingData={reservationsBillingData}
            loadingReservations={loadingReservations}
            onInvoiceAdd={onInvoiceAdd}
          />
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("invoiceList")}</CardTitle>
          <CardDescription>
            {t("invoicesFound", { count: filteredInvoices.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceTable
            invoices={filteredInvoices}
            onViewDetails={handleViewDetails}
            onProcessPayment={handleProcessPayment}
            onDownloadInvoice={onDownloadInvoice}
          />
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      {selectedInvoice && (
        <InvoiceDetailsDialog
          invoice={selectedInvoice}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
        />
      )}
    </div>
  );
}
