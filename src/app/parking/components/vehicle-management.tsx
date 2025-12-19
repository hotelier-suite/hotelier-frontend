"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Vehicle {
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

interface VehicleManagementProps {
  vehicles: Vehicle[];
  onVehicleExit: (vehicleId: string) => void;
}

export default function VehicleManagement({
  vehicles,
  onVehicleExit,
}: VehicleManagementProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "parqueado":
        return <Badge className="bg-green-100 text-green-800">Parked</Badge>;
      case "salido":
        return <Badge className="bg-gray-100 text-gray-800">Exited</Badge>;
      case "bloqueado":
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGuestTypeBadge = (guestType: string) => {
    switch (guestType) {
      case "guest":
        return <Badge variant="default">Guest</Badge>;
      case "visitor":
        return <Badge variant="secondary">Visitor</Badge>;
      case "employee":
        return <Badge variant="outline">Employee</Badge>;
      default:
        return <Badge variant="outline">{guestType}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Management</CardTitle>
        <CardDescription>
          Parking lot vehicle control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>License Plate</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Space</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  {vehicle.licensePlate}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.color} • {vehicle.type}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{vehicle.owner}</p>
                    {vehicle.room && (
                      <p className="text-sm text-muted-foreground">
                        Room {vehicle.room}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getGuestTypeBadge(vehicle.guestType)}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {vehicle.assignedSpace || "N/A"}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {vehicle.status === "parqueado" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVehicleExit(vehicle.id)}
                      >
                        Register Exit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
