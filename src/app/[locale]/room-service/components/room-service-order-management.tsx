"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Coffee, Plus } from "lucide-react";

import type {
  RoomServiceOrder,
  RoomServiceOrderItem,
  MenuItem,
} from "@/lib/features/restaurant/types";
import { OrderStatusCards } from "./order-status-cards";
import { OrderFilters } from "./order-filters";
import { OrderCard } from "./order-card";
import { NewOrderDialog } from "./new-order-dialog";
import { OrderDetailsDialog } from "./order-details-dialog";

interface RoomServiceOrderManagementProps {
  initialOrders: RoomServiceOrder[];
  initialMenuItems: MenuItem[];
}

export function RoomServiceOrderManagement({
  initialOrders,
  initialMenuItems,
}: RoomServiceOrderManagementProps) {
  const t = useTranslations("RoomServiceOrderManagement");
  const [orders, setOrders] = useState<RoomServiceOrder[]>(initialOrders);
  const [menuItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedOrder, setSelectedOrder] = useState<RoomServiceOrder | null>(
    null,
  );
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.guest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (
    orderId: string,
    newStatus: RoomServiceOrder["status"],
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
    toast.success(t("orderStatusUpdated"));
  };

  const handleViewDetails = (order: RoomServiceOrder) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };

  const handleCreateOrder = (orderData: {
    roomNumber: string;
    guestName: string;
    specialInstructions?: string;
    selectedItems: Array<{
      menuItemId: string;
      quantity: number;
      specialRequests?: string;
    }>;
  }) => {
    if (
      !orderData.roomNumber ||
      !orderData.guestName ||
      orderData.selectedItems.length === 0
    ) {
      toast.error(t("completeAllFields"));
      return;
    }

    const orderItems: RoomServiceOrderItem[] = orderData.selectedItems.map(
      (selectedItem) => {
        const menuItem = menuItems.find(
          (item) => item.id === selectedItem.menuItemId,
        );
        return {
          id: menuItem?.id || "",
          name: menuItem?.name || "",
          price: menuItem?.price?.toString() || "0",
          quantity: selectedItem.quantity,
        };
      },
    );

    const total = orderData.selectedItems.reduce((sum, selectedItem) => {
      const menuItem = menuItems.find(
        (item) => item.id === selectedItem.menuItemId,
      );
      return sum + (menuItem?.price || 0) * selectedItem.quantity;
    }, 0);

    const newOrder: RoomServiceOrder = {
      id: `ORD${Date.now()}`,
      room: orderData.roomNumber,
      guest: orderData.guestName,
      items: orderItems,
      status: "pending",
      orderDate: new Date().toISOString(),
      estimatedTime: "",
      total: total,
      waiter: "",
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setShowNewOrderDialog(false);
    toast.success(t("newOrderCreated"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button onClick={() => setShowNewOrderDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("newOrder")}
        </Button>
      </div>

      <OrderStatusCards orders={orders} />

      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={handleViewDetails}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Coffee className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("noOrders")}</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? t("noOrdersMatchFilters")
                  : t("createFirstOrder")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <NewOrderDialog
        open={showNewOrderDialog}
        onOpenChange={setShowNewOrderDialog}
        menuItems={menuItems}
        onCreateOrder={handleCreateOrder}
      />

      <OrderDetailsDialog
        open={showOrderDetailsDialog}
        onOpenChange={setShowOrderDetailsDialog}
        order={selectedOrder}
      />
    </div>
  );
}
