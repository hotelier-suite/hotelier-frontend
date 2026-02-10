import { apiRequest, createApiEndpoints } from "@/lib/api/base";
import {
  SystemRole,
  SystemPermission,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "./types";

// Role management service
const roleBaseApi = createApiEndpoints<SystemRole>("/roles");

export const rolesService = {
  ...roleBaseApi,

  // Role CRUD operations
  create: (data: CreateRoleRequest): Promise<SystemRole> =>
    apiRequest("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateRoleRequest): Promise<SystemRole> =>
    apiRequest(`/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: number): Promise<SystemRole> =>
    apiRequest(`/roles/${id}`, {
      method: "DELETE",
    }),

  getByName: async (name: string): Promise<SystemRole> => {
    const roles = await apiRequest<SystemRole[]>(
      `/roles?name=${encodeURIComponent(name)}`,
    );
    const role = roles.find((r) => r.name.toLowerCase() === name.toLowerCase());
    if (!role) {
      throw new Error(`Role with name "${name}" not found`);
    }
    return role;
  },

  removePermission: (roleId: number, permissionId: number): Promise<void> =>
    apiRequest(`/roles/${roleId}/permissions/${permissionId}`, {
      method: "DELETE",
    }),

  // User role management
  removeRoleFromUser: (userId: number, roleId: number): Promise<void> =>
    apiRequest(`/users/${userId}/roles/${roleId}`, {
      method: "DELETE",
    }),

  getUserRoles: (userId: number): Promise<SystemRole[]> =>
    apiRequest(`/users/${userId}/roles`),

  getUserPermissions: (userId: number): Promise<SystemPermission[]> =>
    apiRequest(`/users/${userId}/permissions`),
};

// System permissions service
export const systemPermissionsService = {
  getAll: (): Promise<SystemPermission[]> => apiRequest("/roles/permissions"),

  getByResource: (): Promise<Record<string, SystemPermission[]>> =>
    apiRequest("/roles/permissions/by-resource"),

  create: (data: CreatePermissionRequest): Promise<SystemPermission> =>
    apiRequest("/roles/permissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: UpdatePermissionRequest,
  ): Promise<SystemPermission> =>
    apiRequest(`/roles/permissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: number): Promise<SystemPermission> =>
    apiRequest(`/roles/permissions/${id}`, {
      method: "DELETE",
    }),
};
