import { BaseEntity } from "../shared/types";

// Employee types
export type Department =
  | "FRONT_DESK"
  | "HOUSEKEEPING"
  | "MAINTENANCE"
  | "RESTAURANT"
  | "MANAGEMENT"
  | "SECURITY"
  | "VALET";

export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export interface Employee extends BaseEntity {
  employeeId: string;
  name: string;
  department: Department;
  position: string;
  shift?: string;
  assignedRooms?: number;
  completedRooms?: number;
  status?: EmployeeStatus;
  currentLocation?: string;
}

export interface HousekeepingEmployee extends Employee {
  assignedRooms: number;
  completedRooms: number;
  status: EmployeeStatus;
  currentLocation?: string;
}

export interface DepartmentStats {
  department: Department;
  activeCount: number;
  totalCount: number;
}

export interface EmployeesFilter {
  department?: string;
}
