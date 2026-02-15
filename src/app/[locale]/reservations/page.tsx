"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { type Reservation } from "@/lib/features/reservations/types";
import { reservationsService } from "@/lib/features/reservations/service";
import { type Room } from "@/lib/features/rooms/types";
import { roomsService } from "@/lib/features/rooms/service";
import { configurationService } from "@/lib/features/configuration/service";

import { Reservations } from "./components/reservations";

export default function ReservationsPage() {
  const t = useTranslations("ReservationsPage");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currency, setCurrency] = useState("COP");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservationsData, roomsData, hotelConfig] = await Promise.all([
          reservationsService.getAll(),
          roomsService.getAll(),
          configurationService
            .getHotelConfig()
            .catch(() => ({ currency: "COP" })),
        ]);

        setReservations(reservationsData);
        setRooms(roomsData);
        setCurrency((hotelConfig as { currency?: string })?.currency || "COP");
      } catch (error) {
        console.error("Error fetching reservations data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("loadingReservationsData")}
          </p>
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Reservations
        initialReservations={reservations}
        rooms={rooms}
        currencyCode={currency}
      />
    </div>
  );
}
