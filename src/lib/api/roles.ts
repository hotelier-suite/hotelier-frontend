import { apiRequest, createApiEndpoints } from "./base";

export interface SystemRole {
  id: number;
  name: string;
  description?: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: RolePermission[];
  userRoles?: UserRole[];
}

export interface SystemPermission {
  id: number;
  resource: string;
  action: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permission: SystemPermission;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  assignedAt: string;
  assignedBy?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  isSystem?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissionIds?: number[];
}

export interface CreatePermissionRequest {
  resource: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  resource?: string;
  action?: string;
  description?: string;
}

// Role management API
const roleBaseApi = createApiEndpoints<SystemRole>("/roles");

export const rolesApi = {
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
    // Backend uses query parameter for name filtering
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

// System permissions API
export const systemPermissionsApi = {
  // Permission CRUD operations
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

// Combined API object for convenience
export const rolePermissionApi = {
  roles: rolesApi,
  permissions: systemPermissionsApi,
};

export default rolePermissionApi;
