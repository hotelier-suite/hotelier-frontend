// Analytics metric types (matching backend enum)
export type AnalyticsMetric =
  | "OCCUPANCY_RATE"
  | "REVENUE_PER_ROOM"
  | "CUSTOMER_SATISFACTION"
  | "AVERAGE_STAY_LENGTH"
  | "REPEAT_CUSTOMER_RATE"
  | "STAFF_EFFICIENCY";

// Analytics data type
export interface AnalyticsData {
  id: number;
  metric: AnalyticsMetric;
  value: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Filter parameters for analytics
export interface FindAnalyticsFilter {
  type?: AnalyticsMetric;
  startDate?: string;
  endDate?: string;
}

// Backend types (matching Prisma models)
export interface BackendOccupancyReport {
  id: number;
  date: string;
  availableRooms: number;
  occupiedRooms: number;
  occupancyPercentage: number;
  revenuePerRoom: number;
  totalRevenue: number;
  guests: number;
  averageStay: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendOperationalReport {
  id: number;
  date: string;
  department:
    | "FRONT_DESK"
    | "HOUSEKEEPING"
    | "RESTAURANT"
    | "MAINTENANCE"
    | "ACCOUNTING"
    | "MANAGEMENT"
    | "SECURITY";
  checkInsCompleted?: number;
  checkOutsCompleted?: number;
  averageCheckInTime?: string;
  roomsCleaned?: number;
  averageCleaningTime?: string;
  roomsOutOfOrder?: number;
  customersServed?: number;
  averageServiceTime?: string;
  averageSalesPerTable?: number;
  requestsHandled?: number;
  averageResponseTime?: string;
  pendingRequests?: number;
  customerSatisfaction: number;
  reportedIncidents: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendCustomerReport {
  id: number;
  date: string;
  segment: string;
  quantity: number;
  averageRevenue: number;
  averageStay: number;
  satisfaction: number;
  loyalty: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  createdAt: string;
  updatedAt: string;
}

// Frontend types
export interface OccupancyReport {
  id: string;
  date: string;
  availableRooms: number;
  occupiedRooms: number;
  occupancyPercentage: number;
  revenuePerRoom: number;
  totalRevenue: number;
  guests: number;
  averageStay: number;
}

export interface OperationalReport {
  id: string;
  date: string;
  department: string;
  checkInsCompleted?: number;
  checkOutsCompleted?: number;
  averageCheckInTime?: string;
  roomsCleaned?: number;
  averageCleaningTime?: string;
  roomsOutOfOrder?: number;
  customersServed?: number;
  averageServiceTime?: string;
  averageSalesPerTable?: number;
  requestsHandled?: number;
  averageResponseTime?: string;
  pendingRequests?: number;
  customerSatisfaction: number;
  reportedIncidents: number;
}

export interface CustomerReport {
  id: string;
  date: string;
  segment: string;
  quantity: number;
  averageRevenue: number;
  averageStay: number;
  satisfaction: number;
  loyalty: string;
}

export interface FinancialSummary {
  revenue: {
    room: number;
    restaurant: number;
    services: number;
    events: number;
    total: number;
  };
  expenses: number;
  grossProfit: number;
  profitMargin: number;
}

export interface ReportingDashboard {
  date: string;
  occupancy: OccupancyReport | null;
  operational: OperationalReport[];
  customer: CustomerReport[];
}

export interface OccupancyByMonth {
  date: string;
  occupancyPercentage: number;
  totalRevenue: number;
}

export interface MonthlyRevenueComparison {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}
