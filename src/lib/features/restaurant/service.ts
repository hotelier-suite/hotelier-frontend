import { apiRequest } from "@/lib/api/base";
import {
  RoomServiceOrder,
  MenuItem,
  BeverageInventoryItem,
  BackendRoomServiceOrder,
  BackendMenuItem,
  BackendBeverageInventory,
  CreateRoomServiceOrderData,
  UpdateRoomServiceOrderData,
  CreateMenuItemData,
  UpdateMenuItemData,
  CreateBeverageItemData,
  UpdateBeverageItemData,
} from "./types";

// Transform functions
const transformRoomServiceOrder = (
  backendOrder: BackendRoomServiceOrder,
): RoomServiceOrder => ({
  id: backendOrder.orderNumber,
  room: backendOrder.room,
  guest: backendOrder.guest,
  items:
    typeof backendOrder.items === "string"
      ? JSON.parse(backendOrder.items)
      : backendOrder.items,
  total: Number(backendOrder.total),
  orderDate: backendOrder.orderDate,
  estimatedTime: backendOrder.estimatedTime || "",
  status: backendOrder.status.toLowerCase() as
    | "pending"
    | "preparing"
    | "ready"
    | "delivered",
  waiter: backendOrder.waiter || "",
});

const transformMenuItem = (backendItem: BackendMenuItem): MenuItem => {
  let ingredients: string[] = [];
  let allergens: string[] = [];

  if (backendItem.ingredients) {
    try {
      if (Array.isArray(backendItem.ingredients)) {
        ingredients = backendItem.ingredients;
      } else if (typeof backendItem.ingredients === "string") {
        if (backendItem.ingredients.trim().startsWith("[")) {
          ingredients = JSON.parse(backendItem.ingredients);
        } else {
          ingredients = backendItem.ingredients
            .split(",")
            .map((item) => item.trim());
        }
      }
    } catch (error) {
      console.warn(
        "Failed to parse ingredients:",
        backendItem.ingredients,
        error,
      );
      if (typeof backendItem.ingredients === "string") {
        ingredients = backendItem.ingredients
          .split(",")
          .map((item) => item.trim());
      }
    }
  }

  if (backendItem.allergens) {
    try {
      if (Array.isArray(backendItem.allergens)) {
        allergens = backendItem.allergens;
      } else if (typeof backendItem.allergens === "string") {
        if (backendItem.allergens.trim().startsWith("[")) {
          allergens = JSON.parse(backendItem.allergens);
        } else {
          allergens = backendItem.allergens
            .split(",")
            .map((item) => item.trim());
        }
      }
    } catch (error) {
      console.warn("Failed to parse allergens:", backendItem.allergens, error);
      if (typeof backendItem.allergens === "string") {
        allergens = backendItem.allergens.split(",").map((item) => item.trim());
      }
    }
  }

  return {
    id: backendItem.itemCode,
    backendId: backendItem.id,
    category: backendItem.category,
    name: backendItem.name,
    description: backendItem.description || "",
    price: backendItem.price,
    available: backendItem.available,
    preparationTime: backendItem.preparationTime || "",
    ingredients: ingredients,
    allergens: allergens.length > 0 ? allergens : undefined,
  };
};

const transformBeverageItem = (
  backendItem: BackendBeverageInventory,
): BeverageInventoryItem => ({
  id: backendItem.itemCode,
  name: backendItem.name,
  category: backendItem.category,
  stock: backendItem.stock,
  minimumStock: backendItem.minimumStock,
  unit: backendItem.unit,
  unitCost: backendItem.unitCost,
  supplier: backendItem.supplier || "",
  lastPurchase: backendItem.lastPurchase
    ? new Date(backendItem.lastPurchase).toISOString().split("T")[0]
    : "",
  status:
    backendItem.status === "OUT_OF_STOCK"
      ? "out_of_stock"
      : backendItem.status === "LOW_STOCK"
        ? "low_stock"
        : "available",
});

