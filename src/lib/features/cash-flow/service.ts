import {
  CashFlowEntry,
  CashFlowQuery,
  CashFlowSummary,
  CashFlowByCategory,
  CashFlowByPeriod,
  CashFlowStatistics,
  CreateCashFlowEntryDto,
} from "./types";

export const cashFlowService = {
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
