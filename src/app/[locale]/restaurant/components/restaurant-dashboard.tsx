"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { restaurantService } from "@/lib/features/restaurant/service";
import type {
  RoomServiceOrder,
  MenuItem,
  BeverageInventoryItem,
} from "@/lib/features/restaurant/types";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";

interface RestaurantSale {
  date: string;
  roomService: number;
  diningRoom: number;
  bar: number;
  total: number;
  orders: number;
}
import { RestaurantStats } from "./restaurant-stats";
import { RoomServiceOrders } from "./room-service-orders";
import { MenuTable } from "./menu-table";
import { InventoryTable } from "./inventory-table";
import { RoomServiceDialog } from "./room-service-dialog";
import { SalesTable } from "./sales-table";

interface RestaurantDashboardProps {
  initialData: {
    roomServiceOrders: RoomServiceOrder[];
    menuItems: MenuItem[];
    beverageInventory: BeverageInventoryItem[];
    restaurantSales: RestaurantSale[];
  };
}

export default function RestaurantDashboard({
  initialData,
}: RestaurantDashboardProps) {
  const t = useTranslations("RestaurantDashboard");
  const { hasRole } = useAuthenticatedUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState<Set<string>>(new Set());

  // Initialize state with server data
  const [roomServiceOrders, setRoomServiceOrders] = useState<
    RoomServiceOrder[]
  >(initialData.roomServiceOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialData.menuItems);
  const [beverageInventory, setBeverageInventory] = useState<
    BeverageInventoryItem[]
  >(initialData.beverageInventory);
  const restaurantSales = initialData.restaurantSales;

  const refreshOrders = async () => {
    try {
      const orders = await restaurantService.getRoomServiceOrders();
      setRoomServiceOrders(orders);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    }
  };

  const refreshMenuItems = async () => {
    try {
      const items = await restaurantService.getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error("Error refreshing menu items:", error);
    }
  };

  const handleDeleteMenuItem = async (item: MenuItem) => {
    try {
      await restaurantService.deleteMenuItem(item);
      toast(t("itemDeleted"), {
        description: t("itemDeletedDesc"),
      });
      refreshMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      let errorMessage = t("couldNotDeleteItem");

      if (error instanceof Error) {
        if (
          error.message.includes("Access denied") ||
          error.message.includes("403")
        ) {
          errorMessage = t("noPermissionDelete");
        } else if (
          error.message.includes("Authentication required") ||
          error.message.includes("401")
        ) {
          errorMessage = t("sessionExpired");
        }
      }

      toast(t("error"), {
        description: errorMessage,
      });
    }
  };

  const handleProcessOrder = async (orderId: string) => {
    setLoadingOrders((prev) => new Set(prev).add(orderId));
    try {
      // Update backend first
      await restaurantService.updateRoomServiceOrder(orderId, {
        status: "PREPARING",
      });

      // Update local state on success
      setRoomServiceOrders(
        roomServiceOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "preparing" as const }
            : order,
        ),
      );

      toast(t("statusUpdated"), {
        description: t("orderPreparing"),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast(t("error"), {
        description: t("couldNotUpdateStatus"),
      });
    } finally {
      setLoadingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    setLoadingOrders((prev) => new Set(prev).add(orderId));
    try {
      // Update backend first
      await restaurantService.updateRoomServiceOrder(orderId, {
        status: "READY",
      });

      // Update local state on success
      setRoomServiceOrders(
        roomServiceOrders.map((order) =>
          order.id === orderId ? { ...order, status: "ready" as const } : order,
        ),
      );

      toast(t("statusUpdated"), {
        description: t("orderReady"),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast(t("error"), {
        description: t("couldNotUpdateStatus"),
      });
    } finally {
      setLoadingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleDeliverOrder = async (orderId: string) => {
    setLoadingOrders((prev) => new Set(prev).add(orderId));
    try {
      // Update backend first
      await restaurantService.updateRoomServiceOrder(orderId, {
        status: "DELIVERED",
      });

      // Update local state on success
      setRoomServiceOrders(
        roomServiceOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "delivered" as const,
                estimatedTime: "Delivered",
              }
            : order,
        ),
      );

      toast(t("statusUpdated"), {
        description: t("orderDelivered"),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast(t("error"), {
        description: t("couldNotUpdateStatus"),
      });
    } finally {
      setLoadingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleRestock = async (itemId: string, newStock: number) => {
    setBeverageInventory(
      beverageInventory.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stock: newStock,
              status:
                newStock > item.minimumStock
                  ? ("available" as const)
                  : newStock === 0
                    ? ("out_of_stock" as const)
                    : ("low_stock" as const),
            }
          : item,
      ),
    );
  };

  const refreshBeverageInventory = async () => {
    try {
      const items = await restaurantService.getBeverageInventory();
      setBeverageInventory(items);
    } catch (error) {
      console.error("Error refreshing inventory:", error);
    }
  };

  // Calculate stats
  const stats = {
    activeOrders: roomServiceOrders.filter((o) => o.status !== "delivered")
      .length,
    todayOrders: roomServiceOrders.length,
    revenue: roomServiceOrders.reduce((sum, order) => sum + order.total, 0),
    averageTime: 18,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        {hasRole("client") && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("newRoomServiceOrder")}
          </Button>
        )}
      </div>

      {/* Room Service Dialog */}
      <RoomServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateOrder={(order: RoomServiceOrder) => {
          toast(t("orderCreated"), {
            description: t("orderCreatedDesc", { room: order.room }),
          });
          setDialogOpen(false);
          refreshOrders(); // Refresh the orders list
        }}
      />

      {/* Quick Stats */}
      <RestaurantStats
        stats={{
          activeOrders: stats.activeOrders,
          todayOrders: stats.todayOrders,
          revenue: stats.revenue,
          averageTime: stats.averageTime,
          lowStockItems: beverageInventory.filter(
            (item) => item.status === "low_stock",
          ).length,
        }}
      />

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">{t("roomService")}</TabsTrigger>
          <TabsTrigger value="menu">{t("menu")}</TabsTrigger>
          {!hasRole("client") && (
            <TabsTrigger value="inventory">{t("inventory")}</TabsTrigger>
          )}
          {!hasRole("client") && (
            <TabsTrigger value="sales">{t("sales")}</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <RoomServiceOrders
            orders={roomServiceOrders}
            onProcessOrder={handleProcessOrder}
            onCompleteOrder={handleCompleteOrder}
            onDeliverOrder={handleDeliverOrder}
            loadingOrders={loadingOrders}
          />
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <MenuTable
            menuItems={menuItems}
            onDeleteItem={handleDeleteMenuItem}
            onRefresh={refreshMenuItems}
          />
        </TabsContent>

        {!hasRole("client") && (
          <TabsContent value="inventory" className="space-y-4">
            <InventoryTable
              items={beverageInventory}
              onRestock={handleRestock}
              onRefresh={refreshBeverageInventory}
            />
          </TabsContent>
        )}

        {!hasRole("client") && (
          <TabsContent value="sales" className="space-y-4">
            <SalesTable sales={restaurantSales} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
