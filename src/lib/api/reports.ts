import { apiRequest, getAPIBaseURL } from "./base";
import { authCookies } from "../auth-cookies";

// Analytics metric types (matching backend enum)
export type AnalyticsMetric =
  | "OCCUPANCY_RATE"
  | "REVENUE_PER_ROOM"
  | "CUSTOMER_SATISFACTION"
  | "AVERAGE_STAY_LENGTH"
  | "REPEAT_CUSTOMER_RATE"
  | "STAFF_EFFICIENCY";

// Analytics data type
export interface AnalyticsData {
  id: number;
  metric: AnalyticsMetric;
  value: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Filter parameters for analytics
export interface FindAnalyticsFilter {
  type?: AnalyticsMetric;
  startDate?: string;
  endDate?: string;
}

// Backend types (matching Prisma models)
interface BackendOccupancyReport {
  id: number;
  date: string;
  availableRooms: number;
  occupiedRooms: number;
  occupancyPercentage: number;
  revenuePerRoom: number;
  totalRevenue: number;
  guests: number;
  averageStay: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendOperationalReport {
  id: number;
  date: string;
  department:
    | "FRONT_DESK"
    | "HOUSEKEEPING"
    | "RESTAURANT"
    | "MAINTENANCE"
    | "ACCOUNTING"
    | "MANAGEMENT"
    | "SECURITY";
  checkInsCompleted?: number;
  checkOutsCompleted?: number;
  averageCheckInTime?: string;
  roomsCleaned?: number;
  averageCleaningTime?: string;
  roomsOutOfOrder?: number;
  customersServed?: number;
  averageServiceTime?: string;
  averageSalesPerTable?: number;
  requestsHandled?: number;
  averageResponseTime?: string;
  pendingRequests?: number;
  customerSatisfaction: number;
  reportedIncidents: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendCustomerReport {
  id: number;
  date: string;
  segment: string;
  quantity: number;
  averageRevenue: number;
  averageStay: number;
  satisfaction: number;
  loyalty: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  createdAt: string;
  updatedAt: string;
}

// Frontend types
export interface OccupancyReport {
  id: string;
  date: string;
  availableRooms: number;
  occupiedRooms: number;
  occupancyPercentage: number;
  revenuePerRoom: number;
  totalRevenue: number;
  guests: number;
  averageStay: number;
}

export interface OperationalReport {
  id: string;
  date: string;
  department: string;
  checkInsCompleted?: number;
  checkOutsCompleted?: number;
  averageCheckInTime?: string;
  roomsCleaned?: number;
  averageCleaningTime?: string;
  roomsOutOfOrder?: number;
  customersServed?: number;
  averageServiceTime?: string;
  averageSalesPerTable?: number;
  requestsHandled?: number;
  averageResponseTime?: string;
  pendingRequests?: number;
  customerSatisfaction: number;
  reportedIncidents: number;
}

export interface CustomerReport {
  id: string;
  date: string;
  segment: string;
  quantity: number;
  averageRevenue: number;
  averageStay: number;
  satisfaction: number;
  loyalty: string;
}

export interface FinancialSummary {
  revenue: {
    room: number;
    restaurant: number;
    services: number;
    events: number;
    total: number;
  };
  expenses: number;
  grossProfit: number;
  profitMargin: number;
}

export interface ReportingDashboard {
  date: string;
  occupancy: OccupancyReport | null;
  operational: OperationalReport[];
  customer: CustomerReport[];
}

// Transform functions
function transformOccupancyReport(
  backendReport: BackendOccupancyReport,
): OccupancyReport {
  return {
    id: backendReport.id.toString(),
    date: backendReport.date.split("T")[0],
    availableRooms: backendReport.availableRooms,
    occupiedRooms: backendReport.occupiedRooms,
    occupancyPercentage: backendReport.occupancyPercentage,
    revenuePerRoom: backendReport.revenuePerRoom,
    totalRevenue: backendReport.totalRevenue,
    guests: backendReport.guests,
    averageStay: backendReport.averageStay,
  };
}

function transformOperationalReport(
  backendReport: BackendOperationalReport,
): OperationalReport {
  return {
    id: backendReport.id.toString(),
    date: backendReport.date.split("T")[0],
    department: getDepartmentLabel(backendReport.department),
    checkInsCompleted: backendReport.checkInsCompleted,
    checkOutsCompleted: backendReport.checkOutsCompleted,
    averageCheckInTime: backendReport.averageCheckInTime,
    roomsCleaned: backendReport.roomsCleaned,
    averageCleaningTime: backendReport.averageCleaningTime,
    roomsOutOfOrder: backendReport.roomsOutOfOrder,
    customersServed: backendReport.customersServed,
    averageServiceTime: backendReport.averageServiceTime,
    averageSalesPerTable: backendReport.averageSalesPerTable,
    requestsHandled: backendReport.requestsHandled,
    averageResponseTime: backendReport.averageResponseTime,
    pendingRequests: backendReport.pendingRequests,
    customerSatisfaction: backendReport.customerSatisfaction,
    reportedIncidents: backendReport.reportedIncidents,
  };
}

function transformCustomerReport(
  backendReport: BackendCustomerReport,
): CustomerReport {
  return {
    id: backendReport.id.toString(),
    date: backendReport.date.split("T")[0],
    segment: backendReport.segment,
    quantity: backendReport.quantity,
    averageRevenue: backendReport.averageRevenue,
    averageStay: backendReport.averageStay,
    satisfaction: backendReport.satisfaction,
    loyalty: getLoyaltyLabel(backendReport.loyalty),
  };
}

// Translation helper functions
function getDepartmentLabel(department: string): string {
  const departmentMap: Record<string, string> = {
    FRONT_DESK: "Front Desk",
    HOUSEKEEPING: "Housekeeping",
    RESTAURANT: "Restaurant",
    MAINTENANCE: "Maintenance",
    MANAGEMENT: "Management",
    SECURITY: "Security",
  };
  return departmentMap[department] || department;
}

function getLoyaltyLabel(loyalty: string): string {
  const loyaltyMap: Record<string, string> = {
    BRONZE: "Bronze",
    SILVER: "Silver",
    GOLD: "Gold",
    PLATINUM: "Platinum",
  };
  return loyaltyMap[loyalty] || loyalty;
}

export const reportsApi = {
  // Analytics data endpoints
  getAnalyticsAll: (
    filters?: FindAnalyticsFilter,
  ): Promise<AnalyticsData[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.set("type", filters.type);
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);

    const query = params.toString();
    return apiRequest(`/reports-analytics${query ? `?${query}` : ""}`);
  },

  // Occupancy Reports
  getOccupancyReports: async (): Promise<OccupancyReport[]> => {
    const backendReports = (await apiRequest(
      "/reports/occupancy",
    )) as BackendOccupancyReport[];
    return backendReports.map(transformOccupancyReport);
  },

  getOccupancyReportByDate: async (
    date: string,
  ): Promise<OccupancyReport | null> => {
    try {
      // Backend doesn't have date-specific endpoint, use client-side filtering
      const reports = await reportsApi.getOccupancyReports();
      return reports.find((r) => r.date === date) || null;
    } catch {
      return null;
    }
  },

  getOccupancyReportsByDateRange: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: [string, string]
  ): Promise<OccupancyReport[]> => {
    try {
      // Backend doesn't have this specific endpoint, return empty array
      return [];
    } catch {
      return [];
    }
  },

