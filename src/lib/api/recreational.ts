import { apiRequest } from "./base";
import { BaseEntity } from "../types";

// Enums matching backend
export type FacilityType =
  | "SWIMMING_POOL"
  | "GYM"
  | "TENNIS_COURT"
  | "SPA"
  | "SAUNA"
  | "JACUZZI"
  | "GAME_ROOM"
  | "YOGA_STUDIO"
  | "KIDS_PLAY_AREA"
  | "BUSINESS_CENTER"
  | "OTHER";

export type FacilityStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "OUT_OF_ORDER"
  | "RESERVED"
  | "CLEANING";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type BookingPriority = "NORMAL" | "HIGH" | "VIP" | "MAINTENANCE";

// Interface definitions
export interface RecreationalFacility extends BaseEntity {
  name: string;
  type: FacilityType;
  status: FacilityStatus;
  capacity: number;
  area?: number;
  location: string;
  description?: string;
  hourlyRate?: number;
  available: boolean;
  openingTime: string;
  closingTime: string;
  minimumBookingHours: number;
  maximumBookingHours: number;
  amenities?: string[];
  rules?: string[];
  advanceBookingHours: number;
  availableDays?: number[];
  maintenanceNotes?: string;
}

export interface RecreationalBooking extends BaseEntity {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomNumber?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  participants: number;
  totalCost: number;
  status: BookingStatus;
  priority: BookingPriority;
  specialRequests?: string;
  staffNotes?: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
  discountPercent?: number;
  discountAmount?: number;
  createdByUserId?: number;
  facilityId: number;
  facility?: RecreationalFacility;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  currentBookings?: number;
  maxCapacity?: number;
}

export interface FacilityAvailability {
  facilityId: number;
  facilityName: string;
  date: string;
  totalCapacity: number;
  availableSlots: TimeSlot[];
  isFullyBooked: boolean;
  nextAvailableSlot?: string;
}

export interface FacilityUsageStats {
  facilityName: string;
  totalBookings: number;
  totalHoursBooked: number;
  utilizationRate: number;
  totalRevenue: number;
}

export interface BookingStatusBreakdown {
  pending?: number;
  confirmed?: number;
  checkedIn?: number;
  completed?: number;
  cancelled?: number;
  noShow?: number;
}

export interface BookingStatistics {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  statusBreakdown: BookingStatusBreakdown;
  mostPopularFacilityType: string;
  peakHour: string;
  facilitiesUsage: FacilityUsageStats[];
  period: {
    startDate: string;
    endDate: string;
  };
}

// Create facility data type
export type CreateRecreationalFacilityData = Omit<
  RecreationalFacility,
  "id" | "createdAt" | "updatedAt"
>;

// Create booking data type
export type CreateRecreationalBookingData = Omit<
  RecreationalBooking,
  "id" | "createdAt" | "updatedAt" | "facility"
>;

// Update facility data type
export type UpdateRecreationalFacilityData =
  Partial<CreateRecreationalFacilityData>;

// Update booking data type
export type UpdateRecreationalBookingData = Partial<
  Omit<CreateRecreationalBookingData, "facilityId">
>;

// Recreational API
export const recreationalApi = {
  // ========== FACILITIES ==========
  // Basic facility CRUD
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
  // Basic booking CRUD
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
  // Check facility availability
  getFacilityAvailability: (
    facilityId: number,
    date: string,
  ): Promise<FacilityAvailability> =>
    apiRequest(
      `/recreational/facilities/${facilityId}/availability?date=${date}`,
    ),

  // Check overall availability
  getOverallAvailability: (date: string): Promise<FacilityAvailability[]> =>
    apiRequest(`/recreational/facilities/availability?date=${date}`),

  // Get booking statistics
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
  // Get available facilities by type
  getFacilitiesByType: (type: FacilityType): Promise<RecreationalFacility[]> =>
    apiRequest("/recreational/facilities").then((facilities) =>
      (facilities as RecreationalFacility[]).filter((f) => f.type === type),
    ),

  // Get upcoming bookings for a facility
  getFacilityBookings: (facilityId: number): Promise<RecreationalBooking[]> =>
    apiRequest("/recreational/bookings").then((bookings) =>
      (bookings as RecreationalBooking[]).filter(
        (b) => b.facilityId === facilityId,
      ),
    ),

  // Get bookings by status
  getBookingsByStatus: (
    status: BookingStatus,
  ): Promise<RecreationalBooking[]> =>
    apiRequest("/recreational/bookings").then((bookings) =>
      (bookings as RecreationalBooking[]).filter((b) => b.status === status),
    ),
};
