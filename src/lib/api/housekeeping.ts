import { apiRequest } from "./base";

// Maintenance types
export interface MaintenanceReport {
  id: number;
  reportNumber?: string;
  room?: string;
  roomNumber?: string;
  type: string;
  issueType?: string;
  description: string;
  priority: string;
  severity?: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  reportedBy: string;
  assignedTo?: string;
  assignedTechnician?: string;
  estimatedCompletionTime?: string;
  estimatedTime?: string;
  startedAt?: string;
  completedAt?: string;
  actualCompletionTime?: string;
  cost?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Backend types (matching Prisma models)
interface BackendMaintenanceReport {
  id: number;
  reportNumber: string;
  roomId?: number;
  type:
  | "ELECTRICAL"
  | "PLUMBING"
  | "HVAC"
  | "FURNITURE"
  | "APPLIANCES"
  | "STRUCTURAL"
  | "COSMETIC";
  description: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  reportedBy: string;
  assignedTechnician?: string;
  estimatedTime?: string;
  startedAt?: string;
  completedAt?: string;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  room?: {
    id: number;
    number: string;
  };
}

interface BackendCleaningAssignment {
  id: number;
  employeeId?: number;
  roomId: number;
  assignedDate: string;
  startedAt?: string;
  completedAt?: string;
  status:
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "INSPECTED"
  | "NEEDS_MAINTENANCE";
  notes?: string;
  qualityScore?: number;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: number;
    name: string;
    department: string;
  };
  room?: {
    id: number;
    number: string;
  };
}

interface BackendHousekeepingStatistics {
  maintenance: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
  cleaning: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
}

// Frontend types - removed duplicate MaintenanceReport interface

export interface CleaningAssignment {
  id: string;
  employeeName: string;
  roomNumber: string;
  assignedDate: string;
  startedAt?: string;
  completedAt?: string;
  status: string;
  notes?: string;
  qualityScore?: number;
}

export interface HousekeepingStatistics {
  maintenance: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
  cleaning: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
}

export interface Room {
  id: number;
  number: string;
  type: string;
}

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

export const housekeepingApi = {
  // Maintenance Reports
  getMaintenanceReports: async (): Promise<MaintenanceReport[]> => {
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports",
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
  },

  getPendingMaintenanceReports: async (): Promise<MaintenanceReport[]> => {
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports/pending",
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
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
      `/housekeeping/maintenance-reports/by-status?status=${backendStatus}`,
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
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
      `/housekeeping/maintenance-reports/by-priority?priority=${backendPriority}`,
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
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
      `/housekeeping/maintenance-reports/by-type?type=${backendType}`,
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
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
      `/housekeeping/maintenance-reports/${id}/start`,
      {
        method: "PUT",
        body: JSON.stringify({ assignedTechnician }),
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
      `/housekeeping/maintenance-reports/${id}/complete`,
      {
        method: "PUT",
        body: JSON.stringify({ cost, notes }),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },

  // Cleaning Assignments
  getCleaningAssignments: async (): Promise<CleaningAssignment[]> => {
    const backendAssignments = (await apiRequest(
      "/housekeeping/cleaning-assignments",
    )) as BackendCleaningAssignment[];
    return backendAssignments.map(transformCleaningAssignment);
  },

  getTodaysCleaningAssignments: async (): Promise<CleaningAssignment[]> => {
    const backendAssignments = (await apiRequest(
      "/housekeeping/cleaning-assignments/today",
    )) as BackendCleaningAssignment[];
    return backendAssignments.map(transformCleaningAssignment);
  },

  getCleaningAssignmentsByStatus: async (
    status: string,
  ): Promise<CleaningAssignment[]> => {
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      in_progress: "IN_PROGRESS",
      completed: "COMPLETED",
      inspected: "INSPECTED",
      needs_maintenance: "NEEDS_MAINTENANCE",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const backendAssignments = (await apiRequest(
      `/housekeeping/cleaning-assignments/by-status?status=${backendStatus}`,
    )) as BackendCleaningAssignment[];
    return backendAssignments.map(transformCleaningAssignment);
  },

  startCleaningWork: async (id: string): Promise<CleaningAssignment> => {
    const backendAssignment = (await apiRequest(
      `/housekeeping/cleaning-assignments/${id}/start`,
      {
        method: "PUT",
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
      `/housekeeping/cleaning-assignments/${id}/complete`,
      {
        method: "PUT",
        body: JSON.stringify({ qualityScore, notes }),
      },
    )) as BackendCleaningAssignment;

    return transformCleaningAssignment(backendAssignment);
  },

  // Statistics
  getStatistics: async (): Promise<HousekeepingStatistics> => {
    return (await apiRequest(
      "/housekeeping/statistics",
    )) as BackendHousekeepingStatistics;
  },

  getMaintenanceCosts: async (startDate: string, endDate: string) => {
    return await apiRequest(
      `/housekeeping/maintenance-costs?startDate=${startDate}&endDate=${endDate}`,
    );
  },

  getCleaningPerformance: async (employeeId?: string) => {
    const url = employeeId
      ? `/housekeeping/cleaning-performance?employeeId=${employeeId}`
      : "/housekeeping/cleaning-performance";
    return await apiRequest(url);
  },

  getRoomsForIncidentReports: async (): Promise<Room[]> => {
    return (await apiRequest(
      "/housekeeping/rooms/for-incident-reports",
    )) as Room[];
  },

  createIncidentReport: async (incidentData: {
    roomNumber: string;
    type: string;
    priority: string;
    description: string;
    reportedBy?: string;
  }): Promise<MaintenanceReport> => {
    // Map frontend types to backend enums
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
      roomNumber: incidentData.roomNumber,
      type: typeMap[incidentData.type] || "GENERAL",
      priority: priorityMap[incidentData.priority] || "NORMAL",
      description: incidentData.description,
      reportedBy: incidentData.reportedBy || "Housekeeping Staff",
    };

    const backendReport = (await apiRequest("/housekeeping/incident-reports", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },
};
