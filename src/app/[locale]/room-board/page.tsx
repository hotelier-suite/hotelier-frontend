"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { type Room } from "@/lib/features/rooms/types";
import { roomsService } from "@/lib/features/rooms/service";
import { type Reservation } from "@/lib/features/reservations/types";
import { reservationsService } from "@/lib/features/reservations/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Users, Sparkles, Wrench, AlertCircle } from "lucide-react";
import { RoomStatusBoard } from "./components/room-status-board";

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

export default function RoomBoardPage() {
  const t = useTranslations("RoomBoardPageComp");
  const { user, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const [roomsWithStatus, setRoomsWithStatus] = useState<RoomWithStatus[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    cleaning: 0,
    maintenance: 0,
    out_of_order: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || authLoading) {
        setLoading(false);
        return;
      }

      try {
        const [roomsData, reservationsData] = await Promise.all([
          roomsService.getAll(),
          reservationsService.getAll(),
        ]);

        const processedRoomsWithStatus = roomsData.map(
          (room): RoomWithStatus => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of day for comparison

            // Find current reservation (checked in)
            const checkedInReservation = reservationsData.find(
              (r) => r.roomId === room.id && r.status === "CHECKED_IN",
            );

            // Find confirmed reservation for today or ongoing
            const confirmedReservationToday = reservationsData.find((r) => {
              if (r.roomId !== room.id || r.status !== "CONFIRMED")
                return false;

              const checkIn = new Date(r.checkInDate);
              const checkOut = new Date(r.checkOutDate);
              checkIn.setHours(0, 0, 0, 0);
              checkOut.setHours(0, 0, 0, 0);

              // Room is occupied if today is between check-in and check-out dates (inclusive)
              return today >= checkIn && today < checkOut;
            });

            // Current reservation is either checked in or confirmed for today
            const currentReservation =
              checkedInReservation || confirmedReservationToday;

            // Find next reservation (confirmed for future dates)
            const nextReservation = reservationsData
              .filter(
                (r) =>
                  r.roomId === room.id &&
                  r.status === "CONFIRMED" &&
                  new Date(r.checkInDate) > today,
              )
              .sort(
                (a, b) =>
                  new Date(a.checkInDate).getTime() -
                  new Date(b.checkInDate).getTime(),
              )[0];

            let status: RoomWithStatus["status"] = "available";

            // First check for reservations (this takes priority over isAvailable)
            if (currentReservation) {
              status = "occupied";
            } else if (!room.isAvailable) {
              // Only mark as out of order if there's no current reservation
              status = "out_of_order";
            } else if (room.type.includes("CLEAN")) {
              status = "cleaning";
            } else if (room.type.includes("MAINTENANCE")) {
              status = "maintenance";
            }

            return {
              ...room,
              currentReservation,
              status,
              guestName: currentReservation?.guestName,
              checkInDate: currentReservation?.checkInDate,
              checkOutDate: currentReservation?.checkOutDate,
              nextReservation: nextReservation
                ? {
                    guestName: nextReservation.guestName || t("noName"),
                    checkInDate: nextReservation.checkInDate,
                  }
                : undefined,
            };
          },
        );

        const calculatedStatusCounts = {
          total: processedRoomsWithStatus.length,
          available: processedRoomsWithStatus.filter(
            (r) => r.status === "available",
          ).length,
          occupied: processedRoomsWithStatus.filter(
            (r) => r.status === "occupied",
          ).length,
          cleaning: processedRoomsWithStatus.filter(
            (r) => r.status === "cleaning",
          ).length,
          maintenance: processedRoomsWithStatus.filter(
            (r) => r.status === "maintenance",
          ).length,
          out_of_order: processedRoomsWithStatus.filter(
            (r) => r.status === "out_of_order",
          ).length,
        };

        // Set a room to cleaning status
        if (processedRoomsWithStatus.length > 0) {
          const firstAvailableRoom = processedRoomsWithStatus.find(
            (room) => room.status === "available",
          );
          if (firstAvailableRoom) {
            firstAvailableRoom.status = "cleaning";
            // Recalculate counters
            calculatedStatusCounts.available--;
            calculatedStatusCounts.cleaning++;
          }
        }

        setRoomsWithStatus(processedRoomsWithStatus);
        setStatusCounts(calculatedStatusCounts);
      } catch (error) {
        console.error("Error fetching rooms data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, t]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("loadingRoomStatus")}</p>
        </div>
        <div className="animate-pulse bg-muted h-96 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("available")}
            </CardTitle>
            <Bed className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {statusCounts.available}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("readyForGuests")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("occupied")}
            </CardTitle>
            <Users className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {statusCounts.occupied}
            </div>
            <p className="text-xs text-muted-foreground">{t("withGuests")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("housekeeping")}
            </CardTitle>
            <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {statusCounts.cleaning}
            </div>
            <p className="text-xs text-muted-foreground">{t("inProgress")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("maintenance")}
            </CardTitle>
            <Wrench className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {statusCounts.maintenance}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("requiresAttention")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("outOfService")}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {statusCounts.out_of_order}
            </div>
            <p className="text-xs text-muted-foreground">{t("unavailable")}</p>
          </CardContent>
        </Card>
      </div>

      <RoomStatusBoard
        initialRooms={roomsWithStatus}
        statusCounts={statusCounts}
      />
    </div>
  );
}
