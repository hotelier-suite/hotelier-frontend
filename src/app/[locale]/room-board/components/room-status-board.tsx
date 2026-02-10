"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
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
  const t = useTranslations("RoomStatusBoardComp");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
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
        return t("available");
      case "occupied":
        return t("occupied");
      case "cleaning":
        return t("housekeeping");
      case "maintenance":
        return t("maintenance");
      case "out_of_order":
        return t("outOfOrder");
      default:
        return t("unknown");
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
          { key: "all", label: t("all") },
          { key: "available", label: t("available") },
          { key: "occupied", label: t("occupied") },
          { key: "cleaning", label: t("housekeeping") },
          { key: "maintenance", label: t("maintenance") },
          { key: "out_of_order", label: t("outOfOrder") },
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
                <CardTitle className="text-lg">
                  {t("room")} {room.number}
                </CardTitle>
                <Badge
                  className={`${getStatusColor(room.status)} text-white flex items-center gap-1`}
                >
                  {getStatusIcon(room.status)}
                  {getStatusLabel(room.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(`roomTypes.${room.type}`)}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {room.status === "occupied" && room.currentReservation && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                  <div className="font-medium text-sm text-destructive">
                    {t("currentGuest")}
                  </div>
                  <div className="text-sm">{room.guestName}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("checkOut")}:{" "}
                    {room.checkOutDate
                      ? new Date(room.checkOutDate).toLocaleDateString(
                          intlLocale,
                        )
                      : t("notAvailable")}
                  </div>
                </div>
              )}

              {room.nextReservation && room.status !== "occupied" && (
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
                  <div className="font-medium text-sm text-primary">
                    {t("nextReservation")}
                  </div>
                  <div className="text-sm">
                    {room.nextReservation.guestName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("checkIn")}:{" "}
                    {new Date(
                      room.nextReservation.checkInDate,
                    ).toLocaleDateString(intlLocale)}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                {t("capacity")}: {room.capacity} {t("guests")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noRoomsMatch")}</p>
        </div>
      )}
    </>
  );
}
