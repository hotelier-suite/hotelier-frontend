// Translations for Guest Requests

export const requestTypeTranslations = {
  TOWELS: "Towels",
  ROOM_SERVICE: "Room Service",
  MAINTENANCE: "Maintenance",
  HOUSEKEEPING: "Housekeeping",
  CONCIERGE: "Concierge",
  TECHNICAL_SUPPORT: "Technical Support",
  OTHER: "Other",
} as const;

export const requestStatusTranslations = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export const requestPriorityTranslations = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
} as const;

// Helper function to get translations
export const getRequestTypeTranslation = (type: string): string => {
  return (
    requestTypeTranslations[type as keyof typeof requestTypeTranslations] ||
    type
  );
};

export const getRequestStatusTranslation = (status: string): string => {
  return (
    requestStatusTranslations[
    status as keyof typeof requestStatusTranslations
    ] || status
  );
};

export const getRequestPriorityTranslation = (priority: string): string => {
  return (
    requestPriorityTranslations[
    priority as keyof typeof requestPriorityTranslations
    ] || priority
  );
};
