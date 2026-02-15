import { parkingService } from "@/lib/features/parking/service";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, AlertTriangle } from "lucide-react";

export default async function ParkingLotPage() {
  const t = await getTranslations("ParkingLotPage");
  const [parkingSpaces, incidents] = await Promise.all([
    parkingService.getParkingSpaces().catch(() => []),
    parkingService.getIncidents().catch(() => []),
  ]);

  const occupiedSpaces = parkingSpaces.filter(
    (space: { status: string }) => space.status === "occupied",
  );
  const availableSpaces = parkingSpaces.filter(
    (space: { status: string }) => space.status === "available",
  );

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalSpaces")}
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingSpaces.length}</div>
            <p className="text-xs text-muted-foreground">
              {t("availableSpaces")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("occupied")}
            </CardTitle>
            <Car className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {occupiedSpaces.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("occupiedSpaces")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("available")}
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {availableSpaces.length}
            </div>
            <p className="text-xs text-muted-foreground">{t("freeSpaces")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("incidents")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground">
              {t("reportedIncidents")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("occupiedSpacesTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {occupiedSpaces
                .slice(0, 5)
                .map(
                  (space: {
                    id: string;
                    code: string;
                    vehiclePlate?: string;
                  }) => (
                    <div key={space.id} className="flex items-center space-x-4">
                      <Car className="h-4 w-4 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {t("space")} {space.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {space.vehiclePlate
                            ? `${space.vehiclePlate}`
                            : t("informationNotAvailable")}
                        </p>
                      </div>
                      <Badge variant="destructive">{t("occupied")}</Badge>
                    </div>
                  ),
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("recentIncidents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.slice(0, 5).map((incident) => (
                <div key={incident.id} className="flex items-center space-x-4">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t(`incidentTypes.${incident.type}`)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {incident.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      incident.status === "resolved" ? "default" : "destructive"
                    }
                  >
                    {t(`incidentStatuses.${incident.status}`)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
