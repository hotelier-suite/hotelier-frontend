import { apiRequest } from "@/lib/api/base";
import { DashboardStats, DashboardActivity, DashboardRevenue } from "./types";

export const dashboardService = {
  // Get dashboard statistics
  getStats: (): Promise<DashboardStats> => apiRequest("/dashboard/stats"),

  // Get recent activity
  getActivity: (): Promise<DashboardActivity[]> =>
    apiRequest("/dashboard/activity"),

  // Get revenue information
  getRevenue: (): Promise<DashboardRevenue> => apiRequest("/dashboard/revenue"),
};
