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

export const usersApi = {
  getMyProfile: (): Promise<UserResponseDto> => apiRequest("/users/profile/me"),
  update: (id: number, data: UpdateUserRequest): Promise<UserResponseDto> =>
    apiRequest(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
