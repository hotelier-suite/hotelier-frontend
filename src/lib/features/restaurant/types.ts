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
  orderDate: string;
  estimatedTime: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  waiter: string;
}

export interface MenuItem {
  id: string;
  backendId?: number;
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
export interface BackendRoomServiceOrder {
  id: number;
  orderNumber: string;
  room: string;
  guest: string;
  items: string | RoomServiceOrderItem[];
  total: number | string;
  orderDate: string;
  estimatedTime?: string | null;
  status: "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  waiter?: string | null;
  specialInstructions?: string | null;
}

export interface BackendMenuItem {
  id: number;
  itemCode: string;
  category: string;
  name: string;
  description?: string | null;
  price: number;
  available: boolean;
  preparationTime?: string | null;
  ingredients?: string | string[] | null;
  allergens?: string | string[] | null;
}

export interface BackendBeverageInventory {
  id: number;
  itemCode: string;
  name: string;
  category: string;
  stock: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
  supplier?: string | null;
  lastPurchase?: string | null;
  status: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";
}

export interface CreateRoomServiceOrderItem {
  item: string;
  quantity: number;
  price: number;
}

export interface CreateRoomServiceOrderData {
  room: string;
  guest: string;
  items: CreateRoomServiceOrderItem[];
  total: number;
  estimatedTime?: string;
  waiter?: string;
  specialInstructions?: string;
}

export interface UpdateRoomServiceOrderData {
  status?: "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  waiter?: string;
  estimatedTime?: string;
  specialInstructions?: string;
}

export interface CreateMenuItemData {
  category: string;
  name: string;
  description?: string;
  price: number;
  preparationTime?: string;
  ingredients?: string[] | Record<string, unknown>;
  allergens?: string[] | Record<string, unknown>;
}

export interface UpdateMenuItemData {
  category?: string;
  name?: string;
  description?: string;
  price?: number;
  available?: boolean;
  preparationTime?: string;
  ingredients?: string[] | Record<string, unknown>;
  allergens?: string[] | Record<string, unknown>;
}

export interface CreateBeverageItemData {
  name: string;
  category: string;
  stock: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
  supplier?: string;
}

export interface UpdateBeverageItemData {
  name?: string;
  category?: string;
  stock?: number;
  minimumStock?: number;
  unit?: string;
  unitCost?: number;
  supplier?: string;
}
