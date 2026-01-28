import { apiRequest } from "@/lib/api/base";
import {
  EventBooking,
  EventBookingsFilterParams,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from "./types";

export const eventsService = {
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

  create: (data: CreateEventBookingDto): Promise<EventBooking> =>
    apiRequest("/event-bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateEventBookingDto): Promise<EventBooking> =>
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
    eventsService.getAll({ isUpcoming: true }),
};
