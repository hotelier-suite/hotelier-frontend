import { apiRequest } from "./base";

// Restaurant types
export interface RoomServiceOrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export interface RoomServiceOrder {
  id: string;
  room: string;
  guest: string;
  items: RoomServiceOrderItem[];
  total: number;
  orderTime: string;
  estimatedTime: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  waiter: string;
}

export interface MenuItem {
  id: string;
  backendId?: number; // Store the actual backend ID for updates
  category: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  preparationTime: string;
  ingredients: string[];
  allergens?: string[];
}

export interface BeverageInventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastPurchase: string;
  status: "available" | "low_stock" | "out_of_stock";
}

// Backend data types
interface BackendRoomServiceOrder {
  id: number;
  orderNumber: string;
  room: string;
  guest: string;
  items: string | RoomServiceOrderItem[]; // Can be JSON string or array
  total: number | string; // Can be number or string from decimal type
  orderTime: string;
  estimatedTime?: string | null;
  status: "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  waiter?: string | null;
  specialInstructions?: string | null;
}

interface BackendMenuItem {
  id: number;
  itemCode: string;
  category: string;
  name: string;
  description?: string | null;
  price: number;
  available: boolean;
  preparationTime?: string | null;
  ingredients?: string | string[] | null; // Can be JSON string, array, or null
  allergens?: string | string[] | null; // Can be JSON string, array, or null
}

interface BackendBeverageInventory {
  id: number;
  itemCode: string;
  name: string;
  category: string;
  stock: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
  supplier?: string | null;
  lastPurchase?: string | null; // ISO date string
  status: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";
}

