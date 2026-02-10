import { BaseEntity } from "../shared/types";

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

// Create/Update data types
export type CreateRecreationalFacilityData = Omit<
  RecreationalFacility,
  "id" | "createdAt" | "updatedAt"
>;

export type CreateRecreationalBookingData = Omit<
  RecreationalBooking,
  "id" | "createdAt" | "updatedAt" | "facility"
>;

export type UpdateRecreationalFacilityData =
  Partial<CreateRecreationalFacilityData>;

export type UpdateRecreationalBookingData = Partial<
  Omit<CreateRecreationalBookingData, "facilityId">
>;
