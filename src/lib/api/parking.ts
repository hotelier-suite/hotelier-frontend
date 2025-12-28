import { apiRequest } from "./base";

// Backend types (matching Prisma models)
interface BackendVehicle {
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

interface BackendParkingSpace {
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

interface BackendParkingIncident {
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

// Transform functions to convert backend data to frontend format
function transformVehicle(backendVehicle: BackendVehicle): Vehicle {
  return {
    id: backendVehicle.id.toString(),
    licensePlate: backendVehicle.licensePlate,
    brand: backendVehicle.brand,
    model: backendVehicle.model,
    color: backendVehicle.color,
    type: getVehicleTypeLabel(backendVehicle.type),
    owner: backendVehicle.owner,
    room: backendVehicle.room,
    guestType: getGuestTypeLabel(backendVehicle.guestType),
    assignedSpace: backendVehicle.assignedSpace,
    entryTime:
      backendVehicle.entryTime.split("T")[0] +
      " " +
      backendVehicle.entryTime.split("T")[1].split(".")[0],
    exitTime: backendVehicle.exitTime
      ? backendVehicle.exitTime.split("T")[0] +
        " " +
        backendVehicle.exitTime.split("T")[1].split(".")[0]
      : undefined,
    status: getVehicleStatusLabel(backendVehicle.status),
    notes: backendVehicle.notes,
  };
}

function transformParkingSpace(
  backendSpace: BackendParkingSpace,
): ParkingSpace {
  return {
    id: backendSpace.id.toString(),
    code: backendSpace.code,
    zone: backendSpace.zone,
    type: getSpaceTypeLabel(backendSpace.type),
    status: getSpaceStatusLabel(backendSpace.status),
    currentVehicle: backendSpace.currentVehicle,
    hourlyRate: backendSpace.hourlyRate,
    location: backendSpace.location,
  };
}

function transformParkingIncident(
  backendIncident: BackendParkingIncident,
): ParkingIncident {
  return {
    id: backendIncident.id.toString(),
    type: getIncidentTypeLabel(backendIncident.type),
    description: backendIncident.description,
    vehicle: backendIncident.vehicle?.licensePlate,
    space: backendIncident.space?.code,
    reportDate: backendIncident.reportDate.split("T")[0],
    status: getIncidentStatusLabel(backendIncident.status),
    responsible: backendIncident.responsible,
    priority: getPriorityLabel(backendIncident.priority),
    resolution: backendIncident.resolution,
    resolvedAt: backendIncident.resolvedAt
      ? backendIncident.resolvedAt.split("T")[0]
      : undefined,
  };
}

// Label helper functions
function getVehicleTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    CAR: "Car",
    MOTORCYCLE: "Motorcycle",
    VAN: "Van",
    TRUCK: "Truck",
    OTHER: "Other",
  };
  return typeMap[type] || type;
}

function getGuestTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    GUEST: "guest",
    VISITOR: "visitor",
    EMPLOYEE: "employee",
    SUPPLIER: "supplier",
    OTHER: "other",
  };
  return typeMap[type] || type.toLowerCase();
}

function getVehicleStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PARKED: "parked",
    EXITED: "exited",
    BLOCKED: "blocked",
  };
  return statusMap[status] || status.toLowerCase();
}

function getSpaceTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    GUEST: "Guests",
    VISITOR: "Visitors",
    EMPLOYEE: "Employees",
    LOADING: "Loading/Unloading",
    DISABLED: "Disabled",
    VIP: "VIP",
  };
  return typeMap[type] || type;
}

function getSpaceStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    AVAILABLE: "available",
    OCCUPIED: "occupied",
    RESERVED: "reserved",
    MAINTENANCE: "maintenance",
    OUT_OF_ORDER: "out_of_order",
  };
  return statusMap[status] || status.toLowerCase();
}

function getIncidentTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    VEHICLE_DAMAGE: "Vehicle Damage",
    INFRASTRUCTURE: "Infrastructure",
    SECURITY: "Security",
    ACCIDENT: "Accident",
    THEFT: "Theft",
    OTHER: "Other",
  };
  return typeMap[type] || type;
}

function getIncidentStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    RESOLVED: "resolved",
    CANCELLED: "cancelled",
  };
  return statusMap[status] || status.toLowerCase();
}

