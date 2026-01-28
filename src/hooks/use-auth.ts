"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/lib/features/auth/service";
import { authCookies } from "@/lib/auth-cookies";

interface UserRole {
  id: number;
  name: string;
  description?: string;
}

interface AuthUser {
  id: number; // Changed from string to number to match API
  name: string;
  email: string;
  roles: UserRole[];
  permissions: string[];
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const isHydrated = typeof window !== "undefined";
  const router = useRouter();
  const hasInitialized = useRef(false);

  const checkAuthStatus = useCallback(async () => {
    // Don't check if not hydrated yet
    if (!isHydrated) {
      return;
    }

    try {
      const accessToken = authCookies.getAccessToken();
      const refreshToken = authCookies.getRefreshToken();
      const userData = authCookies.getUserData();

      if (accessToken && userData) {
        // Convert stored roles (strings) back to UserRole objects
        const userWithRoleObjects: AuthUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          roles: (userData.roles || []).map((roleName: string | UserRole) =>
            typeof roleName === "string"
              ? { id: 0, name: roleName, description: roleName }
              : roleName,
          ),
          permissions: userData.permissions || [],
        };

        // Always set authenticated if we have token and user data
        setAuthState({
          user: userWithRoleObjects,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [isHydrated]);

  // Check authentication status on mount
  useEffect(() => {
    if (isHydrated && !hasInitialized.current) {
      hasInitialized.current = true;
      startTransition(() => {
        void checkAuthStatus();
      });
    }
  }, [isHydrated, checkAuthStatus]);

  // Set up periodic token refresh
  useEffect(() => {
    if (!isHydrated || !authState.isAuthenticated) return;

    // Refresh token every 4 minutes (240 seconds)
    const refreshInterval = setInterval(
      async () => {
        try {
          const refreshToken = authCookies.getRefreshToken();
          if (refreshToken) {
            const response = await authService.refreshToken();

            // Update stored tokens
            authCookies.setTokens(response.accessToken, response.refreshToken);

            // Update auth state with new tokens
            setAuthState((prev) => ({
              ...prev,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            }));
          }
        } catch (error) {
          console.error("Periodic token refresh failed:", error);
          // Don't immediately logout on refresh failure - let the API request handler deal with it
        }
      },
      4 * 60 * 1000,
    ); // 4 minutes

    return () => clearInterval(refreshInterval);
  }, [isHydrated, authState.isAuthenticated]);

  // Listen for storage changes (useful for cross-tab auth)
  useEffect(() => {
    const handleStorageChange = () => {
      if (isHydrated) {
        void checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isHydrated, checkAuthStatus]);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Call the real backend API
      const response = await authService.login(email, password);

      const user: AuthUser = {
        id: response.user.id, // Keep as number, not string
        name: response.user.name,
        email: response.user.email,
        roles: response.user.roles || [],
        permissions: response.user.permissions || [],
        avatar:
          "/placeholder.svg?height=40&width=40&text=" +
          response.user.name.charAt(0).toUpperCase(),
      };

      // Store auth data using cookies helper - convert roles to strings for storage
      const userDataForStorage = {
        ...user,
        roles: user.roles?.map((r) => r.name) || [], // Convert UserRole[] to string[] with fallback
        permissions: user.permissions || [], // Ensure permissions array exists
      };

      authCookies.setTokens(response.accessToken, response.refreshToken);
      authCookies.setUserData(userDataForStorage);

      // Always update the auth state immediately - don't wait for permissions
      const newAuthState = {
        user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };

      setAuthState(newAuthState);

      // Show success message
      toast("Welcome!", {
        description: "You have logged in successfully.",
      });

      // Navigate immediately - let React handle state updates naturally
      router.push("/");
    } catch (error: unknown) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      toast.error("Authentication error", {
        description:
          error instanceof Error
            ? error.message
            : "Incorrect credentials. Please try again.",
      });
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Call logout API first while we still have the token
      await authService.logout();
    } catch (error) {
      // Ignore logout API errors - we'll clear state anyway
      console.error("Logout API error (ignored):", error);
    }

    // Clear local storage and cookies FIRST
    authCookies.clearAll();
    localStorage.removeItem("theme");
    sessionStorage.clear();

    // Then update auth state
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Show toast
    toast("Session closed", {
      description: "You have logged out successfully.",
    });

    // Redirect to login - RouteGuard will not redirect back since no token exists
    router.replace("/login");
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));

      // Update auth data - convert roles to strings for storage
      const userDataForStorage = {
        ...updatedUser,
        roles:
          updatedUser.roles?.map((r) => (typeof r === "string" ? r : r.name)) ||
          [],
      };
      authCookies.setUserData(userDataForStorage);

      toast("Profile updated", {
        description: "Your information has been updated successfully.",
      });
    }
  };

  // Check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    if (!authState.user || !authState.user.roles) return false;
    return authState.user.roles.some((role) => role.name === roleName);
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!authState.user || !authState.user.roles) return false;
    return authState.user.roles.some((role) => roleNames.includes(role.name));
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!authState.user || !authState.user.permissions) return false;
    return authState.user.permissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!authState.user || !authState.user.permissions) return false;
    return permissions.some((permission) =>
      authState.user!.permissions!.includes(permission),
    );
  };

  // Check if user is admin
  const isAdmin = (): boolean => hasRole("admin");

  // Check if user is staff (admin or staff role)
  const isStaff = (): boolean => hasAnyRole(["admin", "staff"]);

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
    updateUser,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isStaff,
  };
}