// Transform backend data to frontend format
const transformRoomServiceOrder = (
  backendOrder: BackendRoomServiceOrder,
): RoomServiceOrder => ({
  id: backendOrder.orderNumber, // Use orderNumber as the frontend ID
  room: backendOrder.room,
  guest: backendOrder.guest,
  items:
    typeof backendOrder.items === "string"
      ? JSON.parse(backendOrder.items)
      : backendOrder.items, // Handle both string and array formats
  total: Number(backendOrder.total), // Convert to number to handle decimal types from DB
  orderTime: backendOrder.orderTime,
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
      // If it's already an array, use it directly
      if (Array.isArray(backendItem.ingredients)) {
        ingredients = backendItem.ingredients;
      }
      // If it's a string, try to parse it as JSON
      else if (typeof backendItem.ingredients === "string") {
        // Check if it looks like a JSON array
        if (backendItem.ingredients.trim().startsWith("[")) {
          ingredients = JSON.parse(backendItem.ingredients);
        } else {
          // If it's a comma-separated string, split it
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
      // Fallback: treat as comma-separated string
      if (typeof backendItem.ingredients === "string") {
        ingredients = backendItem.ingredients
          .split(",")
          .map((item) => item.trim());
      }
    }
  }

  if (backendItem.allergens) {
    try {
      // If it's already an array, use it directly
      if (Array.isArray(backendItem.allergens)) {
        allergens = backendItem.allergens;
      }
      // If it's a string, try to parse it as JSON
      else if (typeof backendItem.allergens === "string") {
        // Check if it looks like a JSON array
        if (backendItem.allergens.trim().startsWith("[")) {
          allergens = JSON.parse(backendItem.allergens);
        } else {
          // If it's a comma-separated string, split it
          allergens = backendItem.allergens
            .split(",")
            .map((item) => item.trim());
        }
      }
    } catch (error) {
      console.warn("Failed to parse allergens:", backendItem.allergens, error);
      // Fallback: treat as comma-separated string
      if (typeof backendItem.allergens === "string") {
        allergens = backendItem.allergens.split(",").map((item) => item.trim());
      }
    }
  }

  return {
    id: backendItem.itemCode, // Use itemCode as the frontend ID
    backendId: backendItem.id, // Store the actual backend ID for updates
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
  id: backendItem.itemCode, // Use itemCode as the frontend ID
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

export const restaurantApi = {
  // Room Service Orders
  getRoomServiceOrders: async (): Promise<RoomServiceOrder[]> => {
    const backendOrders = (await apiRequest(
      "/restaurant/room-service-orders",
    )) as BackendRoomServiceOrder[];
    return backendOrders.map(transformRoomServiceOrder);
  },

  createRoomServiceOrder: async (orderData: {
    room: string;
    guest: string;
    items: string[] | Record<string, unknown> | RoomServiceOrderItem[];
    total: number;
    estimatedTime?: string;
    waiter?: string;
    specialInstructions?: string;
  }): Promise<RoomServiceOrder> => {
    const backendOrder = (await apiRequest("/restaurant/room-service-orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })) as BackendRoomServiceOrder;
    return transformRoomServiceOrder(backendOrder);
  },

  updateRoomServiceOrder: async (
    id: string,
    updateData: {
      status?: "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
      waiter?: string;
      estimatedTime?: string;
      specialInstructions?: string;
    },
  ): Promise<RoomServiceOrder> => {
    // Convert frontend ID back to backend ID
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
        method: "PUT",
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

  createMenuItem: async (itemData: {
    category: string;
    name: string;
    description?: string;
    price: number;
    preparationTime?: string;
    ingredients?: string[] | Record<string, unknown>;
    allergens?: string[] | Record<string, unknown>;
  }): Promise<MenuItem> => {
    const backendItem = (await apiRequest("/restaurant/menu-items", {
      method: "POST",
      body: JSON.stringify(itemData),
    })) as BackendMenuItem;
    return transformMenuItem(backendItem);
  },

  updateMenuItem: async (
    item: MenuItem,
    updateData: {
      category?: string;
      name?: string;
      description?: string;
      price?: number;
      available?: boolean;
      preparationTime?: string;
      ingredients?: string[] | Record<string, unknown>;
      allergens?: string[] | Record<string, unknown>;
    },
  ): Promise<MenuItem> => {
    try {
      let backendId: number;

      // If we have the backend ID, use it directly
      if (item.backendId) {
        backendId = item.backendId;
        console.log("Using stored backend ID:", backendId);
      } else {
        // Fallback: fetch all items to find the backend ID
        console.log(
          "Backend ID not available, fetching menu items to find backend ID for:",
          item.id,
        );
        const items = (await apiRequest(
          "/restaurant/menu-items",
        )) as BackendMenuItem[];

        const foundItem = items.find(
          (i: BackendMenuItem) => i.itemCode === item.id,
        );
        if (!foundItem) throw new Error("Menu item not found");
        backendId = foundItem.id;
      }

      console.log("Updating menu item with backend ID:", backendId);
      const backendItem = (await apiRequest(
        `/restaurant/menu-items/${backendId}`,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        },
      )) as BackendMenuItem;

      return transformMenuItem(backendItem);
    } catch (error) {
      console.error("Error in updateMenuItem:", error);
      console.error("Frontend item:", item);
      console.error("Update data:", updateData);
      throw error;
    }
  },

  deleteMenuItem: async (item: MenuItem): Promise<void> => {
    try {
      let backendId: number;

      // If we have the backend ID, use it directly
      if (item.backendId) {
        backendId = item.backendId;
        console.log("Using stored backend ID for delete:", backendId);
      } else {
        // Fallback: fetch all items to find the backend ID
        console.log(
          "Backend ID not available, fetching menu items to find backend ID for:",
          item.id,
        );
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
      console.error("Frontend item:", item);
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

  updateBeverageStock: async (
    id: string,
    newStock: number,
  ): Promise<BeverageInventoryItem> => {
    // Convert frontend ID back to backend ID
    const items = (await apiRequest(
      "/restaurant/beverage-inventory",
    )) as BackendBeverageInventory[];
    const item = items.find((i: BackendBeverageInventory) => i.itemCode === id);
    if (!item) throw new Error("Beverage item not found");

    const backendItem = (await apiRequest(
      `/restaurant/beverage-inventory/${item.id}/stock`,
      {
        method: "PUT",
        body: JSON.stringify({ stock: newStock }),
      },
    )) as BackendBeverageInventory;
    return transformBeverageItem(backendItem);
  },

  createBeverageItem: async (itemData: {
    name: string;
    category: string;
    stock: number;
    minimumStock: number;
    unit: string;
    unitCost: number;
    supplier?: string;
  }): Promise<BeverageInventoryItem> => {
    const backendItem = (await apiRequest("/restaurant/beverage-inventory", {
      method: "POST",
      body: JSON.stringify(itemData),
    })) as BackendBeverageInventory;
    return transformBeverageItem(backendItem);
  },
};
