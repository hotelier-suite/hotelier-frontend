import { apiRequest, getAPIBaseURL } from "@/lib/api/base";
import { authCookies } from "@/lib/auth-cookies";
import {
  AnalyticsData,
  FindAnalyticsFilter,
  OccupancyReport,
  OperationalReport,
  CustomerReport,
  FinancialSummary,
  ReportingDashboard,
  BackendOccupancyReport,
  BackendOperationalReport,
  BackendCustomerReport,
  OccupancyByMonth,
  MonthlyRevenueComparison,
} from "./types";

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

export const reportsService = {
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
      const reports = await reportsService.getOccupancyReports();
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
    const reports = await reportsService.getOperationalReports();
    return reports.filter((r) => r.date === date);
  },

  getOperationalReportsByDepartment: async (
    department: string,
  ): Promise<OperationalReport[]> => {
    const reports = await reportsService.getOperationalReports();
    return reports.filter((r) => r.department === department);
  },

  getOperationalReportsByDateRange: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: [string, string, string?]
  ): Promise<OperationalReport[]> => {
    try {
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
    const reports = await reportsService.getCustomerReports();
    return reports.filter((r) => r.date === date);
  },

  getCustomerReportsBySegment: async (
    segment: string,
  ): Promise<CustomerReport[]> => {
    const reports = await reportsService.getCustomerReports();
    return reports.filter((r) => r.segment === segment);
  },

  getCustomerReportsByDateRange: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: [string, string, string?]
  ): Promise<CustomerReport[]> => {
    try {
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
    return {
      occupancy: [],
      operational: [],
      customer: [],
      financial: {
        revenue: { room: 0, restaurant: 0, services: 0, events: 0, total: 0 },
        expenses: 0,
        grossProfit: 0,
        profitMargin: 0,
      },
    };
  },

  getLastSevenDaysReports: async () => {
    const startDate = "2024-01-13";
    const endDate = "2024-01-19";

    const [occupancy, operational, customer] = await Promise.all([
      reportsService.getOccupancyReportsByDateRange(startDate, endDate),
      reportsService.getOperationalReportsByDateRange(startDate, endDate),
      reportsService.getCustomerReportsByDateRange(startDate, endDate),
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
  ): Promise<OccupancyByMonth[]> => {
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
  ): Promise<MonthlyRevenueComparison[]> => {
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

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      throw error;
    }
  },
};
