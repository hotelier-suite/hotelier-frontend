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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("VehicleManagement");
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "parqueado":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("statusParked")}
          </Badge>
        );
      case "salido":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {t("statusExited")}
          </Badge>
        );
      case "bloqueado":
        return (
          <Badge className="bg-red-100 text-red-800">
            {t("statusBlocked")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGuestTypeBadge = (guestType: string) => {
    switch (guestType) {
      case "guest":
        return <Badge variant="default">{t("guestTypeGuest")}</Badge>;
      case "visitor":
        return <Badge variant="secondary">{t("guestTypeVisitor")}</Badge>;
      case "employee":
        return <Badge variant="outline">{t("guestTypeEmployee")}</Badge>;
      default:
        return <Badge variant="outline">{guestType}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("licensePlate")}</TableHead>
              <TableHead>{t("vehicle")}</TableHead>
              <TableHead>{t("owner")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("space")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
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
                      {vehicle.color} • {t(`vehicleTypes.${vehicle.type}`)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{vehicle.owner}</p>
                    {vehicle.room && (
                      <p className="text-sm text-muted-foreground">
                        {t("room")} {vehicle.room}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getGuestTypeBadge(vehicle.guestType)}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {vehicle.assignedSpace || t("notAvailable")}
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
                        {t("registerExit")}
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
