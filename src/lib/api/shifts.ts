import { apiRequest, createApiEndpoints } from "./base";

export interface Shift {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  type: "MORNING" | "AFTERNOON" | "NIGHT" | "DOUBLE";
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  position: string;
  department: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: number;
    name: string;
    role: string;
  };
}

const baseApi = createApiEndpoints<Shift>("/shifts");

export const shiftsApi = {
  ...baseApi,

  getByEmployee: (employeeId: string): Promise<Shift[]> =>
    apiRequest(`/shifts?employeeId=${employeeId}`),

  getByDate: (date: string): Promise<Shift[]> =>
    apiRequest(`/shifts?date=${date}`),

  getByDateRange: (startDate: string, endDate: string): Promise<Shift[]> =>
    apiRequest(`/shifts?startDate=${startDate}&endDate=${endDate}`),

  getByStatus: (status: string): Promise<Shift[]> =>
    apiRequest(`/shifts?status=${status}`),
};
