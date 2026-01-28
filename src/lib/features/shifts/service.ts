import { apiRequest, createApiEndpoints } from "@/lib/api/base";
import { Shift } from "./types";

const baseApi = createApiEndpoints<Shift>("/shifts");

export const shiftsService = {
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
