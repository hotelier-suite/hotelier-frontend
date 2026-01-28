"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { restaurantService } from "@/lib/features/restaurant/service";
import type { RoomServiceOrder } from "@/lib/features/restaurant/types";
import { employeesService } from "@/lib/features/employees/service";
import type { Employee } from "@/lib/features/employees/types";
import { reservationsService } from "@/lib/features/reservations/service";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface RoomServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrder?: (order: RoomServiceOrder) => void;
}

interface OccupiedRoom {
  id: number | string; // Can be string or number from reservation
  number: string;
  guestName: string;
}

export function RoomServiceDialog({
  open,
  onOpenChange,
  onCreateOrder,
}: RoomServiceDialogProps) {
  const [room, setRoom] = useState("");
  const [waiter, setWaiter] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Backend data state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [rooms, setRooms] = useState<OccupiedRoom[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [, setDataLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setDataLoading(true);
      console.log("Room Service Dialog - Starting data fetch...");

      // Fetch each API separately to debug individually
      let menuItemsRes: MenuItem[] = [];
      let roomsRes: OccupiedRoom[] = [];
      let employeesRes: Employee[] = [];

      try {
        menuItemsRes = await restaurantService.getMenuItems();
        console.log("Room Service Dialog - Menu items fetched:", menuItemsRes);
      } catch (error) {
        console.error("Room Service Dialog - Menu items fetch failed:", error);
        menuItemsRes = [];
      }

      try {
        // Get all current reservations
        const currentReservations = await reservationsService.getAll();

        // Map to our simple format and deduplicate by room number
        const roomsMap = new Map<string, OccupiedRoom>();

        currentReservations
          .filter((res) => res.status === "CHECKED_IN")
          .forEach((res) => {
            // Only keep the first reservation for each room number
            if (!roomsMap.has(res.room.number)) {
              roomsMap.set(res.room.number, {
                id: res.id,
                number: res.room.number,
                guestName: res.guestName || "Unnamed Guest",
              });
            }
          });

        roomsRes = Array.from(roomsMap.values());

        console.log(
          "Room Service Dialog - Current reservations fetched:",
          roomsRes,
        );
      } catch (error) {
        console.error(
          "Room Service Dialog - Reservations fetch failed:",
          error,
        );
        roomsRes = [];
      }

      try {
        employeesRes = await employeesService.getAll();
        console.log("Room Service Dialog - Employees fetched:", employeesRes);
      } catch (error) {
        console.error("Room Service Dialog - Employees fetch failed:", error);
        employeesRes = [];
      }

      console.log("Room Service Dialog - Final data:", {
        menuItems: menuItemsRes.length,
        rooms: roomsRes.length,
        employees: employeesRes.length,
        menuItemsData: menuItemsRes,
        roomsData: roomsRes,
        employeesData: employeesRes,
      });

      setMenuItems(menuItemsRes);
      setRooms(roomsRes);

      // Filter employees to only show restaurant staff (waiters, etc.)
      const restaurantEmployees = employeesRes.filter(
        (emp) => emp.department === "RESTAURANT" && emp.status === "ACTIVE",
      );

      console.log(
        "Room Service Dialog - Restaurant employees after filter:",
        restaurantEmployees,
      );
      setEmployees(restaurantEmployees);

      // Force re-render by updating state
      setTimeout(() => {
        console.log("Room Service Dialog - State after update:", {
          menuItemsState: menuItems.length,
          roomsState: rooms.length,
          employeesState: employees.length,
        });
      }, 100);
    } catch (error) {
      console.error("Room Service Dialog - Error fetching data:", error);
      toast.error("Error loading form data");
    } finally {
      setDataLoading(false);
    }
  }, [menuItems.length, rooms.length, employees.length]);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  const handleAddItem = () => {
    if (!selectedItem) {
      toast.error("Please select an item");
      return;
    }

    const menuItem = menuItems.find(
      (item: MenuItem) => item.id === selectedItem,
    );
    if (!menuItem) return;

    const existingItemIndex = orderItems.findIndex(
      (item) => item.id === selectedItem,
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setOrderItems(updatedItems);
    } else {
      // Add new item
      const newItem: OrderItem = {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity,
      };
      setOrderItems([...orderItems, newItem]);
    }

    setSelectedItem("");
    setQuantity(1);
    toast.success("Item added to order");
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
    toast.success("Item removed from order");
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const handleSubmit = async () => {
    if (!room) {
      toast.error("Please select a room");
      return;
    }
    if (!waiter) {
      toast.error("Please select a waiter");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    setLoading(true);
    try {
      console.log("Room Service Dialog - Starting order creation...");

      // Prepare order data for backend
      const orderData = {
        room,
        guest:
          rooms.find((r) => r.number === room)?.guestName || `Guest ${room}`,
        items: orderItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price.toString(),
          quantity: item.quantity,
        })),
        total: calculateTotal(),
        estimatedTime: "30 min",
        waiter,
        specialInstructions: notes,
      };

      console.log("Room Service Dialog - Order data:", orderData);

      // Call backend API to create the order
      const createdOrder =
        await restaurantService.createRoomServiceOrder(orderData);
      console.log("Room Service Dialog - Order created:", createdOrder);

      // Create local order data for callback with required fields
      const localOrder: RoomServiceOrder = {
        id: createdOrder.id,
        room: createdOrder.room,
        guest: createdOrder.guest,
        items: orderItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price.toString(),
          quantity: item.quantity,
        })),
        total: createdOrder.total,
        orderDate: createdOrder.orderDate,
        estimatedTime: createdOrder.estimatedTime,
        status: createdOrder.status,
        waiter: createdOrder.waiter,
      };

      // Call the callback with the created order
      onCreateOrder?.(localOrder);

      // Reset form
      setRoom("");
      setWaiter("");
      setOrderItems([]);
      setNotes("");
      onOpenChange(false);

      toast.success("Order created successfully");
    } catch (error) {
      console.error("Room Service Dialog - Error creating order:", error);
      toast.error("Error creating the order");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Debug logs before render
  console.log("Room Service Dialog - Rendering with state:", {
    menuItemsCount: menuItems.length,
    roomsCount: rooms.length,
    employeesCount: employees.length,
    menuItemsData: menuItems,
    roomsData: rooms,
    employeesData: employees,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Room Service Order</DialogTitle>
          <DialogDescription>
            Create an order for room delivery
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select value={room} onValueChange={setRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.number}>
                      Room {r.number} - {r.guestName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waiter">Assigned Waiter</Label>
              <Select value={waiter} onValueChange={setWaiter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waiter" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((w: Employee) => (
                    <SelectItem key={w.id} value={w.name}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Order Items</Label>
            <div className="grid gap-2">
              <div className="flex gap-2">
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select dish or drink" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItems.map((item: MenuItem) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - ${item.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Quantity"
                  className="w-24"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <Button variant="outline" onClick={handleAddItem}>
                  Add
                </Button>
              </div>
              <div className="border rounded-lg p-3 min-h-[100px]">
                {orderItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Items added will appear here...
                  </p>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-muted p-2 rounded"
                      >
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            x{item.quantity} -{" "}
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes</Label>
            <Textarea
              id="notes"
              placeholder="Allergies, dietary restrictions or special instructions..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Total: {formatCurrency(calculateTotal())}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