export const restaurantService = {
  // Room Service Orders
  getRoomServiceOrders: async (): Promise<RoomServiceOrder[]> => {
    const backendOrders = (await apiRequest(
      "/restaurant/room-service-orders",
    )) as BackendRoomServiceOrder[];
    return backendOrders.map(transformRoomServiceOrder);
  },

  createRoomServiceOrder: async (
    orderData: CreateRoomServiceOrderData,
  ): Promise<RoomServiceOrder> => {
    const backendOrder = (await apiRequest("/restaurant/room-service-orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })) as BackendRoomServiceOrder;
    return transformRoomServiceOrder(backendOrder);
  },

  updateRoomServiceOrder: async (
    id: string,
    updateData: UpdateRoomServiceOrderData,
  ): Promise<RoomServiceOrder> => {
    const orders = (await apiRequest(
      "/restaurant/room-service-orders",
    )) as BackendRoomServiceOrder[];
    const order = orders.find(
      (o: BackendRoomServiceOrder) => o.orderNumber === id,
    );
    if (!order) throw new Error("Order not found");

    const backendOrder = (await apiRequest(
      `/restaurant/room-service-orders/${order.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
    )) as BackendRoomServiceOrder;
    return transformRoomServiceOrder(backendOrder);
  },

  // Menu Items
  getMenuItems: async (): Promise<MenuItem[]> => {
    const backendItems = (await apiRequest(
      "/restaurant/menu-items",
    )) as BackendMenuItem[];
    return backendItems.map(transformMenuItem);
  },

  createMenuItem: async (itemData: CreateMenuItemData): Promise<MenuItem> => {
    const backendItem = (await apiRequest("/restaurant/menu-items", {
      method: "POST",
      body: JSON.stringify(itemData),
    })) as BackendMenuItem;
    return transformMenuItem(backendItem);
  },

  updateMenuItem: async (
    item: MenuItem,
    updateData: UpdateMenuItemData,
  ): Promise<MenuItem> => {
    try {
      let backendId: number;

      if (item.backendId) {
        backendId = item.backendId;
      } else {
        const items = (await apiRequest(
          "/restaurant/menu-items",
        )) as BackendMenuItem[];
        const foundItem = items.find(
          (i: BackendMenuItem) => i.itemCode === item.id,
        );
        if (!foundItem) throw new Error("Menu item not found");
        backendId = foundItem.id;
      }

      const backendItem = (await apiRequest(
        `/restaurant/menu-items/${backendId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData),
        },
      )) as BackendMenuItem;

      return transformMenuItem(backendItem);
    } catch (error) {
      console.error("Error in updateMenuItem:", error);
      throw error;
    }
  },

  deleteMenuItem: async (item: MenuItem): Promise<void> => {
    try {
      let backendId: number;

      if (item.backendId) {
        backendId = item.backendId;
      } else {
        const items = (await apiRequest(
          "/restaurant/menu-items",
        )) as BackendMenuItem[];
        const foundItem = items.find(
          (i: BackendMenuItem) => i.itemCode === item.id,
        );
        if (!foundItem) throw new Error("Menu item not found");
        backendId = foundItem.id;
      }

      await apiRequest(`/restaurant/menu-items/${backendId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error in deleteMenuItem:", error);
      throw error;
    }
  },

  // Beverage Inventory
  getBeverageInventory: async (): Promise<BeverageInventoryItem[]> => {
    const backendItems = (await apiRequest(
      "/restaurant/beverage-inventory",
    )) as BackendBeverageInventory[];
    return backendItems.map(transformBeverageItem);
  },

  updateBeverageItem: async (
    id: string,
    updateData: UpdateBeverageItemData,
  ): Promise<BeverageInventoryItem> => {
    const items = (await apiRequest(
      "/restaurant/beverage-inventory",
    )) as BackendBeverageInventory[];
    const item = items.find((i: BackendBeverageInventory) => i.itemCode === id);
    if (!item) throw new Error("Beverage item not found");

    const backendItem = (await apiRequest(
      `/restaurant/beverage-inventory/${item.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
    )) as BackendBeverageInventory;
    return transformBeverageItem(backendItem);
  },

  createBeverageItem: async (
    itemData: CreateBeverageItemData,
  ): Promise<BeverageInventoryItem> => {
    const backendItem = (await apiRequest("/restaurant/beverage-inventory", {
      method: "POST",
      body: JSON.stringify(itemData),
    })) as BackendBeverageInventory;
    return transformBeverageItem(backendItem);
  },
};
