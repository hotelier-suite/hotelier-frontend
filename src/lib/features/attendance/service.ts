import { apiRequest, createApiEndpoints } from "@/lib/api/base";
import { Attendance } from "./types";

const baseApi = createApiEndpoints<Attendance>("/attendance");

export const attendanceService = {
  ...baseApi,

  getByEmployee: (employeeId: number): Promise<Attendance[]> =>
    apiRequest(`/attendance?employeeId=${employeeId}`),

  getByDate: (date: string): Promise<Attendance[]> =>
    apiRequest(`/attendance?date=${date}`),

  getByDateRange: (startDate: string, endDate: string): Promise<Attendance[]> =>
    apiRequest(`/attendance?startDate=${startDate}&endDate=${endDate}`),

  getByStatus: (status: string): Promise<Attendance[]> =>
    apiRequest(`/attendance?status=${status}`),

  clockIn: (
    employeeId: number,
    date: string,
    checkIn: string,
    notes?: string,
  ): Promise<Attendance> =>
    apiRequest("/attendance", {
      method: "POST",
      body: JSON.stringify({ employeeId, date, checkIn, notes }),
    }),

  clockOut: (id: number, checkOut: string): Promise<Attendance> =>
    apiRequest(`/attendance/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ checkOut }),
    }),
};
