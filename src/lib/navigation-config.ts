// Navigation item to permission mapping
export interface NavigationItem {
  title: string;
  url: string;
  icon: string;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  excludeRoles?: string[];
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

// Define permission requirements for each navigation item
export const navigationConfig: NavigationGroup[] = [
  {
    title: "Main Panel",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: "Home",
        requiredPermissions: ["dashboard:read"],
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Reservations",
        url: "/reservations",
        icon: "CalendarDays",
        requiredPermissions: ["reservations:read"],
        excludeRoles: ["client"],
      },
      {
        title: "Room Board",
        url: "/room-board",
        icon: "Grid3X3",
        requiredPermissions: ["rooms:read", "reservations:read"],
        excludeRoles: ["client"],
      },
      {
        title: "My Reservations",
        url: "/my-reservations",
        icon: "CalendarClock",
        requiredRoles: ["client"],
      },
      {
        title: "Guests",
        url: "/guests",
        icon: "UserPlus",
        requiredPermissions: ["guests:read"],
      },
      {
        title: "Housekeeping",
        url: "/housekeeping",
        icon: "Bed",
        requiredPermissions: ["housekeeping:read"],
      },
      {
        title: "Restaurant",
        url: "/restaurant",
        icon: "Utensils",
        requiredPermissions: ["restaurant:read"],
      },
      {
        title: "Corporate Events",
        url: "/events",
        icon: "Calendar",
        requiredPermissions: ["events:read"],
      },
      {
        title: "Recreational Facilities",
        url: "/recreation",
        icon: "Dumbbell",
        requiredPermissions: ["recreational:read"],
      },
    ],
  },
  {
    title: "Financial Management",
    items: [
      {
        title: "Billing",
        url: "/billing",
        icon: "DollarSign",
        requiredRoles: ["administrator", "manager", "receptionist", "client"],
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Inventory",
        url: "/inventory",
        icon: "Package",
        requiredPermissions: ["inventory:read"],
      },
      {
        title: "Staff",
        url: "/staff",
        icon: "UserCheck",
        excludeRoles: ["client"],
      },
      {
        title: "Parking",
        url: "/parking",
        icon: "Car",
        requiredPermissions: ["parking:read"],
      },
      {
        title: "Maintenance",
        url: "/maintenance",
        icon: "Wrench",
        requiredPermissions: ["maintenance:read"],
        requiredRoles: ["administrator", "manager", "maintenance"],
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        url: "/reports",
        icon: "BarChart3",
        requiredPermissions: ["reports:read"],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: "Settings",
        requiredPermissions: ["configuration:read"],
      },
      {
        title: "Users",
        url: "/settings/users",
        icon: "User",
        requiredPermissions: ["users:read"],
        requiredRoles: ["administrator"],
      },
      {
        title: "System Audit",
        url: "/audit",
        icon: "Eye",
        requiredPermissions: ["users:read"],
        requiredRoles: ["administrator", "manager"],
      },
      {
        title: "Profile",
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
