"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/contexts/auth-context";
import { authCookies } from "@/lib/auth-cookies";

interface RouteGuardProps {
  children: React.ReactNode;
}

// Loading component for authentication
function AuthLoadingSpinner() {
  const t = useTranslations("RouteGuard");
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">{t("verifying")}</p>
      </div>
    </div>
  );
}

// Hook to track client-side hydration
function useIsClient() {
  return useSyncExternalStore(
    () => () => {}, // subscribe (no-op since this never changes)
    () => true, // getSnapshot (client-side)
    () => false, // getServerSnapshot (server-side)
  );
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading, checkAuthStatus, user, hasRole } =
    useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedRef = useRef(false);
  const isHydrated = useIsClient();

  // Check if current path is an auth page
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Main authentication effect
  useEffect(() => {
    // Don't run on server or before hydration
    if (!isHydrated) return;

    // If still loading, wait
    if (isLoading) return;

    // If authenticated, handle role-based redirections
    if (isAuthenticated) {
      hasCheckedRef.current = false;

      // Check if there's actually a valid token - prevent redirect during logout
      const hasValidToken = authCookies.getAccessToken();
      if (!hasValidToken) return;

      // If user is a client and tries to access dashboard, redirect to my-reservations
      if (hasRole("client") && pathname === "/") {
        router.replace("/my-reservations");
        return;
      }

      // If user is a client and on login page after authentication, redirect to my-reservations
      if (hasRole("client") && isAuthPage) {
        router.replace("/my-reservations");
        return;
      }

      // If authenticated user (non-client) tries to access auth pages, redirect to dashboard
      if (isAuthPage && !hasRole("client")) {
        router.replace("/");
        return;
      }

      return;
    }

    // Reset check flag when on auth pages
    if (isAuthPage) {
      hasCheckedRef.current = false;
    }

    // Not authenticated - check if we should try to restore auth
    const hasToken = authCookies.getAccessToken();

    // If there's a token but we're not authenticated, check auth status once
    if (hasToken && !hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkAuthStatus();
      return;
    }

    // No token or already checked - redirect to login if not on auth page
    if (!isAuthPage) {
      router.replace("/login");
    }
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    router,
    checkAuthStatus,
    isHydrated,
    isAuthPage,
    user,
    hasRole,
  ]);

  // Show loading spinner during hydration to prevent mismatch
  if (!isHydrated) {
    return <AuthLoadingSpinner />;
  }

  // Show loading spinner while checking authentication
  if (isLoading && !isAuthPage) {
    return <AuthLoadingSpinner />;
  }

  // Don't render children if not authenticated and not on auth page
  if (!isAuthenticated && !isAuthPage) {
    return <AuthLoadingSpinner />;
  }

  // All checks passed - render children
  return <>{children}</>;
}
