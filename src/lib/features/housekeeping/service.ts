import { apiRequest } from "@/lib/api/base";
import {
  MaintenanceReport,
  CleaningAssignment,
  HousekeepingStatistics,
  Room,
  BackendMaintenanceReport,
  BackendCleaningAssignment,
  CreateIncidentReportData,
  MaintenanceCostsResult,
} from "./types";

// Transform functions
function transformMaintenanceReport(
  backendReport: BackendMaintenanceReport,
): MaintenanceReport {
  return {
    id: backendReport.id,
    reportNumber: backendReport.reportNumber,
    room: backendReport.room?.number,
    type: getMaintenanceTypeLabel(backendReport.type),
    description: backendReport.description,
    priority: getPriorityLabel(backendReport.priority),
    status: getMaintenanceStatusLabel(backendReport.status),
    reportedBy: backendReport.reportedBy,
    assignedTechnician: backendReport.assignedTechnician,
    estimatedTime: backendReport.estimatedTime,
    startedAt: backendReport.startedAt
      ? backendReport.startedAt.split("T")[0]
      : undefined,
    completedAt: backendReport.completedAt
      ? backendReport.completedAt.split("T")[0]
      : undefined,
    cost: backendReport.cost,
    notes: backendReport.notes,
  };
}

function transformCleaningAssignment(
  backendAssignment: BackendCleaningAssignment,
): CleaningAssignment {
  return {
    id: backendAssignment.id.toString(),
    employeeName: backendAssignment.employee?.name || "Not assigned",
    roomNumber: backendAssignment.room?.number || "N/A",
    assignedDate: backendAssignment.assignedDate.split("T")[0],
    startedAt: backendAssignment.startedAt
      ? backendAssignment.startedAt.split("T")[0]
      : undefined,
    completedAt: backendAssignment.completedAt
      ? backendAssignment.completedAt.split("T")[0]
      : undefined,
    status: getCleaningStatusLabel(backendAssignment.status),
    notes: backendAssignment.notes,
    qualityScore: backendAssignment.qualityScore,
  };
}

// Label helper functions
function getMaintenanceTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    ELECTRICAL: "Electrical",
    PLUMBING: "Plumbing",
    HVAC: "HVAC",
    FURNITURE: "Furniture",
    APPLIANCES: "Appliances",
    STRUCTURAL: "Structural",
    COSMETIC: "Cosmetic",
  };
  return typeMap[type] || type;
}

function getPriorityLabel(priority: string): string {
  const priorityMap: Record<string, string> = {
    LOW: "low",
    NORMAL: "medium",
    HIGH: "high",
    URGENT: "urgent",
  };
  return priorityMap[priority] || priority.toLowerCase();
}

function getMaintenanceStatusLabel(
  status: string,
): "pending" | "in_progress" | "completed" | "cancelled" {
  const statusMap: Record<
    string,
    "pending" | "in_progress" | "completed" | "cancelled"
  > = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };
  return statusMap[status] || "pending";
}

function getCleaningStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    INSPECTED: "inspected",
    NEEDS_MAINTENANCE: "needs_maintenance",
  };
  return statusMap[status] || status.toLowerCase();
}

