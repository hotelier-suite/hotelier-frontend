import { apiRequest } from "./base";

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

// Backend types matching the backend DTOs
interface BackendInventoryItem {
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

interface BackendSupplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  category?: string;
  rating?: number;
}

// Transform functions to convert backend data to frontend format
function transformInventoryItem(
  backendItem: BackendInventoryItem,
): InventoryItem {
  // Ensure date is in YYYY-MM-DD format
  const formattedDate = backendItem.lastPurchaseDate
    ? new Date(backendItem.lastPurchaseDate).toISOString().split("T")[0]
    : null;

  return {
    id: backendItem.id.toString(),
    name: backendItem.name,
    category: backendItem.category,
    currentStock: backendItem.currentStock,
    minimumStock: backendItem.minimumStock,
    maximumStock: backendItem.maximumStock,
    unit: backendItem.unit,
    unitCost: backendItem.unitCost,
    totalValue: backendItem.currentStock * backendItem.unitCost,
    supplier: backendItem.supplier,
    location: backendItem.location,
    lastPurchaseDate: formattedDate,
    status:
      backendItem.status === "AVAILABLE"
        ? "available"
        : backendItem.status === "LOW_STOCK"
          ? "low_stock"
          : backendItem.status === "OUT_OF_STOCK"
            ? "out_of_stock"
            : "critical",
  };
}

function transformInventoryMovement(
  backendMovement: BackendInventoryMovement,
): InventoryMovement {
  // Map backend movement types to English
  let movementType: "inbound" | "outbound" = "outbound";
  if (backendMovement.type === "INBOUND" || backendMovement.type === "IN") {
    movementType = "inbound";
  } else if (backendMovement.type === "ADJUSTMENT") {
    movementType = backendMovement.quantity > 0 ? "inbound" : "outbound";
  }

  return {
    id: backendMovement.id.toString(),
    type: movementType,
    item: backendMovement.inventory?.name || "Unknown product",
    quantity: Math.abs(backendMovement.quantity), // Use absolute value for display
    date: backendMovement.createdAt.split("T")[0],
    reason: backendMovement.reason,
    user: backendMovement.responsible || "Unknown user",
  };
}

function transformSupplier(backendSupplier: BackendSupplier): Supplier {
  return {
    id: backendSupplier?.id ? backendSupplier.id.toString() : "0",
    name: backendSupplier?.name || "Unknown supplier",
    contact: backendSupplier?.contact || "",
    phone: backendSupplier?.phone || "",
    email: backendSupplier?.email || "",
    address: backendSupplier?.address || "",
    products: [], // Default value since not in backend
    deliveryTime: "3-5 days", // Default value since not in backend
    paymentTerms: "30 days", // Default value since not in backend
  };
}

