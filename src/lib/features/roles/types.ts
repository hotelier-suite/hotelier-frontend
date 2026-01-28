// System roles and permissions types
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
