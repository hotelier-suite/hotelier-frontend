import { apiRequest } from "./base";
import { BaseEntity } from "../types";
import { Venue } from "./venues";

// Event types
export type EventStatus =
  | "PLANNED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface EventBooking extends BaseEntity {
  title: string;
  description?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  totalCost: number;
  status: EventStatus;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
  venueId: number;
  venue: Venue;
}

// Filter parameters for event bookings
export interface EventBookingsFilterParams {
  isUpcoming?: boolean;
  status?: EventStatus;
  guestId?: number;
  venueId?: number;
  startDate?: string;
  endDate?: string;
}

// Extended events API
export const eventsApi = {
  // Basic CRUD operations for event bookings with optional filters
  getAll: (filters?: EventBookingsFilterParams): Promise<EventBooking[]> => {
    const params = new URLSearchParams();
    if (filters?.isUpcoming !== undefined) {
      params.set("isUpcoming", String(filters.isUpcoming));
    }
    if (filters?.status) {
      params.set("status", filters.status);
    }
    if (filters?.guestId !== undefined) {
      params.set("guestId", String(filters.guestId));
    }
    if (filters?.venueId !== undefined) {
      params.set("venueId", String(filters.venueId));
    }
    if (filters?.startDate) {
      params.set("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      params.set("endDate", filters.endDate);
    }

    const query = params.toString();
    return apiRequest(`/event-bookings${query ? `?${query}` : ""}`);
  },
  getById: (id: number): Promise<EventBooking> =>
    apiRequest(`/event-bookings/${id}`),
  create: (
    data: Omit<EventBooking, "id" | "createdAt" | "updatedAt" | "venue">,
  ): Promise<EventBooking> =>
    apiRequest("/event-bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: number,
    data: Partial<
      Omit<EventBooking, "id" | "createdAt" | "updatedAt" | "venue">
    >,
  ): Promise<EventBooking> =>
    apiRequest(`/event-bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number): Promise<EventBooking> =>
    apiRequest(`/event-bookings/${id}`, {
      method: "DELETE",
    }),

  // Get upcoming event bookings using getAll with isUpcoming filter
  getUpcoming: (): Promise<EventBooking[]> =>
    eventsApi.getAll({ isUpcoming: true }),
};
