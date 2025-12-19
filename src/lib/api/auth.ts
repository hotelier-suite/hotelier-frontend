import { apiRequest } from "./base";
import { authCookies } from "../auth-cookies";

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

// Authentication API
export const authApi = {
  // Login user
  login: (email: string, password: string): Promise<AuthResponse> =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password } as LoginRequest),
    }),

  // Register user
  register: (userData: RegisterRequest): Promise<AuthResponse> =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Get token from authCookies before making the API call
      const token = authCookies.getAccessToken();
      if (!token) {
        // No token, nothing to logout
        return;
      }

      await apiRequest("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  // Get current user (backend expects POST /auth/me)
  getCurrentUser: (): Promise<AuthUser> =>
    apiRequest("/auth/me", {
      method: "POST",
    }),

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem("refresh_token");
    return apiRequest("/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  },

  // Get all users (admin only)
  getAllUsers: (): Promise<User[]> => apiRequest("/users"),
};
