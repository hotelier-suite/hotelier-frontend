"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  Edit2,
  Trash2,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type InventoryItem } from "@/lib/features/inventory/types";
import { inventoryService } from "@/lib/features/inventory/service";
import { CreateInventoryItemDialog } from "@/components/inventory/CreateInventoryItemDialog";
import { EditInventoryItemDialog } from "@/components/inventory/EditInventoryItemDialog";
import { DeleteInventoryItemDialog } from "@/components/inventory/DeleteInventoryItemDialog";

export default function InventoryPage() {
  const t = useTranslations("InventoryPage");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dialog states
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

  const fetchInventoryData = async () => {
    try {
      const inventoryData = await inventoryService.getInventoryItems();
      setItems(inventoryData);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setItems([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchInventoryData();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInventoryData();
    setRefreshing(false);
  };

  const handleItemCreated = () => {
    fetchInventoryData();
  };

  const handleItemUpdated = () => {
    fetchInventoryData();
    setEditingItem(null);
  };

  const handleItemDeleted = () => {
    fetchInventoryData();
    setDeletingItem(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  const totalItems = items.length;
  const lowStockItems = items.filter(
    (item) => item.status === "low_stock" || item.status === "critical",
  );
  const sufficientItems = items.filter((item) => item.status === "available");
  const criticalItems = items.filter((item) => item.status === "critical");

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-end items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {t("refresh")}
          </Button>
          <CreateInventoryItemDialog onItemCreated={handleItemCreated} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalItems")}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {t("productsInInventory")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("criticalStock")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("requiresImmediateAttention")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("lowStock")}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("needsRestocking")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("sufficientStock")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sufficientItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("inGoodCondition")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("inventoryStatus")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>{t("noProductsInInventory")}</p>
                <p className="text-sm">{t("startByAddingFirstProduct")}</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent hover:shadow-sm transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                      {item.location && (
                        <p className="text-xs text-muted-foreground">
                          📍 {item.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">
                        {t("stock")} {item.currentStock}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("min")} {item.minimumStock}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === "critical"
                          ? "destructive"
                          : item.status === "low_stock"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {item.status === "critical"
                        ? t("critical")
                        : item.status === "low_stock"
                          ? t("low")
                          : item.status === "out_of_stock"
                            ? t("outOfStock")
                            : t("available")}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t("openMenu")}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingItem(item)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingItem(item)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditInventoryItemDialog
        item={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        onItemUpdated={handleItemUpdated}
      />

      {/* Delete Dialog */}
      <DeleteInventoryItemDialog
        item={deletingItem}
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        onItemDeleted={handleItemDeleted}
      />
    </div>
  );
}
