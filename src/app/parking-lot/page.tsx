import { parkingService } from "@/lib/features/parking/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, AlertTriangle } from "lucide-react";

export default async function ParkingOverviewPage() {
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Parking</h1>
        <p className="text-muted-foreground">
          Parking space and activity management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingSpaces.length}</div>
            <p className="text-xs text-muted-foreground">Available spaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Car className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {occupiedSpaces.length}
            </div>
            <p className="text-xs text-muted-foreground">Occupied spaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {availableSpaces.length}
            </div>
            <p className="text-xs text-muted-foreground">Free spaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground">Reported incidents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Occupied Spaces</CardTitle>
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
                          Space {space.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {space.vehiclePlate
                            ? `${space.vehiclePlate}`
                            : "Information not available"}
                        </p>
                      </div>
                      <Badge variant="destructive">Occupied</Badge>
                    </div>
                  ),
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.slice(0, 5).map((incident) => (
                <div key={incident.id} className="flex items-center space-x-4">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{incident.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {incident.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      incident.status === "resolved" ? "default" : "destructive"
                    }
                  >
                    {incident.status}
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
