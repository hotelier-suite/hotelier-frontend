import { apiRequest } from "@/lib/api/base";
import { UserResponseDto, UpdateUserRequest, FindUsersFilter } from "./types";

export const usersService = {
  getAll: (filters?: FindUsersFilter): Promise<UserResponseDto[]> => {
    const params = new URLSearchParams();
    if (filters?.email) params.set("email", filters.email);
    if (filters?.isActive !== undefined)
      params.set("isActive", String(filters.isActive));
    if (filters?.roleId) params.set("roleId", String(filters.roleId));

    const query = params.toString();
    return apiRequest(`/users${query ? `?${query}` : ""}`);
  },

  getMyProfile: (): Promise<UserResponseDto> => apiRequest("/users/profile/me"),

  update: (id: number, data: UpdateUserRequest): Promise<UserResponseDto> =>
    apiRequest(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
