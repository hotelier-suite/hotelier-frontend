"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Users, Wrench, Sparkles, AlertCircle } from "lucide-react";
import { type Room } from "@/lib/features/rooms/types";
import { type Reservation } from "@/lib/features/reservations/types";

interface RoomWithStatus extends Room {
  currentReservation?: Reservation;
  status:
    | "available"
    | "occupied"
    | "cleaning"
    | "maintenance"
    | "out_of_order";
  guestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  nextReservation?: {
    guestName: string;
    checkInDate: string;
  };
}

interface RoomStatusBoardProps {
  initialRooms: RoomWithStatus[];
  statusCounts: {
    total: number;
    available: number;
    occupied: number;
    cleaning: number;
    maintenance: number;
    out_of_order: number;
  };
}

export function RoomStatusBoard({ initialRooms }: RoomStatusBoardProps) {
  const [rooms] = useState<RoomWithStatus[]>(initialRooms);
  const [filter, setFilter] = useState<string>("all");

  const getStatusColor = (status: RoomWithStatus["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600";
      case "occupied":
        return "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600";
      case "cleaning":
        return "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600";
      case "maintenance":
        return "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600";
      case "out_of_order":
        return "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600";
      default:
        return "bg-gray-400 hover:bg-gray-500 dark:bg-gray-400 dark:hover:bg-gray-500";
    }
  };

  const getStatusIcon = (status: RoomWithStatus["status"]) => {
    switch (status) {
      case "available":
        return <Bed className="h-4 w-4" />;
      case "occupied":
        return <Users className="h-4 w-4" />;
      case "cleaning":
        return <Sparkles className="h-4 w-4" />;
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      case "out_of_order":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bed className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: RoomWithStatus["status"]) => {
    switch (status) {
      case "available":
        return "Available";
      case "occupied":
        return "Occupied";
      case "cleaning":
        return "Housekeeping";
      case "maintenance":
        return "Maintenance";
      case "out_of_order":
        return "Out of Order";
      default:
        return "Unknown";
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    return room.status === filter;
  });

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "available", label: "Available" },
          { key: "occupied", label: "Occupied" },
          { key: "cleaning", label: "Housekeeping" },
          { key: "maintenance", label: "Maintenance" },
          { key: "out_of_order", label: "Out of Order" },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
            size="sm"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Room {room.number}</CardTitle>
                <Badge
                  className={`${getStatusColor(room.status)} text-white flex items-center gap-1`}
                >
                  {getStatusIcon(room.status)}
                  {getStatusLabel(room.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {room.type.toLowerCase()}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {room.status === "occupied" && room.currentReservation && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                  <div className="font-medium text-sm text-destructive">
                    Current guest:
                  </div>
                  <div className="text-sm">{room.guestName}</div>
                  <div className="text-xs text-muted-foreground">
                    Check-out:{" "}
                    {room.checkOutDate
                      ? new Date(room.checkOutDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              )}

              {room.nextReservation && room.status !== "occupied" && (
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
                  <div className="font-medium text-sm text-primary">
                    Next reservation:
                  </div>
                  <div className="text-sm">
                    {room.nextReservation.guestName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Check-in:{" "}
                    {new Date(
                      room.nextReservation.checkInDate,
                    ).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Capacity: {room.capacity} guests
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No rooms match the selected filter.
          </p>
        </div>
      )}
    </>
  );
}
