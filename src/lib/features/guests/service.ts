import { apiRequest, createApiEndpoints } from "@/lib/api/base";
import { Guest, CreateGuestDto, UpdateGuestDto, ActiveGuest } from "./types";

const base = createApiEndpoints<Guest, CreateGuestDto, UpdateGuestDto>(
  "/guests",
);

export const guestsService = {
  ...base,
  search: (term: string): Promise<Guest[]> =>
    apiRequest(`/guests?search=${encodeURIComponent(term)}`),
  getActiveGuests: async (): Promise<ActiveGuest[]> =>
    apiRequest("/guests/active"),
};
