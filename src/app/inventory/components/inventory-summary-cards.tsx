"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, TrendingUp, ShoppingCart } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unitCost: number;
  status: string;
}

interface InventoryMovement {
  id: number;
  itemId: number;
  type: string;
  quantity: number;
  date: string;
  notes?: string;
}

interface InventorySummaryCardsProps {
  inventoryItems: InventoryItem[];
  movements: InventoryMovement[];
}

export function InventorySummaryCards({
  inventoryItems,
  movements,
}: InventorySummaryCardsProps) {
  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(
    (item) => item.currentStock <= item.minimumStock,
  ).length;
  const totalValue = inventoryItems.reduce(
    (acc, item) => acc + item.currentStock * item.unitCost,
    0,
  );
  const todaysMovements = movements.filter(
    (mov) => mov.date === new Date().toISOString().split("T")[0],
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">Items in inventory</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
          <p className="text-xs text-muted-foreground">
            Require replenishment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Inventory value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Movements</CardTitle>
          <ShoppingCart className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todaysMovements}</div>
          <p className="text-xs text-muted-foreground">Entries and exits</p>
        </CardContent>
      </Card>
    </div>
  );
}
