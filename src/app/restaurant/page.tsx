"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import RestaurantDashboard from "./components/restaurant-dashboard";
import {
  restaurantApi,
  type RoomServiceOrder,
  type MenuItem,
  type BeverageInventoryItem,
} from "@/lib/api/restaurant";

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
  const { user, isLoading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RestaurantData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomServiceOrders, menuItems, beverageInventory] =
          await Promise.all([
            restaurantApi
              .getRoomServiceOrders()
              .catch(() => [] as RoomServiceOrder[]),
            restaurantApi.getMenuItems().catch(() => [] as MenuItem[]),
            restaurantApi
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
        setError("Error loading restaurant data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading restaurant data...</p>
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
          <p className="text-lg">No restaurant data available</p>
        </div>
      </div>
    );
  }

  return <RestaurantDashboard initialData={data} />;
}
