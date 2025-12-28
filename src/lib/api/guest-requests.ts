import { apiRequest, createApiEndpoints } from "./base";
import { BaseEntity } from "../types";

// Guest Request types
export interface GuestRequest extends BaseEntity {
  room: string;
  guestName: string;
  type:
    | "TOWELS"
    | "ROOM_SERVICE"
    | "MAINTENANCE"
    | "HOUSEKEEPING"
    | "CONCIERGE"
    | "TECHNICAL_SUPPORT"
    | "OTHER";
  description: string;
  time: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  assignedTo?: number;
  notes?: string;
}

// Create base CRUD operations
const baseApi = createApiEndpoints<GuestRequest>("/guest-requests");

// Extended guest requests API
export const guestRequestsApi = {
  // Base CRUD operations
  ...baseApi,

  // Specialized endpoints (using consolidated query parameters)
  getByStatus: (status: string): Promise<GuestRequest[]> =>
    apiRequest(`/guest-requests?status=${status}`),
  getByPriority: (priority: string): Promise<GuestRequest[]> =>
    apiRequest(`/guest-requests?priority=${priority}`),
  markCompleted: (id: number): Promise<GuestRequest> =>
    apiRequest(`/guest-requests/${id}/complete`, { method: "PATCH" }),
};
