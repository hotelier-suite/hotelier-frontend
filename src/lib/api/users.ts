import { apiRequest } from "./base";

export interface UserRoleDto {
  id: number;
  name: string;
  description?: string;
}

export interface UserRoleAssignmentDto {
  id: number;
  role: UserRoleDto;
}

export interface UserResponseDto {
  id: number;
  email: string;
  name: string;
  phone?: string;
  loyaltyPoints: number;
  loyaltyLevel: string;
  preferences?: string | null;
  registrationDate: string;
  lastVisit?: string | null;
  createdAt: string;
  updatedAt: string;
  firstVisit?: string | null;
  isActive: boolean;
  lastLogin?: string | null;
  userRoles?: UserRoleAssignmentDto[];
  permissions?: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  preferences?: string | null;
  isActive?: boolean;
  roleIds?: number[];
}

// Filter parameters for users
export interface FindUsersFilter {
  email?: string;
  isActive?: boolean;
  roleId?: number;
}

export const usersApi = {
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
