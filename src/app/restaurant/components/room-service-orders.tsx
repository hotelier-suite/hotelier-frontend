"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, CheckCircle, Truck } from "lucide-react";
import type {
  RoomServiceOrder,
  RoomServiceOrderItem,
} from "@/lib/features/restaurant/types";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";

interface RoomServiceOrdersProps {
  orders: RoomServiceOrder[];
  onProcessOrder: (orderId: string) => void;
  onCompleteOrder: (orderId: string) => void;
  onDeliverOrder: (orderId: string) => void;
  loadingOrders?: Set<string>;
}

export function RoomServiceOrders({
  orders,
  onProcessOrder,
  onCompleteOrder,
  onDeliverOrder,
  loadingOrders = new Set(),
}: RoomServiceOrdersProps) {
  const { hasRole } = useAuthenticatedUser();
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge>Pending</Badge>;
      case "preparing":
        return <Badge>Preparing</Badge>;
      case "ready":
        return <Badge>Ready</Badge>;
      case "delivered":
        return <Badge>Delivered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Service Orders</CardTitle>
        <CardDescription>
          Management of orders for room delivery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Waiter</TableHead>
              {!hasRole("client") && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.room}</TableCell>
                <TableCell>{order.guest}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.map(
                      (item: RoomServiceOrderItem, index: number) => (
                        <div key={index} className="text-sm">
                          {item.quantity}x {item.name} - ${item.price}
                        </div>
                      ),
                    )}
                  </div>
                </TableCell>
                <TableCell>${order.total.toLocaleString()}</TableCell>
                <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                <TableCell>{order.estimatedTime}</TableCell>
                <TableCell>{order.waiter}</TableCell>
                {!hasRole("client") && (
                  <TableCell>
                    <div className="flex space-x-2">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onProcessOrder(order.id)}
                          disabled={loadingOrders.has(order.id)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {loadingOrders.has(order.id)
                            ? "Processing..."
                            : "Prepare"}
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          size="sm"
                          onClick={() => onCompleteOrder(order.id)}
                          disabled={loadingOrders.has(order.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {loadingOrders.has(order.id)
                            ? "Completing..."
                            : "Ready"}
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onDeliverOrder(order.id)}
                          disabled={loadingOrders.has(order.id)}
                        >
                          <Truck className="mr-2 h-4 w-4" />
                          {loadingOrders.has(order.id)
                            ? "Delivering..."
                            : "Deliver"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
