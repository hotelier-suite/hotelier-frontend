import { BaseEntity } from "../shared/types";

// Guest Request types
export type GuestRequestType =
  | "TOWELS"
  | "ROOM_SERVICE"
  | "MAINTENANCE"
  | "HOUSEKEEPING"
  | "CONCIERGE"
  | "TECHNICAL_SUPPORT"
  | "OTHER";

export type GuestRequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type GuestRequestStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface GuestRequest extends BaseEntity {
  room: string;
  guestName: string;
  type: GuestRequestType;
  description: string;
  time: string;
  priority: GuestRequestPriority;
  status: GuestRequestStatus;
  assignedTo?: number;
  notes?: string;
}

export type CreateGuestRequestDto = Omit<
  GuestRequest,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateGuestRequestDto = Partial<CreateGuestRequestDto>;
