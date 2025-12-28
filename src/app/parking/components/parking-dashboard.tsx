"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, MapPin, Users } from "lucide-react";
import {
  parkingApi,
  Vehicle,
  ParkingSpace,
  ParkingIncident,
} from "@/lib/api/parking";
import { toast } from "sonner";
import VehicleManagement from "./vehicle-management";
import SpaceManagement from "./space-management";
import IncidentManagement from "./incident-management";
import VehicleRegistrationDialog from "./vehicle-registration-dialog";
import IncidentReportDialog from "./incident-report-dialog";

interface ParkingDashboardProps {
  initialVehicles: Vehicle[];
  initialSpaces: ParkingSpace[];
  initialIncidents: ParkingIncident[];
  onVehicleAdd: (vehicleData: {
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
  }) => void;
  onVehicleExit: (vehicleId: string) => void;
  onIncidentAdd: (incidentData: {
    type: string;
    description: string;
    vehicle: string;
    space: string;
    priority: string;
  }) => void;
}

export default function ParkingDashboard({
  initialVehicles,
  initialSpaces,
  initialIncidents,
  onVehicleAdd,
  onVehicleExit,
  onIncidentAdd,
}: ParkingDashboardProps) {
  const { hasRole } = useAuthContext();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [spaces, setSpaces] = useState(initialSpaces);
  const [incidents, setIncidents] = useState(initialIncidents);

  // Sync with props when they change
  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  useEffect(() => {
    setSpaces(initialSpaces);
  }, [initialSpaces]);

  useEffect(() => {
    setIncidents(initialIncidents);
  }, [initialIncidents]);

  const handleAddVehicle = (newVehicleData: {
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
    type: string;
    owner: string;
    room?: string;
    guestType: string;
    assignedSpace: string;
    notes?: string;
  }) => {
    // Call the parent function that handles persistence
    onVehicleAdd({
      ...newVehicleData,
      room: newVehicleData.room || "",
      notes: newVehicleData.notes || "",
    });
  };

  const handleVehicleExit = (vehicleId: string) => {
    // Call the parent function that handles persistence
    onVehicleExit(vehicleId);
  };

  const handleSpaceMaintenance = async (spaceId: string) => {
    try {
      // Update in the backend
      const updatedSpace = await parkingApi.updateParkingSpace(spaceId, {
        status: "maintenance",
      });

      // Update local state
      setSpaces(
        spaces.map((space) => (space.id === spaceId ? updatedSpace : space)),
      );

      toast.success("Space marked as under maintenance");
    } catch (error) {
      console.error("Error updating space status:", error);
      toast.error("Error updating space status");
    }
  };

  const handleSpaceEnable = async (spaceId: string) => {
    try {
      // Update in the backend
      const updatedSpace = await parkingApi.updateParkingSpace(spaceId, {
        status: "available",
      });

      // Update local state
      setSpaces(
        spaces.map((space) => (space.id === spaceId ? updatedSpace : space)),
      );

      toast.success("Space enabled successfully");
    } catch (error) {
      console.error("Error updating space status:", error);
      toast.error("Error updating space status");
    }
  };

  const handleAddIncident = (incidentData: {
    type: string;
    description: string;
    vehicle: string;
    space: string;
    priority: string;
  }) => {
    // Call the parent function that handles persistence
    onIncidentAdd(incidentData);
  };

  const handleAssignIncident = (incidentId: string) => {
    setIncidents(
      incidents.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: "in_progress" }
          : incident,
      ),
    );
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      const updatedIncident = await parkingApi.updateIncident(incidentId, {
        status: "resolved",
        resolvedAt: new Date().toISOString(),
      });

      setIncidents(
        incidents.map((incident) =>
          incident.id === incidentId ? updatedIncident : incident,
        ),
      );

      toast.success("Incident resolved successfully");
    } catch (error) {
      console.error("Error resolving incident:", error);
      toast.error("Error resolving incident");
    }
  };

  // Calculate stats
  const occupiedSpaces = spaces.filter((e) => e.status === "occupied").length;
  const availableSpaces = spaces.filter((e) => e.status === "available").length;
  const parkedVehicles = vehicles.filter((v) => v.status === "parked").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Parking Management</h1>
          <p className="text-muted-foreground">
            Vehicle, space and incident control
          </p>
        </div>
        <div className="flex space-x-2">
          {!hasRole("client") && (
            <IncidentReportDialog
              vehicles={vehicles}
              spaces={spaces}
              onIncidentAdd={handleAddIncident}
            />
          )}
          <VehicleRegistrationDialog
            spaces={spaces}
            onVehicleAdd={handleAddVehicle}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupied Spaces
            </CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedSpaces}</div>
            <p className="text-xs text-muted-foreground">
              Of {spaces.length} spaces
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Spaces
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableSpaces}</div>
            <p className="text-xs text-muted-foreground">Free now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vehicles Today
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkedVehicles}</div>
            <p className="text-xs text-muted-foreground">Currently parked</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="spaces">Spaces</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <VehicleManagement
            vehicles={vehicles}
            onVehicleExit={handleVehicleExit}
          />
        </TabsContent>

        <TabsContent value="spaces" className="space-y-4">
          <SpaceManagement
            spaces={spaces}
            onSpaceMaintenance={handleSpaceMaintenance}
            onSpaceEnable={handleSpaceEnable}
          />
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <IncidentManagement
            incidents={incidents}
            onAssignIncident={handleAssignIncident}
            onResolveIncident={handleResolveIncident}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
