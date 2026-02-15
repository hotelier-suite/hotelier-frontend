"use client";

import { useEffect, useState } from "react";
import { type Reservation as ApiReservation } from "@/lib/features/reservations/types";
import { reservationsService } from "@/lib/features/reservations/service";
import { type Room as ApiRoom } from "@/lib/features/rooms/types";
import { roomsService } from "@/lib/features/rooms/service";
import { reportsService } from "@/lib/features/reports/service";
import { StatsGrid } from "./components/stats-grid";
import { RecentActivities } from "./components/recent-activities";
import { UpcomingEvents } from "./components/upcoming-events";
import { OccupancyChart } from "./components/occupancy-chart";
import { RevenueChart } from "./reports/components/revenue-chart";
import { QuickActions } from "./components/quick-actions";
import { useTranslations, useLocale } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";

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

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
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
          reservationsService.getAll().catch(() => [] as ApiReservation[]),
          roomsService.getAll().catch(() => []),
          reportsService
            .getMonthlyRevenueComparison(currentYear)
            .catch(() => []),
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
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("loadingData")}</p>
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
  const formattedMonthlyRevenue = formatCurrency(monthlyRevenueCop);

  // Calculate available rooms
  const availableRooms = rooms.length - activeReservations.length;

  const stats = [
    {
      title: t("totalReservations"),
      value: reservations.length.toString(),
      description: t("registeredReservations"),
      iconName: "calendar",
      color: "text-blue-600 dark:text-blue-400",
      roles: ["administrator"],
    },
    {
      title: t("rooms"),
      value: availableRooms.toString(),
      description: t("totalAvailable"),
      iconName: "bed",
      color: "text-green-600 dark:text-green-400",
      roles: ["administrator"],
    },
    {
      title: t("occupancy"),
      value: `${rooms.length > 0 ? Math.round((activeReservations.length / rooms.length) * 100) : 0}%`,
      description: t("occupancyRate"),
      iconName: "users",
      color: "text-purple-600 dark:text-purple-400",
      roles: ["administrator"],
    },
    {
      title: t("monthlyRevenue"),
      value: formattedMonthlyRevenue,
      description: t("generatedIncome"),
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
      guestName: r.guestName || t("noName"),
      checkInDate: r.checkInDate,
      guests: r.guests || 1,
      room: { number: r.room?.number || t("notAssigned") },
    }));

  const upcomingDepartures = reservations
    .filter(
      (r) =>
        r.status === "CHECKED_IN" && new Date(r.checkOutDate) >= new Date(),
    )
    .slice(0, 5)
    .map((r) => ({
      id: r.id.toString(),
      guestName: r.guestName || t("noName"),
      checkOutDate: r.checkOutDate,
      guests: r.guests || 1,
      room: { number: r.room?.number || t("notAssigned") },
    }));

  const recentReservations = reservations
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((r) => ({
      time: new Date(r.createdAt).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      activity: `${t("newReservation")} - ${r.guestName || t("noName")}`,
      type: "reservation" as const,
    }));

  const upcomingEvents = [
    ...upcomingArrivals.slice(0, 3).map((arrival) => ({
      date: `${t("today")} ${new Date(arrival.checkInDate).toLocaleTimeString(
        locale,
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      )}`,
      event: `${t("checkIn")} - ${arrival.guestName} - ${t("room")} ${arrival.room?.number}`,
      attendees: arrival.guests,
    })),
    ...upcomingDepartures.slice(0, 2).map((departure) => ({
      date: `${t("today")} ${new Date(
        departure.checkOutDate,
      ).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      event: `${t("checkOut")} - ${departure.guestName} - ${t("room")} ${departure.room?.number}`,
      attendees: departure.guests,
    })),
  ];

  if (upcomingEvents.length === 0) {
    upcomingEvents.push({
      date: t("today"),
      event: t("noScheduledEvents"),
      attendees: 0,
    });
  }

  const occupancyData = [
    {
      name: t("occupied"),
      value: activeReservations.length,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: t("available"),
      value: availableRooms,
      fill: "hsl(var(--chart-2))",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("hotelOverview")}</p>
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

