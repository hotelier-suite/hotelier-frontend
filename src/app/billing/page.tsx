"use client";

import { useEffect, useState } from "react";
import BillingDashboard from "./components/billing-dashboard";
import {
  billingApi,
  Invoice,
  Payment,
  FinancialReport,
} from "@/lib/api/billing";

interface BillingData {
  invoices: Invoice[];
  payments: Payment[];
  reports: FinancialReport[];
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BillingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [invoices, payments, reports] = await Promise.all([
          billingApi.getInvoices(),
          billingApi.getPayments(),
          billingApi.getFinancialReports(),
        ]);
        setData({ invoices, payments, reports });
        setError(null);
      } catch (error) {
        console.error("Error fetching billing data:", error);
        setError("Error loading billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading billing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">No billing data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <BillingDashboard
        initialInvoices={data.invoices}
        initialPayments={data.payments}
        initialReports={data.reports}
      />
    </div>
  );
}
