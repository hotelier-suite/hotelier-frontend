"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingCart, Clock, CheckCircle } from "lucide-react";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";

interface RestaurantStatsProps {
  stats: {
    activeOrders: number;
    todayOrders: number;
    revenue: number;
    averageTime: number;
    lowStockItems?: number;
  };
}

export function RestaurantStats({ stats }: RestaurantStatsProps) {
  const { hasRole } = useAuthenticatedUser();

  return (
    <div
      className={`grid gap-4 md:grid-cols-2 ${!hasRole("client") ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          <Utensils className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeOrders}</div>
          <p className="text-xs text-muted-foreground">
            Room service in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
          <ShoppingCart className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayOrders}</div>
          <p className="text-xs text-muted-foreground">Total orders</p>
        </CardContent>
      </Card>

      {!hasRole("client") && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Sales
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Time</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageTime} min</div>
          <p className="text-xs text-muted-foreground">Room service delivery</p>
        </CardContent>
      </Card>
    </div>
  );
}
