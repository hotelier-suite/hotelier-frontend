import { apiRequest, createApiEndpoints } from "./base";
import { BaseEntity } from "../types";

// Employee types
export type Department =
  | "FRONT_DESK"
  | "HOUSEKEEPING"
  | "MAINTENANCE"
  | "RESTAURANT"
  | "MANAGEMENT"
  | "SECURITY"
  | "VALET";

export interface Employee extends BaseEntity {
  employeeId: string;
  name: string;
  department: Department;
  position: string;
  shift?: string;
  assignedRooms?: number;
  completedRooms?: number;
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  currentLocation?: string;
}

export interface HousekeepingEmployee extends Employee {
  assignedRooms: number;
  completedRooms: number;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  currentLocation?: string;
}

export interface DepartmentStats {
  department: Department;
  activeCount: number;
  totalCount: number;
}

// Create base CRUD operations
const baseApi = createApiEndpoints<Employee>("/employees");

// Extended employees API
export const employeesApi = {
  // Base CRUD operations
  ...baseApi,

  // Override getAll to support department filter
  getAll: (filters?: { department?: string }): Promise<Employee[]> => {
    const params = new URLSearchParams();
    if (filters?.department) {
      params.append("department", filters.department);
    }
    const queryString = params.toString();
    const url = queryString ? `/employees?${queryString}` : "/employees";
    return apiRequest(url);
  },

  // Specialized endpoints - now using query params
  getByDepartment: (department: string): Promise<Employee[]> =>
    employeesApi.getAll({ department }),
  getDepartmentStats: (): Promise<DepartmentStats[]> =>
    apiRequest("/employees/stats/departments"),
};
