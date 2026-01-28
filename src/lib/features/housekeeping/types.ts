// Housekeeping Maintenance types
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
export interface BackendMaintenanceReport {
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

export interface BackendCleaningAssignment {
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

export interface CreateIncidentReportData {
  roomNumber: string;
  type: string;
  priority: string;
  description: string;
  reportedBy?: string;
}

export interface MaintenanceCostsResult {
  totalCost: number;
  reports: number;
}
