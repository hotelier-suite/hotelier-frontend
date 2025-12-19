// Base types - shared across all API modules
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Service types
export interface Service extends BaseEntity {
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  available: boolean;
}

// Invoice types
export interface InvoiceConcept {
  description: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total?: number;
}

export type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "CHECK"
  | "GIFT_CARD";
export interface Invoice {
  id: string | number;
  number: string;
  guest: string;
  room: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  paymentMethod?: PaymentMethod;
  items: InvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
  reservationId?: number;
}

// Dashboard types
export interface DashboardStats {
  totalRevenue: number;
  occupancyRate: number;
  activeReservations: number;
  pendingCheckouts: number;
  [key: string]: number;
}

export interface DashboardActivity {
  id: string | number;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface DashboardRevenue {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
  byCategory?: Record<string, number>;
}
