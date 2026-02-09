// Navigation item to permission mapping
export interface NavigationItem {
  titleKey: string;
  url: string;
  icon: string;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  excludeRoles?: string[];
}

export interface NavigationGroup {
  titleKey: string;
  items: NavigationItem[];
}

// Define permission requirements for each navigation item
export const navigationConfig: NavigationGroup[] = [
  {
    titleKey: "mainPanel",
    items: [
      {
        titleKey: "dashboard",
        url: "/",
        icon: "Home",
        requiredPermissions: ["dashboard:read"],
      },
    ],
  },
  {
    titleKey: "operations",
    items: [
      {
        titleKey: "reservations",
        url: "/reservations",
        icon: "CalendarDays",
        requiredPermissions: ["reservations:read"],
        excludeRoles: ["client"],
      },
      {
        titleKey: "roomBoard",
        url: "/room-board",
        icon: "Grid3X3",
        requiredPermissions: ["rooms:read", "reservations:read"],
        excludeRoles: ["client"],
      },
      {
        titleKey: "myReservations",
        url: "/my-reservations",
        icon: "CalendarClock",
        requiredRoles: ["client"],
      },
      {
        titleKey: "guests",
        url: "/guests",
        icon: "UserPlus",
        requiredPermissions: ["guests:read"],
      },
      {
        titleKey: "housekeeping",
        url: "/housekeeping",
        icon: "Bed",
        requiredPermissions: ["housekeeping:read"],
      },
      {
        titleKey: "restaurant",
        url: "/restaurant",
        icon: "Utensils",
        requiredPermissions: ["restaurant:read"],
      },
      {
        titleKey: "corporateEvents",
        url: "/events",
        icon: "Calendar",
        requiredPermissions: ["events:read"],
      },
      {
        titleKey: "recreationalFacilities",
        url: "/recreation",
        icon: "Dumbbell",
        requiredPermissions: ["recreational:read"],
      },
    ],
  },
  {
    titleKey: "financialManagement",
    items: [
      {
        titleKey: "billing",
        url: "/billing",
        icon: "DollarSign",
        requiredRoles: ["administrator", "manager", "receptionist", "client"],
      },
    ],
  },
  {
    titleKey: "resources",
    items: [
      {
        titleKey: "inventory",
        url: "/inventory",
        icon: "Package",
        requiredPermissions: ["inventory:read"],
      },
      {
        titleKey: "staff",
        url: "/staff",
        icon: "UserCheck",
        excludeRoles: ["client"],
      },
      {
        titleKey: "parking",
        url: "/parking",
        icon: "Car",
        requiredPermissions: ["parking:read"],
      },
      {
        titleKey: "maintenance",
        url: "/maintenance",
        icon: "Wrench",
        requiredPermissions: ["maintenance:read"],
        requiredRoles: ["administrator", "manager", "maintenance"],
      },
    ],
  },
  {
    titleKey: "analytics",
    items: [
      {
        titleKey: "reports",
        url: "/reports",
        icon: "BarChart3",
        requiredPermissions: ["reports:read"],
      },
    ],
  },
  {
    titleKey: "system",
    items: [
      {
        titleKey: "settings",
        url: "/settings",
        icon: "Settings",
        requiredPermissions: ["configuration:read"],
      },
      {
        titleKey: "users",
        url: "/settings/users",
        icon: "User",
        requiredPermissions: ["users:read"],
        requiredRoles: ["administrator"],
      },
      {
        titleKey: "systemAudit",
        url: "/audit",
        icon: "Eye",
        requiredPermissions: ["users:read"],
        requiredRoles: ["administrator", "manager"],
      },
      {
        titleKey: "profile",
        url: "/profile",
        icon: "UserCheck",
        // No specific permissions required - all authenticated users can access their profile
      },
    ],
  },
];

// Helper function to check if user has required permissions for a navigation item
export const canAccessNavItem = (
  item: NavigationItem,
  userPermissions: string[],
  userRoles: string[],
): boolean => {
  // Ensure we have arrays to work with
  const safeUserPermissions = userPermissions || [];
  const safeUserRoles = userRoles || [];

  // Check if user role is excluded
  if (item.excludeRoles && item.excludeRoles.length > 0) {
    const hasExcludedRole = item.excludeRoles.some((role) =>
      safeUserRoles.includes(role),
    );
    if (hasExcludedRole) {
      return false;
    }
  }

  // If no permissions or roles are required, allow access
  if (!item.requiredPermissions && !item.requiredRoles) {
    return true;
  }

  // Check role requirements (if any)
  if (item.requiredRoles && item.requiredRoles.length > 0) {
    const hasRequiredRole = item.requiredRoles.some((role) =>
      safeUserRoles.includes(role),
    );
    if (!hasRequiredRole) {
      return false;
    }
  }

  // Check permission requirements (if any)
  if (item.requiredPermissions && item.requiredPermissions.length > 0) {
    const hasRequiredPermission = item.requiredPermissions.some((permission) =>
      safeUserPermissions.includes(permission),
    );
    if (!hasRequiredPermission) {
      return false;
    }
  }

  return true;
};

// Filter navigation groups based on user permissions
export const filterNavigationByPermissions = (
  navigationGroups: NavigationGroup[],
  userPermissions: string[],
  userRoles: string[],
): NavigationGroup[] => {
  const filtered = navigationGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        return canAccessNavItem(item, userPermissions, userRoles);
      });

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);

  return filtered;
};
