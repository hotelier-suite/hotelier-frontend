import { apiRequest } from "@/lib/api/base";
import {
  AuditLog,
  AuditLogQuery,
  AuditResource,
  AuditStatistics,
  AuditLogResponse,
} from "./types";

export const auditService = {
  // Get all audit logs with filtering
  getAll: (query: AuditLogQuery = {}): Promise<AuditLogResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    return apiRequest(`/audit${queryString ? `?${queryString}` : ""}`);
  },

  // Get audit log by ID
  getById: (id: number): Promise<AuditLog> => apiRequest(`/audit/${id}`),

  // Get audit logs by resource
  getByResource: (
    resource: AuditResource,
    resourceId: string,
  ): Promise<AuditLogResponse> =>
    apiRequest(`/audit?resource=${resource}&resourceId=${resourceId}`),

  // Get audit logs by user
  getByUser: (userId: number, limit: number = 100): Promise<AuditLogResponse> =>
    apiRequest(`/audit?userId=${userId}&take=${limit}`),

  // Get audit statistics
  getStatistics: (days: number = 30): Promise<AuditStatistics> =>
    apiRequest(`/audit/statistics?days=${days}`),
};
