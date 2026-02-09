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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("SpaceManagement");
  const { hasRole } = useAuthContext();
  const getSpaceStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("statusAvailable")}
          </Badge>
        );
      case "occupied":
        return (
          <Badge className="bg-red-100 text-red-800">
            {t("statusOccupied")}
          </Badge>
        );
      case "reserved":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {t("statusReserved")}
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("statusMaintenance")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
              <TableHead>{t("code")}</TableHead>
              <TableHead>{t("zone")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("location")}</TableHead>
              <TableHead>{t("currentVehicle")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              {!hasRole("client") && <TableHead>{t("actions")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {spaces.map((space) => (
              <TableRow key={space.id}>
                <TableCell className="font-medium">{space.code}</TableCell>
                <TableCell>{space.zone}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {t(`spaceTypes.${space.type}`)}
                  </Badge>
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
                          {t("enable")}
                        </Button>
                      )}
                      {space.status === "available" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSpaceMaintenance(space.id)}
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          {t("maintenance")}
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
