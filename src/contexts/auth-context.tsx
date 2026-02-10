"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/lib/features/auth/types";

// Define the shape of the auth context
interface AuthContextType {
  user: {
    id: number; // Changed to match AuthUser interface
    name: string;
    email: string;
    roles: Array<{ id: number; name: string; description?: string }>;
    permissions: string[];
    avatar?: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  // Simplify auth state - just pass through the auth hook without complex tracking
  const authState = {
    ...auth,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
  };

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
