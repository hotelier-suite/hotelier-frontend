import { BaseEntity } from "../shared/types";

// Event types
export type EventStatus =
  | "PLANNED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Venue extends BaseEntity {
  name: string;
  capacity: number;
  area: number;
  hourlyRate: number;
  available: boolean;
  location: string;
  description?: string;
}

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

export type CreateEventBookingDto = Omit<
  EventBooking,
  "id" | "createdAt" | "updatedAt" | "venue"
>;

export type UpdateEventBookingDto = Partial<CreateEventBookingDto>;
