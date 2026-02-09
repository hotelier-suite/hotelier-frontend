"use client";

import React from "react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "sonner";
import { RouteGuard } from "@/components/auth/route-guard";
import { NavigationUpdater } from "@/components/navigation/navigation-updater";
import { usePathname } from "@/i18n/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex flex-1 flex-col gap-4 p-1 sm:p-2 md:p-3 lg:p-4 xl:p-6 min-w-0">
              <div className="w-full min-w-0">{children}</div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Pages that should not show the dashboard layout
  // usePathname from next-intl returns the internal pathname without locale prefix
  const authPaths = ["/login", "/register"];
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (isAuthPage) {
    // Auth layout - just render children
    return <>{children}</>;
  }

  // Dashboard layout with collapsible sidebar
  return <DashboardLayout>{children}</DashboardLayout>;
}

export function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const authPaths = ["/login", "/register"];
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <AuthProvider>
        <NavigationUpdater />
        {isAuthPage ? (
          <LayoutContent>{children}</LayoutContent>
        ) : (
          <RouteGuard>
            <LayoutContent>{children}</LayoutContent>
          </RouteGuard>
        )}
      </AuthProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