function getPriorityLabel(priority: string): string {
  const priorityMap: Record<string, string> = {
    LOW: "low",
    NORMAL: "medium",
    HIGH: "high",
    URGENT: "urgent",
  };
  return priorityMap[priority] || priority.toLowerCase();
}

export const parkingApi = {
  // Vehicle management
  getVehicles: async (filters?: {
    status?: string;
    guestType?: string;
  }): Promise<Vehicle[]> => {
    const params = new URLSearchParams();
    if (filters?.status) {
      const statusMap: Record<string, string> = {
        parked: "PARKED",
        exited: "EXITED",
        blocked: "BLOCKED",
      };
      params.append(
        "status",
        statusMap[filters.status] || filters.status.toUpperCase(),
      );
    }
    if (filters?.guestType) {
      const typeMap: Record<string, string> = {
        guest: "GUEST",
        visitor: "VISITOR",
        employee: "EMPLOYEE",
        supplier: "SUPPLIER",
        other: "OTHER",
      };
      params.append(
        "guestType",
        typeMap[filters.guestType] || filters.guestType.toUpperCase(),
      );
    }
    const queryString = params.toString();
    const url = queryString
      ? `/parking/vehicles?${queryString}`
      : "/parking/vehicles";
    const backendVehicles = (await apiRequest(url)) as BackendVehicle[];
    return backendVehicles.map(transformVehicle);
  },

  getVehiclesByStatus: async (status: string): Promise<Vehicle[]> => {
    return parkingApi.getVehicles({ status });
  },

  getVehiclesByGuestType: async (guestType: string): Promise<Vehicle[]> => {
    return parkingApi.getVehicles({ guestType });
  },

  createVehicle: async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    // Map frontend types to backend
    const typeMap: Record<string, string> = {
      Car: "CAR",
      Motorcycle: "MOTORCYCLE",
      Van: "VAN",
      Truck: "TRUCK",
      Other: "OTHER",
    };

    const guestTypeMap: Record<string, string> = {
      guest: "GUEST",
      visitor: "VISITOR",
      employee: "EMPLOYEE",
    };

    const backendData = {
      licensePlate: vehicleData.licensePlate,
      brand: vehicleData.brand,
      model: vehicleData.model,
      color: vehicleData.color,
      type: typeMap[vehicleData.type || ""] || "OTHER",
      owner: vehicleData.owner,
      room: vehicleData.room || undefined,
      guestType: guestTypeMap[vehicleData.guestType || ""] || "VISITOR",
      assignedSpace: vehicleData.assignedSpace,
      notes: vehicleData.notes || undefined,
    };

    const backendVehicle = (await apiRequest("/parking/vehicles", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendVehicle;

    return transformVehicle(backendVehicle);
  },

  checkOutVehicle: async (id: string): Promise<Vehicle> => {
    const backendVehicle = (await apiRequest(
      `/parking/vehicles/${id}/checkout`,
      {
        method: "PATCH",
      },
    )) as BackendVehicle;

    return transformVehicle(backendVehicle);
  },

  // Parking space management
  getParkingSpaces: async (): Promise<ParkingSpace[]> => {
    const backendSpaces = (await apiRequest(
      "/parking/spaces",
    )) as BackendParkingSpace[];
    return backendSpaces.map(transformParkingSpace);
  },

  getAvailableSpaces: async (): Promise<ParkingSpace[]> => {
    const backendSpaces = (await apiRequest(
      "/parking/spaces?status=AVAILABLE",
    )) as BackendParkingSpace[];
    return backendSpaces.map(transformParkingSpace);
  },

  getSpacesByType: async (type: string): Promise<ParkingSpace[]> => {
    const typeMap: Record<string, string> = {
      Guests: "GUEST",
      Visitors: "VISITOR",
      Employees: "EMPLOYEE",
      "Loading/Unloading": "LOADING",
      Disabled: "DISABLED",
      VIP: "VIP",
    };
    const backendType = typeMap[type] || type.toUpperCase();
    const backendSpaces = (await apiRequest(
      `/parking/spaces?type=${backendType}`,
    )) as BackendParkingSpace[];
    return backendSpaces.map(transformParkingSpace);
  },

  getSpacesByZone: async (zone: string): Promise<ParkingSpace[]> => {
    const backendSpaces = (await apiRequest(
      `/parking/spaces?zone=${zone}`,
    )) as BackendParkingSpace[];
    return backendSpaces.map(transformParkingSpace);
  },

  updateParkingSpace: async (
    id: string,
    updates: { status?: string },
  ): Promise<ParkingSpace> => {
    const statusMap: Record<string, string> = {
      available: "AVAILABLE",
      occupied: "OCCUPIED",
      reserved: "RESERVED",
      maintenance: "MAINTENANCE",
      out_of_service: "OUT_OF_ORDER",
    };

    const backendData: { status?: string } = {};
    if (updates.status) {
      backendData.status =
        statusMap[updates.status] || updates.status.toUpperCase();
    }

    const backendSpace = (await apiRequest(`/parking/spaces/${id}`, {
      method: "PATCH",
      body: JSON.stringify(backendData),
    })) as BackendParkingSpace;

    return transformParkingSpace(backendSpace);
  },

  // Incident management
  getIncidents: async (): Promise<ParkingIncident[]> => {
    const backendIncidents = (await apiRequest(
      "/parking/incidents",
    )) as BackendParkingIncident[];
    return backendIncidents.map(transformParkingIncident);
  },

  getIncidentsByStatus: async (status: string): Promise<ParkingIncident[]> => {
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      in_progress: "IN_PROGRESS",
      resolved: "RESOLVED",
      cancelled: "CANCELLED",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const backendIncidents = (await apiRequest(
      `/parking/incidents?status=${backendStatus}`,
    )) as BackendParkingIncident[];
    return backendIncidents.map(transformParkingIncident);
  },

  createIncident: async (incidentData: {
    type: string;
    description: string;
    vehicle?: string;
    space?: string;
    priority: string;
    responsible: string;
  }): Promise<ParkingIncident> => {
    // Map frontend types to backend
    const typeMap: Record<string, string> = {
      "Vehicle Damage": "VEHICLE_DAMAGE",
      Infrastructure: "INFRASTRUCTURE",
      Security: "SECURITY",
      Accident: "ACCIDENT",
      Theft: "THEFT",
      Cleaning: "OTHER",
      Other: "OTHER",
    };

    // Search for vehicle by license plate if specified
    let vehicleId: number | undefined;
    if (incidentData.vehicle) {
      try {
        const vehicles = (await apiRequest(
          "/parking/vehicles",
        )) as BackendVehicle[];
        const vehicle = vehicles.find(
          (v) => v.licensePlate === incidentData.vehicle,
        );
        vehicleId = vehicle?.id;
      } catch (error) {
        console.warn("Could not find vehicle:", error);
      }
    }

    // Search for space by code if specified
    let spaceId: number | undefined;
    if (incidentData.space) {
      try {
        const spaces = (await apiRequest(
          "/parking/spaces",
        )) as BackendParkingSpace[];
        const space = spaces.find((s) => s.code === incidentData.space);
        spaceId = space?.id;
      } catch (error) {
        console.warn("Could not find space:", error);
      }
    }

    const backendData = {
      type: typeMap[incidentData.type] || "OTHER",
      description: incidentData.description,
      responsible: incidentData.responsible,
      vehicleId: vehicleId,
      spaceId: spaceId,
    };

    const backendIncident = (await apiRequest("/parking/incidents", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendParkingIncident;

    return transformParkingIncident(backendIncident);
  },

  updateIncident: async (
    id: string,
    updates: {
      status?: string;
      resolution?: string;
      resolvedAt?: string;
    },
  ): Promise<ParkingIncident> => {
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      in_progress: "IN_PROGRESS",
      resolved: "RESOLVED",
      cancelled: "CANCELLED",
    };

    const backendData: {
      status?: string;
      resolution?: string;
      resolvedAt?: string;
    } = {};

    if (updates.status) {
      backendData.status =
        statusMap[updates.status] || updates.status.toUpperCase();
    }
    if (updates.resolution) {
      backendData.resolution = updates.resolution;
    }
    if (updates.resolvedAt) {
      backendData.resolvedAt = updates.resolvedAt;
    }

    const backendIncident = (await apiRequest(`/parking/incidents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(backendData),
    })) as BackendParkingIncident;

    return transformParkingIncident(backendIncident);
  },
};
