import { apiRequest, createApiEndpoints } from "@/lib/api/base";
import { Room } from "../rooms/types";
import {
  Reservation,
  FindReservationsFilter,
  ReservationBillingDetails,
  CheckoutResponse,
  CreateReservationDto,
} from "./types";

// Create base CRUD operations
const baseApi = createApiEndpoints<Reservation>("/reservations");

export const reservationsService = {
  // Base CRUD operations (excluding getAll which we override)
  create: baseApi.create,
  update: baseApi.update,
  delete: baseApi.delete,
  getById: baseApi.getById,

  // Override getAll to accept filter parameters
  getAll: (filters?: FindReservationsFilter): Promise<Reservation[]> => {
    const params = new URLSearchParams();
    if (filters?.userId) params.set("userId", String(filters.userId));
    if (filters?.status) params.set("status", filters.status);
    if (filters?.isCurrent) params.set("isCurrent", "true");
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);

    const query = params.toString();
    return apiRequest(`/reservations${query ? `?${query}` : ""}`);
  },

  // Get current guests (uses isCurrent filter)
  getCurrentGuests: (): Promise<Reservation[]> =>
    reservationsService.getAll({ isCurrent: true }),

  // Checkout endpoint (returns DTO)
  checkout: (id: number): Promise<CheckoutResponse> =>
    apiRequest(`/reservations/${id}/checkout`, { method: "PATCH" }),

  // Self-service endpoints - getMine uses userId filter
  getMine: (userId: number): Promise<Reservation[]> =>
    reservationsService.getAll({ userId }),

  createSelf: (data: CreateReservationDto): Promise<Reservation> =>
    apiRequest(`/reservations/self`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Availability lookup
  getAvailability: (
    startDate: string,
    endDate: string,
    opts?: { type?: string; guests?: number },
  ): Promise<Room[]> => {
    const params = new URLSearchParams({ startDate, endDate });
    if (opts?.type) params.set("type", opts.type);
    if (typeof opts?.guests === "number")
      params.set("guests", String(opts.guests));

    const url = `/reservations/availability?${params.toString()}`;
    console.log("ReservationsService - getAvailability called:", {
      startDate,
      endDate,
      opts,
      url,
    });

    return apiRequest(url)
      .then((response) => {
        const rooms = response as Room[];
        console.log("ReservationsService - getAvailability response:", rooms);
        return rooms;
      })
      .catch((error) => {
        console.error("ReservationsService - getAvailability error:", error);
        throw error;
      });
  },

  // Billing details for invoicing
  getReservationsWithBillingDetails: (): Promise<ReservationBillingDetails[]> =>
    apiRequest("/reservations/billing-details"),
};
