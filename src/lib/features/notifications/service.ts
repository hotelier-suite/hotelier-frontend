import { apiRequest } from "@/lib/api/base";
import { Notification } from "./types";

export const notificationsService = {
  list: (includeRead = false): Promise<Notification[]> =>
    apiRequest(`/notifications?includeRead=${includeRead}`),

  markRead: (id: number): Promise<void> =>
    apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllRead: (): Promise<void> =>
    apiRequest(`/notifications/read-all`, { method: "PATCH" }),
};
