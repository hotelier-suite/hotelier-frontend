"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import {
  Home,
  CalendarDays,
  CalendarClock,
  Users,
  User,
  UserPlus,
  DollarSign,
  Bed,
  Utensils,
  Package,
  UserCheck,
  FileText,
  Calendar,
  BarChart3,
  MessageSquare,
  Car,
  Settings,
  Shield,
  Wrench,
  Grid3X3,
  Dumbbell,
  Eye,
} from "lucide-react";
import { HotelierLogo } from "@/components/hotelier-logo";
import { useAuthContext } from "@/contexts/auth-context";
import {
  navigationConfig,
  filterNavigationByPermissions,
} from "@/lib/navigation-config";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Icon mapping
interface IconProps {
  size?: number | string;
  strokeWidth?: number;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  Home,
  CalendarDays,
  CalendarClock,
  Users,
  User,
  UserPlus,
  DollarSign,
  Bed,
  Utensils,
  Package,
  UserCheck,
  FileText,
  Calendar,
  BarChart3,
  MessageSquare,
  Car,
  Settings,
  Shield,
  Wrench,
  Grid3X3,
  Dumbbell,
  Eye,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppSidebar");
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const pathname = usePathname();
  const [, setForceUpdate] = React.useState(0);

  // Listen to navigation update events to force re-render
  React.useEffect(() => {
    const handleNavigationUpdate = () => {
      setForceUpdate((prev) => prev + 1);
    };

    const events = [
      "navigation-update",
      "auth-context-update",
      "auth-force-update",
      "navigation-sync",
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleNavigationUpdate);
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleNavigationUpdate);
      });
    };
  }, []);

  // Define UserRole interface
  interface UserRole {
    id: number;
    name: string;
    description?: string;
  }

  const filteredNavigation = (() => {
    // If not authenticated or user doesn't exist, return empty array
    if (!isAuthenticated || !user) {
      return [];
    }

    // If still loading, wait for permissions to load
    if (isLoading) {
      return [];
    }

    const userRoles = user.roles?.map((r: UserRole) => r.name) || [];
    const userPermissions = user.permissions || [];

    // If user has no permissions but is authenticated, show basic navigation
    // This handles the case where permissions might be loading or empty
    if (userPermissions.length === 0) {
      // Check if user has admin role - if so, show all navigation
      const isAdmin =
        userRoles.includes("admin") || userRoles.includes("administrator");

      if (isAdmin) {
        // Admin users get full navigation even without explicit permissions
        return filterNavigationByPermissions(
          navigationConfig,
          [
            "dashboard:read",
            "reservations:read",
            "billing:read",
            "inventory:read",
            "employees:read",
            "parking:read",
            "events:read",
            "maintenance:read",
            "reports:read",
          ], // Basic permissions for admin
          userRoles,
        );
      }

      // Return basic navigation items that don't require specific permissions
      return [
        {
          titleKey: "mainPanel",
          items: [
            {
              titleKey: "dashboard",
              url: "/",
              icon: "Home",
            },
          ],
        },
      ];
    }

    return filterNavigationByPermissions(
      navigationConfig,
      userPermissions,
      userRoles,
    );
  })();

  // Show loading state if authentication is being processed
  if (isLoading) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-center px-4 py-2">
            <HotelierLogo variant="full" size="lg" showBackground={false} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("status")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {isLoading ? t("loadingUserInfo") : t("syncingPermissions")}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-center px-4 py-2">
            <HotelierLogo variant="full" size="lg" showBackground={false} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("system")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {isLoading ? t("loading") : t("loginToAccess")}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center px-4 py-2">
          <HotelierLogo variant="full" size="lg" showBackground={false} />
        </div>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          <div className="truncate">{t("welcome", { name: user?.name })}</div>
          <div className="truncate sm:hidden">
            {user?.roles?.map((role) => role.name).join(", ") ||
              t("fallbackRole")}
          </div>
          <div className="hidden sm:block truncate">
            {t("roles", {
              roles:
                user?.roles?.map((role) => role.name).join(", ") ||
                t("fallbackRole"),
            })}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavigation.map((group) => (
          <SidebarGroup key={group.titleKey}>
            <SidebarGroupLabel>{t(group.titleKey)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  const IconComponent = iconMap[item.icon];

                  return (
                    <SidebarMenuItem key={`${group.titleKey}-${item.url}`}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url as "/"}>
                          {IconComponent && (
                            <IconComponent className="h-4 w-4" />
                          )}
                          <span>{t(item.titleKey)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
