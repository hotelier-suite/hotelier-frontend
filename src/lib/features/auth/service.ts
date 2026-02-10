import { apiRequest } from "@/lib/api/base";
import { authCookies } from "@/lib/auth-cookies";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthUser,
  User,
} from "./types";

export const authService = {
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

  // Get current user profile
  getCurrentUser: (): Promise<AuthUser> =>
    apiRequest("/auth/me", {
      method: "GET",
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
