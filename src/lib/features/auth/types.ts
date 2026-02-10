// Auth types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRole {
  id: number;
  name: string;
  description?: string;
}

export interface UserRoleAssignment {
  id: number;
  role: UserRole;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles?: UserRole[];
  userRoles?: UserRoleAssignment[];
  permissions?: string[];
  role?: "ADMIN" | "STAFF" | "CUSTOMER";
  loyaltyLevel?: string;
  totalStays?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  lastVisit?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

export interface RefreshTokenResponse {
  token: string;
  user: AuthUser;
}
