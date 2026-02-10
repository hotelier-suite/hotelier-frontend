import { apiRequest, createApiEndpoints } from "@/lib/api/base";
import { GuestRequest } from "./types";

// Create base CRUD operations
const baseApi = createApiEndpoints<GuestRequest>("/guest-requests");

export const guestRequestsService = {
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
