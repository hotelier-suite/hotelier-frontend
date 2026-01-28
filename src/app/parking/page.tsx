"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { parkingService } from "@/lib/features/parking/service";
import type {
  Vehicle,
  ParkingSpace,
  ParkingIncident,
} from "@/lib/features/parking/types";
import { toast } from "sonner";
import ParkingDashboard from "./components/parking-dashboard";

export default function ParkingPage() {
  const { user, isLoading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [incidents, setIncidents] = useState<ParkingIncident[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehiclesData, spacesData, incidentsData] = await Promise.all([
        parkingService.getVehicles().catch((err) => {
          console.warn("Failed to fetch vehicles:", err);
          return [];
        }),
        parkingService.getParkingSpaces().catch((err) => {
          console.warn("Failed to fetch spaces:", err);
          return [];
        }),
        parkingService.getIncidents().catch((err) => {
          console.warn("Failed to fetch incidents:", err);
          return [];
        }),
      ]);

      setVehicles(vehiclesData);
      setSpaces(spacesData);
      setIncidents(incidentsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching parking data:", error);
      setError("Error loading parking data");
      toast.error("Error loading parking data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    fetchData();
  }, [user, authLoading]);

  const handleAddVehicle = async (newVehicleData: {
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
    type: string;
    owner: string;
    room: string;
    guestType: string;
    assignedSpace: string;
    notes: string;
  }) => {
    try {
      // Create the vehicle in the backend
      const createdVehicle = await parkingService.createVehicle({
        licensePlate: newVehicleData.licensePlate.toUpperCase(),
        brand: newVehicleData.brand,
        model: newVehicleData.model,
        color: newVehicleData.color,
        type: newVehicleData.type,
        owner: newVehicleData.owner,
        room: newVehicleData.room || undefined,
        guestType: newVehicleData.guestType,
        assignedSpace: newVehicleData.assignedSpace,
        notes: newVehicleData.notes || undefined,
      });

      // Update local state
      setVehicles((prev) => [...prev, createdVehicle]);

      // Update the occupied space status
      setSpaces((prev) =>
        prev.map((space) =>
          space.code === newVehicleData.assignedSpace
            ? {
                ...space,
                status: "occupied",
                currentVehicle: newVehicleData.licensePlate.toUpperCase(),
              }
            : space,
        ),
      );

      toast.success("Vehicle registered successfully");
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast.error("Error registering the vehicle");
    }
  };

  const handleVehicleExit = async (vehicleId: string) => {
    try {
      await parkingService.checkOutVehicle(vehicleId);

      // Update local state
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === vehicleId
            ? {
                ...vehicle,
                status: "exited",
                exitTime: new Date()
                  .toISOString()
                  .slice(0, 16)
                  .replace("T", " "),
              }
            : vehicle,
        ),
      );

      // Free the space
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      if (vehicle?.assignedSpace) {
        setSpaces((prev) =>
          prev.map((space) =>
            space.code === vehicle.assignedSpace
              ? { ...space, status: "available", currentVehicle: undefined }
              : space,
          ),
        );
      }

      toast.success("Vehicle exit registered");
    } catch (error) {
      console.error("Error checking out vehicle:", error);
      toast.error("Error registering the vehicle exit");
    }
  };

  const handleAddIncident = async (incidentData: {
    type: string;
    description: string;
    vehicle: string;
    space: string;
    priority: string;
  }) => {
    try {
      const createdIncident = await parkingService.createIncident({
        type: incidentData.type,
        description: incidentData.description,
        vehicle: incidentData.vehicle || undefined,
        space: incidentData.space || undefined,
        priority: incidentData.priority,
        responsible: user?.name || "Current User",
      });

      setIncidents((prev) => [...prev, createdIncident]);
      toast.success("Incident reported successfully");
    } catch (error) {
      console.error("Error creating incident:", error);
      toast.error("Error reporting the incident");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading parking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ParkingDashboard
      initialVehicles={vehicles}
      initialSpaces={spaces}
      initialIncidents={incidents}
      onVehicleAdd={handleAddVehicle}
      onVehicleExit={handleVehicleExit}
      onIncidentAdd={handleAddIncident}
    />
  );
}
