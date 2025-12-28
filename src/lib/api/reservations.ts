import { apiRequest, createApiEndpoints } from "./base";
import { BaseEntity } from "../types";
import { User } from "./auth";
import { Room } from "./rooms";

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

// Create base CRUD operations
const baseApi = createApiEndpoints<Reservation>("/reservations");

// Extended reservations API with analytics and reception features
export const reservationsApi = {
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
    reservationsApi.getAll({ isCurrent: true }),

  // Checkout endpoint (returns DTO)
  checkout: (
    id: number,
  ): Promise<{
    reservation: Reservation;
    assignmentId?: number | null;
    invoiceId?: number | null;
  }> => apiRequest(`/reservations/${id}/checkout`, { method: "PATCH" }),

  // Self-service endpoints - getMine uses userId filter
  getMine: (userId: number): Promise<Reservation[]> =>
    reservationsApi.getAll({ userId }),
  createSelf: (
    data: Omit<
      Reservation,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "user"
      | "room"
      | "totalAmount"
      | "status"
    >,
  ): Promise<Reservation> =>
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
    console.log("ReservationsApi - getAvailability called:", {
      startDate,
      endDate,
      opts,
      url,
    });

    return apiRequest(url)
      .then((response) => {
        const rooms = response as Room[];
        console.log("ReservationsApi - getAvailability response:", rooms);
        return rooms;
      })
      .catch((error) => {
        console.error("ReservationsApi - getAvailability error:", error);
        throw error;
      });
  },

  // Billing details for invoicing
  getReservationsWithBillingDetails: (): Promise<ReservationBillingDetails[]> =>
    apiRequest("/reservations/billing-details"),
};

export interface RoomServiceCharge {
  orderId: number;
  orderNumber: string;
  orderTime: string;
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
