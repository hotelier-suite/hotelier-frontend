// General maintenance types
export type MaintenanceType =
  | "preventive"
  | "corrective"
  | "emergency"
  | "upgrade"
  | "inspection";

export type MaintenancePriority =
  | "low"
  | "medium"
  | "high"
  | "urgent"
  | "critical";

export type MaintenanceStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "postponed";

export interface GeneralMaintenanceRequest {
  id: number;
  title: string;
  description?: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  location: string;
  equipment?: string;
  scheduledDate?: string;
  scheduledStartTime?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  actualCost?: number;
  assignedTechnicianId?: number;
  assignedTechnician?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  requestedById?: number;
  requestedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  startedAt?: string;
  completedAt?: string;
  workPerformed?: string;
  materialsUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRequestDto {
  title: string;
  description?: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  location: string;
  equipment?: string;
  scheduledDate?: string;
  scheduledStartTime?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  assignedTechnicianId?: number;
  requestedById?: number;
}

export interface UpdateMaintenanceRequestDto extends Partial<CreateMaintenanceRequestDto> {
  status?: MaintenanceStatus;
  actualCost?: number;
  startedAt?: string;
  completedAt?: string;
  workPerformed?: string;
  materialsUsed?: string;
}

export interface MaintenanceStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
    critical: number;
  };
}
