"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CreditCard, DollarSign, Receipt } from "lucide-react";
import InvoiceManagement from "./invoice-management";
import PaymentManagement from "./payment-management";
import FinancialReports from "./financial-reports";
import { billingService } from "@/lib/features/billing/service";
import { Invoice } from "@/lib/types";

interface Payment {
  id: string;
  invoiceId: string | number;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  status: string;
}

interface FinancialReport {
  period: string;
  revenue: number;
  invoices: number;
  paid?: number;
  pending: number;
  paymentPercentage?: number;
}

interface BillingDashboardProps {
  initialInvoices: Invoice[];
  initialPayments: Payment[];
  initialReports: FinancialReport[];
}

export default function BillingDashboard({
  initialInvoices,
  initialPayments,
  initialReports,
}: BillingDashboardProps) {
  const { user, hasRole } = useAuthContext();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);
  const [reports] = useState(initialReports);

  const isClient = hasRole("client");
  const clientInvoices = isClient
    ? invoices.filter(
        (invoice) =>
          invoice.guest === user?.name ||
          invoice.guest.toLowerCase().includes(user?.name?.toLowerCase() || ""),
      )
    : invoices;

  const handleProcessPayment = async (
    invoiceId: string | number,
    paymentMethod: string,
    reference: string,
  ) => {
    try {
      // Update invoice status in backend
      const updated = await billingService.markInvoiceAsPaid(
        String(invoiceId),
        paymentMethod,
      );
      // Refresh invoice locally
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoiceId ? (updated as Invoice) : inv)),
      );

      // Append a local payment record for visualization (backend payments may be mocked)
      const newPayment = {
        id: `P${String(payments.length + 1).padStart(3, "0")}`,
        invoiceId: String(invoiceId),
        date: new Date().toISOString().split("T")[0],
        amount: updated.total,
        method: paymentMethod,
        reference: reference,
        status: "approved",
      };
      setPayments((prev) => [newPayment, ...prev]);
    } catch (e) {
      console.error("Error processing payment:", e);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string | number) => {
    try {
      await billingService.downloadInvoice(String(invoiceId));
    } catch (error) {
      console.error("Error downloading invoice:", error);
      // Here you could show an error notification to the user
    }
  };

  const handleInvoiceAdd = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
  };

  // Calculate stats from current data
  const monthlyRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(
    (inv) => inv.status === "pending",
  ).length;
  const paymentRate =
    totalInvoices > 0
      ? (((totalInvoices - pendingInvoices) / totalInvoices) * 100).toFixed(1)
      : "0.0";

  // Ensure all numeric values are valid (not NaN)
  const safeMonthlyRevenue = isNaN(monthlyRevenue) ? 0 : monthlyRevenue;
  const safeTotalInvoices = isNaN(totalInvoices) ? 0 : totalInvoices;
  const safePaymentRate = isNaN(parseFloat(paymentRate)) ? "0.0" : paymentRate;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Invoice, payment, and financial report management
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${safeMonthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Invoices Issued
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeTotalInvoices}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <Receipt className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">To collect</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Collection Rate
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safePaymentRate}%</div>
            <p className="text-xs text-muted-foreground">Paid invoices</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">
            {isClient ? "My Invoices" : "Invoices"}
          </TabsTrigger>
          {!isClient && <TabsTrigger value="payments">Payments</TabsTrigger>}
          {!isClient && <TabsTrigger value="reports">Reports</TabsTrigger>}
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceManagement
            invoices={invoices}
            onProcessPayment={handleProcessPayment}
            onDownloadInvoice={handleDownloadInvoice}
            onInvoiceAdd={handleInvoiceAdd}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentManagement payments={payments} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <FinancialReports reports={reports} />
        </TabsContent>

        {isClient && (
          <TabsContent value="my-invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  My Invoices
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review and pay your pending invoices
                </p>
              </CardHeader>
              <CardContent>
                {clientInvoices.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">
                      You have no pending invoices
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Invoices will appear here when hotel staff assigns them to
                      you
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clientInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{invoice.number}</h4>
                            <p className="text-sm text-muted-foreground">
                              Issued on {invoice.issueDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              ${(Number(invoice.total) || 0).toLocaleString()}
                            </div>
                            <div className="flex justify-end">
                              {invoice.status === "pending" ? (
                                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                  Pending
                                </div>
                              ) : (
                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                  Paid
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {invoice.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleProcessPayment(invoice.id, "CASH", "")
                              }
                              className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90"
                            >
                              Pay with Cash
                            </button>
                            <button
                              onClick={() =>
                                handleProcessPayment(
                                  invoice.id,
                                  "CREDIT_CARD",
                                  "",
                                )
                              }
                              className="flex-1 border border-input px-4 py-2 rounded text-sm font-medium hover:bg-accent"
                            >
                              Pay with Card
                            </button>
                          </div>
                        )}

                        <div className="border-t pt-3">
                          <h5 className="font-medium mb-2">Details:</h5>
                          <div className="space-y-1 text-sm">
                            {invoice.items?.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{item.description}</span>
                                <span>
                                  $
                                  {(
                                    (item.quantity || 1) * (item.price || 0)
                                  ).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
