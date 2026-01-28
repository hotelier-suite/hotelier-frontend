"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { RoomServiceOrder } from "@/lib/features/restaurant/types";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: RoomServiceOrder | null;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailsDialogProps) {
  const getStatusColor = (status: RoomServiceOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: RoomServiceOrder["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Room:</strong> {order.room}
            </div>
            <div>
              <strong>Guest:</strong> {order.guest}
            </div>
            <div>
              <strong>Status:</strong>
              <Badge className={`ml-2 ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
            <div>
              <strong>Total:</strong> ${order.total.toLocaleString()}
            </div>
          </div>

          <div>
            <strong>Products:</strong>
            <div className="mt-2 space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 bg-muted rounded"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <strong>Order Date:</strong>{" "}
            {new Date(order.orderDate).toLocaleString()}
          </div>

          {order.estimatedTime && (
            <div>
              <strong>Estimated Time:</strong> {order.estimatedTime}
            </div>
          )}

          {order.waiter && (
            <div>
              <strong>Assigned Waiter:</strong> {order.waiter}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
