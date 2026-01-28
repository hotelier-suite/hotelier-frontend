import { BaseEntity } from "../shared/types";

// Room types
export type RoomType = "INDIVIDUAL" | "DOBLE" | "SUITE" | "FAMILIAR";

export interface Room extends BaseEntity {
  number: string;
  type: RoomType;
  price: number;
  capacity: number;
  isAvailable: boolean;
  description?: string;
}

// Filter parameters for rooms
export interface FindRoomsFilter {
  type?: RoomType;
  available?: boolean;
}

export type CreateRoomDto = Omit<Room, "id" | "createdAt" | "updatedAt">;
export type UpdateRoomDto = Partial<CreateRoomDto>;
