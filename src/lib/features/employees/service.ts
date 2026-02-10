import { apiRequest, createApiEndpoints } from "@/lib/api/base";
import { Employee, DepartmentStats, EmployeesFilter } from "./types";

// Create base CRUD operations
const baseApi = createApiEndpoints<Employee>("/employees");

export const employeesService = {
  // Base CRUD operations
  ...baseApi,

  // Override getAll to support department filter
  getAll: (filters?: EmployeesFilter): Promise<Employee[]> => {
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
    employeesService.getAll({ department }),

  getDepartmentStats: (): Promise<DepartmentStats[]> =>
    apiRequest("/employees/stats/departments"),
};
