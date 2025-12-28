import { apiRequest, createApiEndpoints } from "./base";
import { BaseEntity } from "../types";

// Room types
export interface Room extends BaseEntity {
  number: string;
  type: "INDIVIDUAL" | "DOBLE" | "SUITE" | "FAMILIAR";
  price: number;
  capacity: number;
  isAvailable: boolean;
  description?: string;
}

// Filter parameters for rooms
export interface FindRoomsFilter {
  type?: "INDIVIDUAL" | "DOBLE" | "SUITE" | "FAMILIAR";
  available?: boolean;
}

// Create base CRUD operations
const baseApi = createApiEndpoints<Room>("/rooms");

// Extended rooms API with filter support
export const roomsApi = {
  // Base CRUD operations (excluding getAll which we override)
  create: baseApi.create,
  update: baseApi.update,
  delete: baseApi.delete,
  getById: baseApi.getById,

  // Override getAll to accept filter parameters
  getAll: (filters?: FindRoomsFilter): Promise<Room[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.set("type", filters.type);
    if (typeof filters?.available === "boolean")
      params.set("available", String(filters.available));

    const query = params.toString();
    return apiRequest(`/rooms${query ? `?${query}` : ""}`);
  },

  // Convenience method to get available rooms
  getAvailable: (): Promise<Room[]> => roomsApi.getAll({ available: true }),
};