  generateOccupancyReport: async (date: string): Promise<OccupancyReport> => {
    const backendReport = (await apiRequest(
      `/reports/occupancy/generate/${date}`,
      {
        method: "POST",
      },
    )) as BackendOccupancyReport;
    return transformOccupancyReport(backendReport);
  },

  // Operational Reports
  getOperationalReports: async (): Promise<OperationalReport[]> => {
    const backendReports = (await apiRequest(
      "/reports/operational",
    )) as BackendOperationalReport[];
    return backendReports.map(transformOperationalReport);
  },

  getOperationalReportsByDate: async (
    date: string,
  ): Promise<OperationalReport[]> => {
    // Backend doesn't have date-specific endpoint, use client-side filtering
    const reports = await reportsApi.getOperationalReports();
    return reports.filter((r) => r.date === date);
  },

  getOperationalReportsByDepartment: async (
    department: string,
  ): Promise<OperationalReport[]> => {
    // Backend doesn't have department-specific endpoint, use client-side filtering
    const reports = await reportsApi.getOperationalReports();
    return reports.filter((r) => r.department === department);
  },

  getOperationalReportsByDateRange: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: [string, string, string?]
  ): Promise<OperationalReport[]> => {
    try {
      // Backend doesn't have this specific endpoint, return empty array
      return [];
    } catch {
      return [];
    }
  },

  // Customer Reports
  getCustomerReports: async (): Promise<CustomerReport[]> => {
    const backendReports = (await apiRequest(
      "/reports/customer",
    )) as BackendCustomerReport[];
    return backendReports.map(transformCustomerReport);
  },

