// Inventory types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  supplier: string;
  location: string;
  lastPurchaseDate: string | null;
  status: "available" | "low_stock" | "critical" | "out_of_stock";
}

export interface InventoryMovement {
  id: string;
  type: "inbound" | "outbound";
  item: string;
  quantity: number;
  date: string;
  reason: string;
  user: string;
  reference?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  deliveryTime: string;
  paymentTerms: string;
}

export interface BackendInventoryMovement {
  id: number;
  type: "INBOUND" | "OUTBOUND" | "ADJUSTMENT" | "OUT" | "IN";
  inventoryId: number;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  cost?: string | null;
  user: string;
  responsible: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  inventory?: {
    id: number;
    name: string;
    category: string;
    currentStock: number;
    unit: string;
  };
}

export interface BackendInventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  unitCost: number;
  supplier: string;
  location: string;
  lastPurchaseDate: string | null;
  status: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED";
  createdAt: string;
  updatedAt: string;
}

export interface BackendSupplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  category?: string;
  rating?: number;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoryStats: Record<
    string,
    { count: number; value: number; lowStock: number }
  >;
}

export interface InventoryFilters {
  category?: string;
  status?: string;
}
