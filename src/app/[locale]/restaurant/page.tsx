"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/contexts/auth-context";
import RestaurantDashboard from "./components/restaurant-dashboard";
import { restaurantService } from "@/lib/features/restaurant/service";
import type {
  RoomServiceOrder,
  MenuItem,
  BeverageInventoryItem,
} from "@/lib/features/restaurant/types";

interface RestaurantSale {
  date: string;
  roomService: number;
  diningRoom: number;
  bar: number;
  total: number;
  orders: number;
}

interface RestaurantData {
  roomServiceOrders: RoomServiceOrder[];
  menuItems: MenuItem[];
  beverageInventory: BeverageInventoryItem[];
  restaurantSales: RestaurantSale[];
}

export default function RestaurantPage() {
  const t = useTranslations("RestaurantPage");
  const { user, isLoading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RestaurantData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setError(t("authRequired"));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomServiceOrders, menuItems, beverageInventory] =
          await Promise.all([
            restaurantService
              .getRoomServiceOrders()
              .catch(() => [] as RoomServiceOrder[]),
            restaurantService.getMenuItems().catch(() => [] as MenuItem[]),
            restaurantService
              .getBeverageInventory()
              .catch(() => [] as BeverageInventoryItem[]),
          ]);

        // Basic sales aggregation (fallback if no backend endpoint exists)
        const todayIso = new Date().toISOString().split("T")[0];
        const restaurantSales: RestaurantSale[] = [
          {
            date: todayIso,
            roomService: roomServiceOrders.reduce(
              (s, o) => s + (o.total || 0),
              0,
            ),
            diningRoom: 0,
            bar: 0,
            total: roomServiceOrders.reduce((s, o) => s + (o.total || 0), 0),
            orders: roomServiceOrders.length,
          },
        ];

        const restaurantData = {
          roomServiceOrders,
          menuItems,
          beverageInventory,
          restaurantSales,
        };

        setData(restaurantData);
        setError(null);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setError(t("errorLoading"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, t]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">{t("loadingData")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">{t("noData")}</p>
        </div>
      </div>
    );
  }

  return <RestaurantDashboard initialData={data} />;
}
