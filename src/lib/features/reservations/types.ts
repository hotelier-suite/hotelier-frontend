import { BaseEntity } from "../shared/types";
import { User } from "../auth/types";
import { Room } from "../rooms/types";

// Reservation types
export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

export type BookingChannel =
  | "DIRECT"
  | "BOOKING_COM"
  | "EXPEDIA"
  | "AIRBNB"
  | "AGENCY"
  | "PHONE";

export interface Reservation extends BaseEntity {
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  discountPercent?: number;
  discountAmount?: number;
  status: ReservationStatus;
  channel: BookingChannel;
  notes?: string;
  userId: number;
  roomId: number;
  guestId?: number;
  user: User;
  room: Room;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  nights?: number;
}

// Filter parameters for reservations
export interface FindReservationsFilter {
  userId?: number;
  status?: ReservationStatus;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface RoomServiceCharge {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  total: number;
  status: string;
  items: Array<{
    item: string;
    quantity: number;
    price: number;
    notes?: string;
  }>;
}

export interface EventCharge {
  bookingId: number;
  title: string;
  eventDate: string;
  total: number;
  status: string;
  attendees: number;
}

export interface ReservationBillingDetails {
  reservation: Reservation;
  roomCharges: number;
  roomServiceCharges: RoomServiceCharge[];
  roomServiceTotal: number;
  eventCharges: EventCharge[];
  eventTotal: number;
  grandTotal: number;
  hasInvoice: boolean;
  isPendingPayment?: boolean;
  reservationStatus?: string;
}

export interface CheckoutResponse {
  reservation: Reservation;
  assignmentId?: number | null;
  invoiceId?: number | null;
}

export type CreateReservationDto = Omit<
  Reservation,
  "id" | "createdAt" | "updatedAt" | "user" | "room" | "totalAmount" | "status"
>;