// Inventory API client
export const inventoryApi = {
  // Inventory items
  getInventoryItems: async (filters?: {
    category?: string;
    status?: string;
  }): Promise<InventoryItem[]> => {
    const params = new URLSearchParams();
    if (filters?.category) {
      params.append("category", filters.category);
    }
    if (filters?.status) {
      const statusMap: Record<string, string> = {
        available: "AVAILABLE",
        low_stock: "LOW_STOCK",
        out_of_stock: "OUT_OF_STOCK",
        critical: "DISCONTINUED",
      };
      params.append("status", statusMap[filters.status] || filters.status);
    }
    const queryString = params.toString();
    const url = queryString
      ? `/inventory/items?${queryString}`
      : "/inventory/items";
    const backendItems = (await apiRequest(url)) as BackendInventoryItem[];
    return backendItems.map(transformInventoryItem);
  },

  getInventoryItemsByCategory: async (
    category: string,
  ): Promise<InventoryItem[]> => {
    return inventoryApi.getInventoryItems({ category });
  },

  getInventoryItemsByStatus: async (
    status: string,
  ): Promise<InventoryItem[]> => {
    return inventoryApi.getInventoryItems({ status });
  },

  createInventoryItem: async (
    itemData: Partial<InventoryItem>,
  ): Promise<InventoryItem> => {
    const backendData = {
      name: itemData.name,
      category: itemData.category,
      currentStock: itemData.currentStock,
      minimumStock: itemData.minimumStock,
      maximumStock: itemData.maximumStock,
      unit: itemData.unit,
      unitCost: itemData.unitCost,
      supplier: itemData.supplier,
      location: itemData.location,
      lastPurchaseDate: itemData.lastPurchaseDate
        ? new Date(itemData.lastPurchaseDate)
        : undefined,
    };

    const backendItem = (await apiRequest("/inventory/items", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendInventoryItem;

    return transformInventoryItem(backendItem);
  },

  updateInventoryItem: async (
    id: string,
    itemData: Partial<InventoryItem>,
  ): Promise<InventoryItem> => {
    const backendData = {
      name: itemData.name,
      category: itemData.category,
      currentStock: itemData.currentStock,
      minimumStock: itemData.minimumStock,
      maximumStock: itemData.maximumStock,
      unit: itemData.unit,
      unitCost: itemData.unitCost,
      supplier: itemData.supplier,
      location: itemData.location,
      lastPurchaseDate: itemData.lastPurchaseDate
        ? new Date(itemData.lastPurchaseDate)
        : undefined,
    };

    const backendItem = (await apiRequest(`/inventory/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })) as BackendInventoryItem;

    return transformInventoryItem(backendItem);
  },

  deleteInventoryItem: async (id: string): Promise<void> => {
    await apiRequest(`/inventory/items/${id}`, {
      method: "DELETE",
    });
  },

  // Inventory movements
  getInventoryMovements: async (): Promise<InventoryMovement[]> => {
    try {
      const backendMovements = (await apiRequest(
        "/inventory/movements",
      )) as BackendInventoryMovement[];
      return backendMovements.map(transformInventoryMovement);
    } catch (error) {
      console.error("Error fetching inventory movements:", error);
      return [];
    }
  },

  createInventoryMovement: async (
    movementData: Partial<InventoryMovement>,
  ): Promise<InventoryMovement> => {
    const backendData = {
      type: movementData.type === "inbound" ? "INBOUND" : "OUTBOUND",
      itemName: movementData.item,
      quantity: movementData.quantity,
      user: movementData.user,
      reason: movementData.reason,
    };

    const backendMovement = (await apiRequest("/inventory/movements", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendInventoryMovement;

    return transformInventoryMovement(backendMovement);
  },

  // Suppliers
  getSuppliers: async (): Promise<Supplier[]> => {
    try {
      const backendSuppliers = (await apiRequest(
        "/inventory/suppliers",
      )) as BackendSupplier[];
      if (!backendSuppliers || !Array.isArray(backendSuppliers)) {
        return [];
      }
      return backendSuppliers.map(transformSupplier);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return [];
    }
  },

  createSupplier: async (
    supplierData: Partial<Supplier>,
  ): Promise<Supplier> => {
    const backendData = {
      name: supplierData.name,
      contact: supplierData.contact,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address,
    };

    const backendSupplier = (await apiRequest("/inventory/suppliers", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendSupplier;

    return transformSupplier(backendSupplier);
  },

  updateSupplier: async (
    id: string,
    supplierData: Partial<Supplier>,
  ): Promise<Supplier> => {
    const backendData = {
      name: supplierData.name,
      contact: supplierData.contact,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address,
    };

    const backendSupplier = (await apiRequest(`/inventory/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })) as BackendSupplier;

    return transformSupplier(backendSupplier);
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await apiRequest(`/inventory/suppliers/${id}`, {
      method: "DELETE",
    });
  },

  // Get inventory statistics
  getInventoryStats: async () => {
    try {
      const items = (await apiRequest(
        "/inventory/items",
      )) as BackendInventoryItem[];

      // Calculate stats
      const totalValue = items.reduce(
        (acc, item) => acc + item.currentStock * item.unitCost,
        0,
      );
      const lowStockCount = items.filter(
        (item) => item.currentStock <= item.minimumStock,
      ).length;
      const outOfStockCount = items.filter(
        (item) => item.currentStock === 0,
      ).length;

      // Group by category
      const categoryStats: Record<
        string,
        { count: number; value: number; lowStock: number }
      > = {};

      items.forEach((item) => {
        if (!categoryStats[item.category]) {
          categoryStats[item.category] = { count: 0, value: 0, lowStock: 0 };
        }
        categoryStats[item.category].count++;
        categoryStats[item.category].value += item.currentStock * item.unitCost;
        if (item.currentStock <= item.minimumStock) {
          categoryStats[item.category].lowStock++;
        }
      });

      return {
        totalItems: items.length,
        totalValue,
        lowStockCount,
        outOfStockCount,
        categoryStats,
      };
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
      return {
        totalItems: 0,
        totalValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        categoryStats: {},
      };
    }
  },
};