export const housekeepingService = {
  // Maintenance Reports
  getMaintenanceReports: async (): Promise<MaintenanceReport[]> => {
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports",
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
  },

  getPendingMaintenanceReports: async (): Promise<MaintenanceReport[]> => {
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports",
    )) as BackendMaintenanceReport[];
    const pendingReports = backendReports.filter((r) => r.status === "PENDING");
    return pendingReports.map(transformMaintenanceReport);
  },

  getMaintenanceReportsByStatus: async (
    status: string,
  ): Promise<MaintenanceReport[]> => {
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      in_progress: "IN_PROGRESS",
      completed: "COMPLETED",
      cancelled: "CANCELLED",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports",
    )) as BackendMaintenanceReport[];
    const filteredReports = backendReports.filter(
      (r) => r.status === backendStatus,
    );
    return filteredReports.map(transformMaintenanceReport);
  },

  getMaintenanceReportsByPriority: async (
    priority: string,
  ): Promise<MaintenanceReport[]> => {
    const priorityMap: Record<string, string> = {
      low: "LOW",
      medium: "NORMAL",
      high: "HIGH",
      urgent: "URGENT",
    };
    const backendPriority = priorityMap[priority] || priority.toUpperCase();
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports",
    )) as BackendMaintenanceReport[];
    const filteredReports = backendReports.filter(
      (r) => r.priority === backendPriority,
    );
    return filteredReports.map(transformMaintenanceReport);
  },

  getMaintenanceReportsByType: async (
    type: string,
  ): Promise<MaintenanceReport[]> => {
    const typeMap: Record<string, string> = {
      Electrical: "ELECTRICAL",
      Plumbing: "PLUMBING",
      HVAC: "HVAC",
      Furniture: "FURNITURE",
      Appliances: "APPLIANCES",
      Structural: "STRUCTURAL",
      Cosmetic: "COSMETIC",
    };
    const backendType = typeMap[type] || type.toUpperCase();
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports",
    )) as BackendMaintenanceReport[];
    const filteredReports = backendReports.filter(
      (r) => r.type === backendType,
    );
    return filteredReports.map(transformMaintenanceReport);
  },

  createMaintenanceReport: async (
    reportData: Partial<MaintenanceReport>,
  ): Promise<MaintenanceReport> => {
    const backendData = {
      reportNumber: reportData.reportNumber || `MNT${Date.now()}`,
      type: "GENERAL",
      description: reportData.description,
      priority: "NORMAL",
      reportedBy: reportData.reportedBy || "System",
      assignedTechnician: reportData.assignedTechnician,
      estimatedTime: reportData.estimatedTime,
    };

    const backendReport = (await apiRequest(
      "/housekeeping/maintenance-reports",
      {
        method: "POST",
        body: JSON.stringify(backendData),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },

  startMaintenanceWork: async (
    id: string,
    assignedTechnician?: string,
  ): Promise<MaintenanceReport> => {
    const backendReport = (await apiRequest(
      `/housekeeping/maintenance-reports/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: "IN_PROGRESS",
          assignedTechnician,
          startedAt: new Date().toISOString(),
        }),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },

  completeMaintenanceWork: async (
    id: string,
    cost?: number,
    notes?: string,
  ): Promise<MaintenanceReport> => {
    const backendReport = (await apiRequest(
      `/housekeeping/maintenance-reports/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: "COMPLETED",
          completedAt: new Date().toISOString(),
          cost,
          notes,
        }),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },

  // Cleaning Assignments
  getCleaningAssignments: async (): Promise<CleaningAssignment[]> => {
    const backendAssignments = (await apiRequest(
      "/housekeeping/assignments",
    )) as BackendCleaningAssignment[];
    return backendAssignments.map(transformCleaningAssignment);
  },

  getTodaysCleaningAssignments: async (): Promise<CleaningAssignment[]> => {
    const backendAssignments = (await apiRequest(
      "/housekeeping/assignments",
    )) as BackendCleaningAssignment[];

    const today = new Date().toISOString().split("T")[0];
    const todaysAssignments = backendAssignments.filter(
      (a) => a.assignedDate.split("T")[0] === today,
    );
    return todaysAssignments.map(transformCleaningAssignment);
  },

  getCleaningAssignmentsByStatus: async (
    status: string,
  ): Promise<CleaningAssignment[]> => {
    const backendAssignments = (await apiRequest(
      "/housekeeping/assignments",
    )) as BackendCleaningAssignment[];

    const statusMap: Record<string, string> = {
      pending: "PENDING",
      in_progress: "IN_PROGRESS",
      completed: "COMPLETED",
      inspected: "INSPECTED",
      needs_maintenance: "NEEDS_MAINTENANCE",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const filteredAssignments = backendAssignments.filter(
      (a) => a.status === backendStatus,
    );
    return filteredAssignments.map(transformCleaningAssignment);
  },

  startCleaningWork: async (id: string): Promise<CleaningAssignment> => {
    const backendAssignment = (await apiRequest(
      `/housekeeping/assignments/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: "IN_PROGRESS",
          startedAt: new Date().toISOString(),
        }),
      },
    )) as BackendCleaningAssignment;

    return transformCleaningAssignment(backendAssignment);
  },

  completeCleaningWork: async (
    id: string,
    qualityScore?: number,
    notes?: string,
  ): Promise<CleaningAssignment> => {
    const backendAssignment = (await apiRequest(
      `/housekeeping/assignments/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: "COMPLETED",
          completedAt: new Date().toISOString(),
          qualityScore,
          notes,
        }),
      },
    )) as BackendCleaningAssignment;

    return transformCleaningAssignment(backendAssignment);
  },

  // Statistics
  getStatistics: async (): Promise<HousekeepingStatistics> => {
    return (await apiRequest(
      "/housekeeping/statistics",
    )) as HousekeepingStatistics;
  },

  getMaintenanceCosts: async (
    startDate: string,
    endDate: string,
  ): Promise<MaintenanceCostsResult> => {
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports",
    )) as BackendMaintenanceReport[];

    const filteredReports = backendReports.filter((r) => {
      const reportDate = new Date(r.createdAt).toISOString().split("T")[0];
      return reportDate >= startDate && reportDate <= endDate;
    });

    const totalCost = filteredReports.reduce(
      (sum, r) => sum + (r.cost || 0),
      0,
    );
    return { totalCost, reports: filteredReports.length };
  },

  getCleaningPerformance: async (employeeId?: string) => {
    const url = employeeId
      ? `/housekeeping/cleaning-performance?employeeId=${employeeId}`
      : "/housekeeping/cleaning-performance";
    return await apiRequest(url);
  },

  getRoomsForIncidentReports: async (): Promise<Room[]> => {
    try {
      const rooms = (await apiRequest("/rooms")) as Room[];
      return rooms;
    } catch {
      return [];
    }
  },

  createIncidentReport: async (
    incidentData: CreateIncidentReportData,
  ): Promise<MaintenanceReport> => {
    const typeMap: Record<string, string> = {
      Plumbing: "PLUMBING",
      Electricity: "ELECTRICAL",
      "Air Conditioning": "HVAC",
      Furniture: "FURNITURE",
      Appliances: "APPLIANCES",
      Structural: "STRUCTURAL",
      Cosmetic: "COSMETIC",
      General: "GENERAL",
    };

    const priorityMap: Record<string, string> = {
      low: "LOW",
      medium: "NORMAL",
      high: "HIGH",
      critical: "URGENT",
    };

    const backendData = {
      reportNumber: `INC-${Date.now()}`,
      roomNumber: incidentData.roomNumber,
      type: typeMap[incidentData.type] || "GENERAL",
      priority: priorityMap[incidentData.priority] || "NORMAL",
      description: incidentData.description,
      reportedBy: incidentData.reportedBy || "Housekeeping Staff",
    };

    const backendReport = (await apiRequest(
      "/housekeeping/maintenance-reports",
      {
        method: "POST",
        body: JSON.stringify(backendData),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },
};
