// Translations for staff module

export const positionTranslations = {
  // Housekeeping positions
  "Room Attendant": "Room Attendant",
  "Housekeeping Supervisor": "Housekeeping Supervisor",
  Housekeeper: "Housekeeper",

  // Front Desk positions
  "Front Desk Agent": "Front Desk Agent",
  "Front Desk Manager": "Front Desk Manager",

  // Maintenance positions
  "Maintenance Technician": "Maintenance Technician",
  "Maintenance Manager": "Maintenance Manager",
  Electrician: "Electrician",
  Plumber: "Plumber",

  // Security positions
  "Security Guard": "Security Guard",
  "Security Manager": "Security Manager",

  // Restaurant positions
  Waitress: "Waitress",
  Waiter: "Waiter",
  Chef: "Chef",
  Cook: "Cook",
  Bartender: "Bartender",
  Server: "Server",

  // Management positions
  "General Manager": "General Manager",
  "Assistant Manager": "Assistant Manager",
  Supervisor: "Supervisor",
} as const;

export const departmentTranslations = {
  // Departments
  HOUSEKEEPING: "Housekeeping",
  MAINTENANCE: "Maintenance",
  SECURITY: "Security",
  RESTAURANT: "Restaurant",
  KITCHEN: "Kitchen",
  BAR: "Bar",
  MANAGEMENT: "Management",
  ADMINISTRATION: "Administration",
  SALES: "Sales",
  LAUNDRY: "Laundry",
  PARKING: "Parking",
} as const;

export const shiftTranslations = {
  // Shifts
  Morning: "Morning",
  Day: "Day",
  Evening: "Evening",
  Night: "Night",
  "Full Time": "Full Time",
  "Part Time": "Part Time",
  Weekend: "Weekend",
  Split: "Split",
} as const;

export const statusTranslations = {
  // Status
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ON_LEAVE: "On Leave",
  SICK_LEAVE: "Sick Leave",
  TERMINATED: "Terminated",
  SUSPENDED: "Suspended",
} as const;

export const shiftStatusTranslations = {
  // Shift Status
  SCHEDULED: "Scheduled",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
} as const;
