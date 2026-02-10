import { apiRequest } from "@/lib/api/base";
import {
  Venue,
  BackendVenue,
  VenuesFilterParams,
  CreateVenueDto,
  UpdateVenueDto,
} from "./types";

// Transform backend venue to frontend format
const transformVenue = (backendVenue: BackendVenue): Venue => {
  return {
    id: backendVenue.id,
    name: backendVenue.name,
    capacity: backendVenue.capacity,
    area: backendVenue.area,
    hourlyRate: backendVenue.hourlyRate,
    available: backendVenue.available,
    location: backendVenue.location,
    description: backendVenue.description,
    createdAt: backendVenue.createdAt,
    updatedAt: backendVenue.updatedAt,
  };
};

export const venuesService = {
  // Override getAll to transform data with optional filters
  getAll: async (filters?: VenuesFilterParams): Promise<Venue[]> => {
    const params = new URLSearchParams();
    if (filters?.isAvailable !== undefined) {
      params.set("isAvailable", String(filters.isAvailable));
    }
    if (filters?.minCapacity !== undefined) {
      params.set("minCapacity", String(filters.minCapacity));
    }
    if (filters?.name) {
      params.set("name", filters.name);
    }

    const query = params.toString();
    const backendVenues = await apiRequest(
      `/venues${query ? `?${query}` : ""}`,
    );
    return (backendVenues as BackendVenue[]).map(transformVenue);
  },

  getById: async (id: number): Promise<Venue> => {
    const backendVenue = await apiRequest(`/venues/${id}`);
    return transformVenue(backendVenue as BackendVenue);
  },

  getAvailable: async (): Promise<Venue[]> => {
    return venuesService.getAll({ isAvailable: true });
  },

  create: async (data: CreateVenueDto): Promise<Venue> => {
    const backendVenue = await apiRequest("/venues", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return transformVenue(backendVenue as BackendVenue);
  },

  update: async (id: number, data: UpdateVenueDto): Promise<Venue> => {
    const backendVenue = await apiRequest(`/venues/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return transformVenue(backendVenue as BackendVenue);
  },

  delete: async (id: number): Promise<Venue> => {
    const backendVenue = await apiRequest(`/venues/${id}`, {
      method: "DELETE",
    });
    return transformVenue(backendVenue as BackendVenue);
  },
};
