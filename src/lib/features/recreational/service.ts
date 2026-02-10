import { apiRequest } from "@/lib/api/base";
import {
  RecreationalFacility,
  RecreationalBooking,
  FacilityAvailability,
  BookingStatistics,
  CreateRecreationalFacilityData,
  CreateRecreationalBookingData,
  UpdateRecreationalFacilityData,
  UpdateRecreationalBookingData,
  FacilityType,
  BookingStatus,
} from "./types";

export const recreationalService = {
  // ========== FACILITIES ==========
  getFacilities: (): Promise<RecreationalFacility[]> =>
    apiRequest("/recreational/facilities"),

  getFacilityById: (id: number): Promise<RecreationalFacility> =>
    apiRequest(`/recreational/facilities/${id}`),

  createFacility: (
    data: CreateRecreationalFacilityData,
  ): Promise<RecreationalFacility> =>
    apiRequest("/recreational/facilities", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateFacility: (
    id: number,
    data: UpdateRecreationalFacilityData,
  ): Promise<RecreationalFacility> =>
    apiRequest(`/recreational/facilities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteFacility: (id: number): Promise<void> =>
    apiRequest(`/recreational/facilities/${id}`, {
      method: "DELETE",
    }),

  // ========== BOOKINGS ==========
  getBookings: (): Promise<RecreationalBooking[]> =>
    apiRequest("/recreational/bookings"),

  getBookingById: (id: number): Promise<RecreationalBooking> =>
    apiRequest(`/recreational/bookings/${id}`),

  createBooking: (
    data: CreateRecreationalBookingData,
  ): Promise<RecreationalBooking> =>
    apiRequest("/recreational/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBooking: (
    id: number,
    data: UpdateRecreationalBookingData,
  ): Promise<RecreationalBooking> =>
    apiRequest(`/recreational/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Booking actions
  cancelBooking: (id: number, reason?: string): Promise<RecreationalBooking> =>
    apiRequest(`/recreational/bookings/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),

  checkInBooking: (id: number): Promise<RecreationalBooking> =>
    apiRequest(`/recreational/bookings/${id}/checkin`, {
      method: "PATCH",
    }),

  checkOutBooking: (id: number): Promise<RecreationalBooking> =>
    apiRequest(`/recreational/bookings/${id}/checkout`, {
      method: "PATCH",
    }),

  // ========== AVAILABILITY & STATS ==========
  getFacilityAvailability: (
    facilityId: number,
    date: string,
  ): Promise<FacilityAvailability> =>
    apiRequest(
      `/recreational/facilities/${facilityId}/availability?date=${date}`,
    ),

  getOverallAvailability: (date: string): Promise<FacilityAvailability[]> =>
    apiRequest(`/recreational/facilities/availability?date=${date}`),

  getStatistics: (
    startDate?: string,
    endDate?: string,
  ): Promise<BookingStatistics> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const queryString = params.toString();
    return apiRequest(
      `/recreational/bookings/statistics${queryString ? `?${queryString}` : ""}`,
    );
  },

  // ========== HELPER METHODS ==========
  getFacilitiesByType: (type: FacilityType): Promise<RecreationalFacility[]> =>
    apiRequest("/recreational/facilities").then((facilities) =>
      (facilities as RecreationalFacility[]).filter((f) => f.type === type),
    ),

  getFacilityBookings: (facilityId: number): Promise<RecreationalBooking[]> =>
    apiRequest("/recreational/bookings").then((bookings) =>
      (bookings as RecreationalBooking[]).filter(
        (b) => b.facilityId === facilityId,
      ),
    ),

  getBookingsByStatus: (
    status: BookingStatus,
  ): Promise<RecreationalBooking[]> =>
    apiRequest("/recreational/bookings").then((bookings) =>
      (bookings as RecreationalBooking[]).filter((b) => b.status === status),
    ),
};
