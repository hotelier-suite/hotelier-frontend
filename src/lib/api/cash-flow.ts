import { BaseEntity } from "../types";

export interface CashFlowEntry extends BaseEntity {
  type: CashFlowType;
  category: CashFlowCategory;
  amount: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  description: string;
  referenceId?: string;
  referenceType?: string;
  transactionDate: string;
  recordedBy?: number;
  notes?: string;
}

export enum CashFlowType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum CashFlowCategory {
  // Income Categories
  ROOM_REVENUE = "ROOM_REVENUE",
  RESTAURANT_REVENUE = "RESTAURANT_REVENUE",
  EVENT_REVENUE = "EVENT_REVENUE",
  RECREATIONAL_REVENUE = "RECREATIONAL_REVENUE",
  PARKING_REVENUE = "PARKING_REVENUE",
  SERVICES_REVENUE = "SERVICES_REVENUE",
  OTHER_INCOME = "OTHER_INCOME",

  // Expense Categories
  STAFF_SALARIES = "STAFF_SALARIES",
  UTILITIES = "UTILITIES",
  MAINTENANCE = "MAINTENANCE",
  SUPPLIES = "SUPPLIES",
  FOOD_BEVERAGE_COST = "FOOD_BEVERAGE_COST",
  MARKETING = "MARKETING",
  INSURANCE = "INSURANCE",
  TAXES = "TAXES",
  RENT_MORTGAGE = "RENT_MORTGAGE",
  EQUIPMENT = "EQUIPMENT",
  PROFESSIONAL_SERVICES = "PROFESSIONAL_SERVICES",
  CLEANING_SUPPLIES = "CLEANING_SUPPLIES",
  LINENS_TOWELS = "LINENS_TOWELS",
  AMENITIES = "AMENITIES",
  TECHNOLOGY = "TECHNOLOGY",
  TRAINING = "TRAINING",
  TRAVEL = "TRAVEL",
  OFFICE_SUPPLIES = "OFFICE_SUPPLIES",
  OTHER_EXPENSES = "OTHER_EXPENSES",
}

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHECK = "CHECK",
  DIGITAL_WALLET = "DIGITAL_WALLET",
  MOBILE_PAYMENT = "MOBILE_PAYMENT",
  CRYPTOCURRENCY = "CRYPTOCURRENCY",
  GIFT_CARD = "GIFT_CARD",
  LOYALTY_POINTS = "LOYALTY_POINTS",
  OTHER = "OTHER",
}

export interface CashFlowQuery {
  type?: CashFlowType;
  category?: CashFlowCategory;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  referenceId?: string;
  referenceType?: string;
  search?: string;
  skip?: number;
  take?: number;
  order?: "asc" | "desc";
  sortBy?: string;
}

export interface CashFlowSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  period: string;
}

export interface CashFlowByCategory {
  category: string;
  type: CashFlowType;
  total: number;
  count: number;
}

export interface CashFlowByPeriod {
  period: string;
  income: number;
  expenses: number;
  netFlow: number;
  date: string;
}

export interface CashFlowStatistics {
  summary: CashFlowSummary;
  byCategory: CashFlowByCategory[];
  byPeriod: CashFlowByPeriod[];
  trends: {
    incomeGrowth: number;
    expenseGrowth: number;
    netFlowTrend: number;
  };
}

export interface CreateCashFlowEntryDto {
  type: CashFlowType;
  category: CashFlowCategory;
  amount: number;
  currency?: string;
  paymentMethod?: PaymentMethod;
  description: string;
  referenceId?: string;
  referenceType?: string;
  transactionDate: string;
  recordedBy?: number;
  notes?: string;
}

export const cashFlowApi = {
  // Note: Cash flow endpoints are not implemented in the backend yet
  // These methods return empty/mock data until the backend is implemented

  // Get all cash flow entries with filtering
  getAll: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _query: CashFlowQuery = {},
  ): Promise<{ data: CashFlowEntry[]; total: number }> => {
    // Backend doesn't have cash-flow endpoints yet
    console.warn("Cash flow API not implemented in backend");
    return { data: [], total: 0 };
  },

  // Create cash flow entry
  create: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _data: CreateCashFlowEntryDto,
  ): Promise<CashFlowEntry> => {
    throw new Error("Cash flow API not implemented in backend");
  },

  // Get cash flow entry by ID
  getById: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: number,
  ): Promise<CashFlowEntry> => {
    throw new Error("Cash flow API not implemented in backend");
  },

  // Update cash flow entry
  update: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _data: Partial<CreateCashFlowEntryDto>,
  ): Promise<CashFlowEntry> => {
    throw new Error("Cash flow API not implemented in backend");
  },

  // Delete cash flow entry
  delete: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: number,
  ): Promise<{ message: string }> => {
    throw new Error("Cash flow API not implemented in backend");
  },

  // Get cash flow summary
  getSummary: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _startDate: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _endDate: string,
  ): Promise<CashFlowSummary> => {
    // Backend doesn't have cash-flow endpoints yet
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netCashFlow: 0,
      period: "",
    };
  },

  // Get cash flow by category
  getByCategory: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _startDate: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _endDate: string,
  ): Promise<CashFlowByCategory[]> => {
    // Backend doesn't have cash-flow endpoints yet
    return [];
  },

  // Get cash flow by period
  getByPeriod: async (
    _startDate: string,
    _endDate: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _period: "daily" | "weekly" | "monthly" = "daily",
  ): Promise<CashFlowByPeriod[]> => {
    // Backend doesn't have cash-flow endpoints yet
    return [];
  },

  // Get cash flow statistics
  getStatistics: async (
    _startDate: string,
    _endDate: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _period: "daily" | "weekly" | "monthly" = "daily",
  ): Promise<CashFlowStatistics> => {
    // Backend doesn't have cash-flow endpoints yet
    return {
      summary: {
        totalIncome: 0,
        totalExpenses: 0,
        netCashFlow: 0,
        period: "",
      },
      byCategory: [],
      byPeriod: [],
      trends: {
        incomeGrowth: 0,
        expenseGrowth: 0,
        netFlowTrend: 0,
      },
    };
  },
};
