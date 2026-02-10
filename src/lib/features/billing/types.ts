import { Invoice, InvoiceItem, PaymentMethod } from "../shared/types";

export type { Invoice, InvoiceItem, PaymentMethod };

export type PaymentStatus = "completed" | "pending" | "failed" | "refunded";

export interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  status: string;
  notes?: string;
}

export interface FinancialReport {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  invoices: number;
  paid?: number;
  pending: number;
  paymentPercentage: number;
}

export interface CreateInvoiceDto {
  guestName: string;
  roomNumber: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxes: number;
  total: number;
  reservationId: number;
  paymentMethod?: string;
  invoiceItems: Array<{
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

// Backend types matching the backend DTOs
export interface BackendPayment {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  status: string;
  processedAt?: string;
  createdAt: string;
  reference?: string;
  notes?: string;
}

export interface BackendInvoice {
  id: number;
  number: string;
  guestName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  paymentMethod?:
    | "CASH"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "BANK_TRANSFER"
    | "CHECK";
  reservationId: number;
  reservation?: {
    room: {
      number: string;
    };
    user?: {
      name: string;
    };
  };
  invoiceItems: BackendInvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendInvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface BackendBillingStats {
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceAmount: number;
}

export interface BillingStats {
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceAmount: number;
}

export interface RecordPaymentData {
  invoiceId: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
}
