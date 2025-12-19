"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { reservationsApi, type Reservation } from "@/lib/api/reservations";
import { roomsApi, type Room } from "@/lib/api/rooms";
import { configurationApi } from "@/lib/api/configuration";

import { Reservations } from "./components/reservations";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currency, setCurrency] = useState("COP");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservationsData, roomsData, hotelConfig] = await Promise.all([
          reservationsApi.getAll(),
          roomsApi.getAll(),
          configurationApi.getHotelConfig().catch(() => ({ currency: "COP" })),
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
          <h1 className="text-2xl font-bold">Reservations</h1>
          <p className="text-muted-foreground">Loading reservations data...</p>
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reservations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <Reservations
          initialReservations={reservations}
          rooms={rooms}
          currencyCode={currency}
        />
      </div>
    </>
  );
}