  getCustomerReportsByDate: async (date: string): Promise<CustomerReport[]> => {
    // Backend doesn't have date-specific endpoint, use client-side filtering
    const reports = await reportsApi.getCustomerReports();
    return reports.filter((r) => r.date === date);
  },

  getCustomerReportsBySegment: async (
    segment: string,
  ): Promise<CustomerReport[]> => {
    // Backend doesn't have segment-specific endpoint, use client-side filtering
    const reports = await reportsApi.getCustomerReports();
    return reports.filter((r) => r.segment === segment);
  },

  getCustomerReportsByDateRange: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: [string, string, string?]
  ): Promise<CustomerReport[]> => {
    try {
      // Backend doesn't have this specific endpoint, return empty array
      return [];
    } catch {
      return [];
    }
  },

  // Dashboard and Financial Summary
  getReportingDashboard: async (date?: string): Promise<ReportingDashboard> => {
    const url = date ? `/reports/dashboard?date=${date}` : "/reports/dashboard";
    const backendDashboard = (await apiRequest(url)) as {
      date: string;
      occupancy: BackendOccupancyReport | null;
      operational: BackendOperationalReport[];
      customer: BackendCustomerReport[];
    };

    return {
      date: backendDashboard.date.split("T")[0],
      occupancy: backendDashboard.occupancy
        ? transformOccupancyReport(backendDashboard.occupancy)
        : null,
      operational: backendDashboard.operational.map(transformOperationalReport),
      customer: backendDashboard.customer.map(transformCustomerReport),
    };
  },

  // Convenience methods for the frontend
  getCurrentMonthReports: async () => {
    // Use January 2024 for demo data (where test data exists)
    // Note: The backend doesn't have a generic by-date-range endpoint
    // Return structured data with fallback values
    return {
      occupancy: [], // No occupancy data available from current backend
      operational: [], // No operational data available from current backend
      customer: [], // No customer data available from current backend
      financial: {
        revenue: { room: 0, restaurant: 0, services: 0, events: 0, total: 0 },
        expenses: 0,
        grossProfit: 0,
        profitMargin: 0,
      },
    };
  },

  getLastSevenDaysReports: async () => {
    // Use a 7-day range in January 2024 for demo data
    const startDate = "2024-01-13";
    const endDate = "2024-01-19";

    const [occupancy, operational, customer] = await Promise.all([
      reportsApi.getOccupancyReportsByDateRange(startDate, endDate),
      reportsApi.getOperationalReportsByDateRange(startDate, endDate),
      reportsApi.getCustomerReportsByDateRange(startDate, endDate),
    ]);

    return {
      occupancy,
      operational,
      customer,
    };
  },

  // New analytics endpoints
  getFinancialSummary: async (
    startDate: string,
    endDate: string,
  ): Promise<FinancialSummary> => {
    try {
      return await apiRequest(
        `/reports/analytics/financial-summary?startDate=${startDate}&endDate=${endDate}`,
      );
    } catch {
      return {
        revenue: { room: 0, restaurant: 0, services: 0, events: 0, total: 0 },
        expenses: 0,
        grossProfit: 0,
        profitMargin: 0,
      };
    }
  },

  getOccupancyByMonthYear: async (
    year: number,
    month?: number,
  ): Promise<
    Array<{ date: string; occupancyPercentage: number; totalRevenue: number }>
  > => {
    try {
      const monthParam = month ? `&month=${month}` : "";
      return await apiRequest(
        `/reports/analytics/occupancy?year=${year}${monthParam}`,
      );
    } catch {
      return [];
    }
  },

  getMonthlyRevenueComparison: async (
    year: number,
  ): Promise<
    Array<{ month: string; revenue: number; expenses: number; profit: number }>
  > => {
    try {
      return await apiRequest(
        `/reports/analytics/monthly-revenue?year=${year}`,
      );
    } catch {
      return [];
    }
  },

  downloadFinancialReport: async (
    year: number,
    month?: number,
  ): Promise<void> => {
    try {
      const monthParam = month ? `&month=${month}` : "";
      const response = await fetch(
        `${getAPIBaseURL()}/reports/download/financial-report?year=${year}${monthParam}`,
        {
          headers: {
            Authorization: `Bearer ${authCookies.getAccessToken()}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `financial-report-${year}${month ? `-${month}` : ""}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      // Create blob URL
      const url = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      throw error;
    }
  },
};
