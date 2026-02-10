"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Clock, MapPin, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";

interface ParkingSpace {
  id: string;
  number: string;
  zone: string;
  type: "standard" | "premium" | "disability" | "electric";
  status: "available" | "occupied" | "reserved" | "maintenance";
  currentVehicle?: {
    licensePlate: string;
    owner: string;
    entryTime: string;
    room?: string;
  };
}

interface ParkingStatisticsProps {
  spaces: ParkingSpace[];
}

export function ParkingStatistics({ spaces }: ParkingStatisticsProps) {
  const t = useTranslations("ParkingStatistics");
  const occupiedSpaces = spaces.filter((s) => s.status === "occupied").length;
  const availableSpaces = spaces.filter((s) => s.status === "available").length;
  const occupancyRate =
    spaces.length > 0 ? (occupiedSpaces / spaces.length) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("totalSpaces")}
          </CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{spaces.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("occupied")}</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupiedSpaces}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("available")}
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableSpaces}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("occupancy")}
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
