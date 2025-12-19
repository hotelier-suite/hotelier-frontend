"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Coffee, CheckCircle, Eye } from "lucide-react";
import { RoomServiceOrder } from "@/lib/api/restaurant";

interface OrderCardProps {
  order: RoomServiceOrder;
  onViewDetails: (order: RoomServiceOrder) => void;
  onStatusUpdate: (orderId: string, status: RoomServiceOrder["status"]) => void;
}

export function OrderCard({
  order,
  onViewDetails,
  onStatusUpdate,
}: OrderCardProps) {
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

  const getStatusIcon = (status: RoomServiceOrder["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <Coffee className="h-4 w-4" />;
      case "ready":
        return <CheckCircle className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-lg">#{order.id}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Room {order.room} • {order.guest}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)} variant="secondary">
              <span className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                {getStatusText(order.status)}
              </span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {order.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(order.id, "preparing")}
              >
                Prepare
              </Button>
            )}
            {order.status === "preparing" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(order.id, "ready")}
              >
                Mark Ready
              </Button>
            )}
            {order.status === "ready" && (
              <Button
                size="sm"
                onClick={() => onStatusUpdate(order.id, "delivered")}
              >
                Deliver
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Products:</strong> {order.items.join(", ")}
          </p>
          <p className="text-sm">
            <strong>Total:</strong> ${order.total.toLocaleString()}
          </p>
          <p className="text-sm">
            <strong>Order Time:</strong>{" "}
            {new Date(order.orderTime).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
