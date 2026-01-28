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
import { Wrench, AlertTriangle } from "lucide-react";
import type { ParkingSpace } from "@/lib/features/parking/types";
import { useAuthContext } from "@/contexts/auth-context";

interface SpaceManagementProps {
  spaces: ParkingSpace[];
  onSpaceMaintenance: (spaceId: string) => void;
  onSpaceEnable: (spaceId: string) => void;
}

export default function SpaceManagement({
  spaces,
  onSpaceMaintenance,
  onSpaceEnable,
}: SpaceManagementProps) {
  const { hasRole } = useAuthContext();
  const getSpaceStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "occupied":
        return <Badge className="bg-red-100 text-red-800">Occupied</Badge>;
      case "reserved":
        return <Badge className="bg-blue-100 text-blue-800">Reserved</Badge>;
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Space Map</CardTitle>
        <CardDescription>Current status of parking spaces</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Current Vehicle</TableHead>
              <TableHead>Status</TableHead>
              {!hasRole("client") && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {spaces.map((space) => (
              <TableRow key={space.id}>
                <TableCell className="font-medium">{space.code}</TableCell>
                <TableCell>{space.zone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{space.type}</Badge>
                </TableCell>
                <TableCell>{space.location}</TableCell>
                <TableCell>
                  {space.currentVehicle ? (
                    <div className="font-medium">{space.currentVehicle}</div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{getSpaceStatusBadge(space.status)}</TableCell>
                {!hasRole("client") && (
                  <TableCell>
                    <div className="flex space-x-2">
                      {space.status === "maintenance" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSpaceEnable(space.id)}
                        >
                          <Wrench className="mr-2 h-4 w-4" />
                          Enable
                        </Button>
                      )}
                      {space.status === "available" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSpaceMaintenance(space.id)}
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Maintenance
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
