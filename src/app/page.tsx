"use client";

import { useEffect, useState } from "react";
import {
  reservationsApi,
  type Reservation as ApiReservation,
} from "@/lib/api/reservations";
import { roomsApi, type Room as ApiRoom } from "@/lib/api/rooms";
import { reportsApi } from "@/lib/api/reports";
import { StatsGrid } from "./components/stats-grid";
import { RecentActivities } from "./components/recent-activities";
import { UpcomingEvents } from "./components/upcoming-events";
import { OccupancyChart } from "./components/occupancy-chart";
import { RevenueChart } from "./reports/components/revenue-chart";
import { QuickActions } from "./components/quick-actions";

interface Reservation {
  id: number;
  status: string;
  checkInDate: string;
  checkOutDate: string;
  guestName?: string;
  guests?: number;
  totalAmount?: number;
  createdAt: string;
  room?: { number: string };
}

// Using the proper Room type from API

export default function Dashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<
    Array<{ month: string; revenue: number; expenses: number; profit: number }>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const [reservationsData, roomsData, revenueData] = await Promise.all([
          reservationsApi.getAll().catch(() => [] as ApiReservation[]),
          roomsApi.getAll().catch(() => []),
          reportsApi.getMonthlyRevenueComparison(currentYear).catch(() => []),
        ]);
        // Coerce API reservation id to number for local calculations
        const normalized = reservationsData.map((r) => ({
          ...r,
          id: typeof r.id === "string" ? parseInt(r.id, 10) : r.id,
        })) as Reservation[];
        setReservations(normalized);
        setRooms(roomsData);
        setMonthlyRevenueData(revenueData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
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
          <h1 className="text-3xl font-bold">Hotelier Control Panel</h1>
          <p className="text-muted-foreground">Loading hotel data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-muted h-32 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate stats from actual data
  // Only count reservations that are currently occupying rooms (checked in or arriving today)
  const activeReservations = reservations.filter((r) => {
    const checkInDate = new Date(r.checkInDate);
    const checkOutDate = new Date(r.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);

    // Room is occupied if checked in and hasn't checked out, or confirmed and checking in today
    return (
      (r.status === "CHECKED_IN" && checkOutDate >= today) ||
      (r.status === "CONFIRMED" && checkInDate.getTime() === today.getTime())
    );
  });
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const reservationsThisMonth = reservations.filter((r) => {
    const basis = r.checkInDate ?? r.createdAt;
    const d = new Date(basis);
    return d >= monthStart && d < monthEnd;
  });
  const billableStatuses = new Set(["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"]);
  const monthlyRevenueRaw = reservationsThisMonth
    .filter((r) => billableStatuses.has(r.status))
    .reduce((sum, r) => {
      const amount =
        typeof r.totalAmount === "string"
          ? parseFloat(r.totalAmount)
          : Number(r.totalAmount ?? 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  const monthlyRevenueCop = Number.isFinite(monthlyRevenueRaw)
    ? monthlyRevenueRaw
    : 0;
  const formattedMonthlyRevenue = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monthlyRevenueCop);

  // Calculate available rooms
  const availableRooms = rooms.length - activeReservations.length;

  const stats = [
    {
      title: "Total Reservations",
      value: reservations.length.toString(),
      description: "Registered reservations",
      iconName: "calendar",
      color: "text-blue-600 dark:text-blue-400",
      roles: ["administrator"],
    },
    {
      title: "Rooms",
      value: availableRooms.toString(),
      description: "Total available",
      iconName: "bed",
      color: "text-green-600 dark:text-green-400",
      roles: ["administrator"],
    },
    {
      title: "Occupancy",
      value: `${rooms.length > 0 ? Math.round((activeReservations.length / rooms.length) * 100) : 0}%`,
      description: "Occupancy rate",
      iconName: "users",
      color: "text-purple-600 dark:text-purple-400",
      roles: ["administrator"],
    },
    {
      title: "Monthly Revenue",
      value: formattedMonthlyRevenue,
      description: "Generated income",
      iconName: "dollar-sign",
      color: "text-green-600 dark:text-green-400",
      roles: ["administrator"],
    },
  ];

  // Prepare data for components
  const upcomingArrivals = reservations
    .filter(
      (r) => r.status === "CONFIRMED" && new Date(r.checkInDate) >= new Date(),
    )
    .slice(0, 5)
    .map((r) => ({
      id: r.id.toString(),
      guestName: r.guestName || "No name",
      checkInDate: r.checkInDate,
      guests: r.guests || 1,
      room: { number: r.room?.number || "Not assigned" },
    }));

  const upcomingDepartures = reservations
    .filter(
      (r) =>
        r.status === "CHECKED_IN" && new Date(r.checkOutDate) >= new Date(),
    )
    .slice(0, 5)
    .map((r) => ({
      id: r.id.toString(),
      guestName: r.guestName || "No name",
      checkOutDate: r.checkOutDate,
      guests: r.guests || 1,
      room: { number: r.room?.number || "Not assigned" },
    }));

  const recentReservations = reservations
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((r) => ({
      time: new Date(r.createdAt).toLocaleTimeString("es", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      activity: `New reservation - ${r.guestName || "No name"}`,
      type: "reservation" as const,
    }));

  const upcomingEvents = [
    ...upcomingArrivals.slice(0, 3).map((arrival) => ({
      date: `Today ${new Date(arrival.checkInDate).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      event: `Check-in - ${arrival.guestName} - Room ${arrival.room?.number}`,
      attendees: arrival.guests,
    })),
    ...upcomingDepartures.slice(0, 2).map((departure) => ({
      date: `Today ${new Date(departure.checkOutDate).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      event: `Check-out - ${departure.guestName} - Room ${departure.room?.number}`,
      attendees: departure.guests,
    })),
  ];

  if (upcomingEvents.length === 0) {
    upcomingEvents.push({
      date: "Today",
      event: "No scheduled events",
      attendees: 0,
    });
  }

  const occupancyData = [
    {
      name: "Occupied",
      value: activeReservations.length,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Available",
      value: availableRooms,
      fill: "hsl(var(--chart-2))",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hotelier Control Panel</h1>
        <p className="text-muted-foreground">Hotel overview</p>
      </div>

      <StatsGrid stats={stats} />

      {/* Charts and Activities Section - Side by Side */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <OccupancyChart
          data={occupancyData}
          mounted={true}
          occupiedRooms={activeReservations.length}
          availableRooms={availableRooms}
        />
        <RecentActivities activities={recentReservations} />
      </div>

      {/* Revenue Chart with Upcoming Events Sidebar */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <UpcomingEvents events={upcomingEvents} />
        </div>
        <div className="lg:col-span-4">
          <RevenueChart data={monthlyRevenueData} />
        </div>
      </div>

      {/* Quick Actions - Full Width */}
      <QuickActions />
    </div>
  );
}
