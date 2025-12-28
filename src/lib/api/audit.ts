import { apiRequest } from "./base";
import { BaseEntity } from "../types";

export interface AuditLog extends BaseEntity {
  userId: number;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  description: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export enum AuditAction {
  // CRUD Operations
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",

  // Authentication Actions
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  LOGIN_FAILED = "LOGIN_FAILED",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  PASSWORD_RESET = "PASSWORD_RESET",

  // Reservation Actions
  CHECK_IN = "CHECK_IN",
  CHECK_OUT = "CHECK_OUT",
  CANCEL_RESERVATION = "CANCEL_RESERVATION",
  MODIFY_RESERVATION = "MODIFY_RESERVATION",

  // Payment Actions
  PAYMENT_PROCESSED = "PAYMENT_PROCESSED",
  REFUND_ISSUED = "REFUND_ISSUED",
  INVOICE_GENERATED = "INVOICE_GENERATED",

  // Status Changes
  STATUS_CHANGE = "STATUS_CHANGE",
  APPROVAL = "APPROVAL",
  REJECTION = "REJECTION",

  // System Actions
  SYSTEM_CONFIG_CHANGE = "SYSTEM_CONFIG_CHANGE",
  PERMISSION_GRANTED = "PERMISSION_GRANTED",
  PERMISSION_REVOKED = "PERMISSION_REVOKED",
  ROLE_ASSIGNED = "ROLE_ASSIGNED",
  ROLE_REMOVED = "ROLE_REMOVED",

  // File Operations
  FILE_UPLOAD = "FILE_UPLOAD",
  FILE_DOWNLOAD = "FILE_DOWNLOAD",
  FILE_DELETE = "FILE_DELETE",

  // Report Generation
  REPORT_GENERATED = "REPORT_GENERATED",
  EXPORT = "EXPORT",

  // Custom Actions
  CUSTOM = "CUSTOM",
}

export enum AuditResource {
  // Core Resources
  USER = "USER",
  ROLE = "ROLE",
  PERMISSION = "PERMISSION",

  // Hotel Resources
  RESERVATION = "RESERVATION",
  ROOM = "ROOM",
  GUEST = "GUEST",

  // Financial Resources
  INVOICE = "INVOICE",
  PAYMENT = "PAYMENT",
  BILLING = "BILLING",

  // Operational Resources
  EMPLOYEE = "EMPLOYEE",
  SHIFT = "SHIFT",
  ATTENDANCE = "ATTENDANCE",
  HOUSEKEEPING = "HOUSEKEEPING",
  MAINTENANCE = "MAINTENANCE",

  // Service Resources
  RESTAURANT = "RESTAURANT",
  MENU_ITEM = "MENU_ITEM",
  ROOM_SERVICE = "ROOM_SERVICE",
  EVENT = "EVENT",
  VENUE = "VENUE",
  RECREATIONAL = "RECREATIONAL",

  // Inventory Resources
  INVENTORY = "INVENTORY",
  SUPPLIER = "SUPPLIER",
  PARKING = "PARKING",

  // Request Resources
  GUEST_REQUEST = "GUEST_REQUEST",
  EMPLOYEE_REQUEST = "EMPLOYEE_REQUEST",

  // Report Resources
  REPORT = "REPORT",
  ANALYTICS = "ANALYTICS",

  // System Resources
  CONFIGURATION = "CONFIGURATION",
  NOTIFICATION = "NOTIFICATION",
  AUDIT_LOG = "AUDIT_LOG",

  // Generic
  SYSTEM = "SYSTEM",
  OTHER = "OTHER",
}

export interface AuditLogQuery {
  userId?: number;
  action?: AuditAction;
  resource?: AuditResource;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  skip?: number;
  take?: number;
  order?: "asc" | "desc";
}

export interface AuditStatistics {
  period: string;
  totalLogs: number;
  actionStats: Array<{ action: string; count: number }>;
  resourceStats: Array<{ resource: string; count: number }>;
  userStats: Array<{ userId: number; userName: string; count: number }>;
  dailyActivity: Array<{ date: string; count: number }>;
}

export const auditApi = {
  // Get all audit logs with filtering
  getAll: (
    query: AuditLogQuery = {},
  ): Promise<{ data: AuditLog[]; total: number }> => {
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

  // Get audit logs by resource (uses consolidated findAll endpoint)
  getByResource: (
    resource: AuditResource,
    resourceId: string,
  ): Promise<{ data: AuditLog[]; total: number }> =>
    apiRequest(`/audit?resource=${resource}&resourceId=${resourceId}`),

  // Get audit logs by user (uses consolidated findAll endpoint)
  getByUser: (
    userId: number,
    limit: number = 100,
  ): Promise<{ data: AuditLog[]; total: number }> =>
    apiRequest(`/audit?userId=${userId}&take=${limit}`),

  // Get audit statistics
  getStatistics: (days: number = 30): Promise<AuditStatistics> =>
    apiRequest(`/audit/statistics?days=${days}`),
};
