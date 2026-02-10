// Parking types

// Backend types (matching Prisma models)
export interface BackendVehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  type: "CAR" | "MOTORCYCLE" | "VAN" | "TRUCK" | "OTHER";
  owner: string;
  room?: string;
  guestType: "GUEST" | "VISITOR" | "EMPLOYEE" | "SUPPLIER" | "OTHER";
  assignedSpace?: string;
  entryTime: string;
  exitTime?: string;
  status: "PARKED" | "EXITED" | "BLOCKED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  space?: BackendParkingSpace;
  incidents?: BackendParkingIncident[];
}

export interface BackendParkingSpace {
  id: number;
  code: string;
  zone: string;
  type: "GUEST" | "VISITOR" | "EMPLOYEE" | "LOADING" | "DISABLED" | "VIP";
  status:
    | "AVAILABLE"
    | "OCCUPIED"
    | "RESERVED"
    | "MAINTENANCE"
    | "OUT_OF_ORDER";
  currentVehicle?: string;
  hourlyRate: number;
  location: string;
  createdAt: string;
  updatedAt: string;
  vehicles?: BackendVehicle[];
  incidents?: BackendParkingIncident[];
}

export interface BackendParkingIncident {
  id: number;
  type:
    | "VEHICLE_DAMAGE"
    | "INFRASTRUCTURE"
    | "SECURITY"
    | "ACCIDENT"
    | "THEFT"
    | "OTHER";
  description: string;
  vehicleId?: number;
  spaceId?: number;
  reportDate: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  responsible: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: BackendVehicle;
  space?: BackendParkingSpace;
}

// Frontend types (matching frontend UI expectations)
export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  type: string;
  owner: string;
  room?: string;
  guestType: string;
  assignedSpace?: string;
  entryTime: string;
  exitTime?: string;
  status: string;
  notes?: string;
}

export interface ParkingSpace {
  id: string;
  code: string;
  zone: string;
  type: string;
  status: string;
  currentVehicle?: string;
  hourlyRate: number;
  location: string;
}

export interface ParkingIncident {
  id: string;
  type: string;
  description: string;
  vehicle?: string;
  space?: string;
  reportDate: string;
  status: string;
  responsible: string;
  priority: string;
  resolution?: string;
  resolvedAt?: string;
}

export interface ParkingStatistics {
  totalSpaces: number;
  occupiedSpaces: number;
  availableSpaces: number;
  maintenanceSpaces: number;
  occupancyRate: number;
  totalVehicles: number;
  parkedVehicles: number;
  pendingIncidents: number;
}

export interface VehicleFilters {
  status?: string;
  guestType?: string;
}

export interface CreateVehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  type: string;
  owner: string;
  room?: string;
  guestType: string;
  assignedSpace?: string;
  notes?: string;
}

export interface CreateIncidentData {
  type: string;
  description: string;
  vehicle?: string;
  space?: string;
  priority: string;
  responsible: string;
}

export interface UpdateIncidentData {
  status?: string;
  resolution?: string;
  resolvedAt?: string;
}
