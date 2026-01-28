"use client";

import { useState } from "react";
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
      toast("Item deleted", {
        description: "The menu item has been deleted successfully",
      });
      refreshMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      let errorMessage = "Could not delete the menu item";

      if (error instanceof Error) {
        if (
          error.message.includes("Access denied") ||
          error.message.includes("403")
        ) {
          errorMessage =
            "You do not have permission to delete menu items. Contact the administrator.";
        } else if (
          error.message.includes("Authentication required") ||
          error.message.includes("401")
        ) {
          errorMessage = "Your session has expired. Please log in again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      toast("Error", {
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

      toast("Status updated", {
        description: "The order is being prepared",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast("Error", {
        description: "Could not update the order status",
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

      toast("Status updated", {
        description: "The order is ready for delivery",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast("Error", {
        description: "Could not update the order status",
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

      toast("Status updated", {
        description: "The order has been delivered successfully",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast("Error", {
        description: "Could not update the order status",
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Restaurant & Bar</h1>
          <p className="text-muted-foreground">
            Order, menu and inventory management
          </p>
        </div>
        {hasRole("client") && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Room Service Order
          </Button>
        )}
      </div>

      {/* Room Service Dialog */}
      <RoomServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateOrder={(order: RoomServiceOrder) => {
          toast("Order created", {
            description: `Order for room ${order.room} created successfully`,
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
          <TabsTrigger value="orders">Room Service</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          {!hasRole("client") && (
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          )}
          {!hasRole("client") && <TabsTrigger value="sales">Sales</TabsTrigger>}
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
