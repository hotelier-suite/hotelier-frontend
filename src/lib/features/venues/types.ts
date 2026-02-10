import { BaseEntity } from "../shared/types";

// Venue types
export interface Venue extends BaseEntity {
  name: string;
  capacity: number;
  area: number;
  hourlyRate: number;
  available: boolean;
  location: string;
  description?: string;
}

// Backend venue type
export interface BackendVenue {
  id: number;
  name: string;
  capacity: number;
  area: number;
  hourlyRate: number;
  available: boolean;
  location: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter parameters for venues
export interface VenuesFilterParams {
  isAvailable?: boolean;
  minCapacity?: number;
  name?: string;
}

export type CreateVenueDto = Omit<Venue, "id" | "createdAt" | "updatedAt">;
export type UpdateVenueDto = Partial<CreateVenueDto>;
