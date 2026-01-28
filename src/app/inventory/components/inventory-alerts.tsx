"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Truck } from "lucide-react";
import { InventoryItem } from "@/lib/features/inventory/types";
import { unitTranslations } from "@/lib/translations/inventory";

interface InventoryAlertsProps {
  items: InventoryItem[];
  onReorder: (itemId: string) => void;
}

export function InventoryAlerts({ items, onReorder }: InventoryAlertsProps) {
  const alertItems = items.filter(
    (item) =>
      item.status === "low_stock" ||
      item.status === "critical" ||
      item.status === "out_of_stock",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Alerts</CardTitle>
        <CardDescription>
          Items that require immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <AlertTriangle
                  className={`h-5 w-5 ${
                    item.status === "out_of_stock"
                      ? "text-red-600"
                      : item.status === "critical"
                        ? "text-red-500"
                        : "text-yellow-500"
                  }`}
                />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Current stock: {item.currentStock}{" "}
                    {unitTranslations[
                      item.unit as keyof typeof unitTranslations
                    ] || item.unit}
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => onReorder(item.id)}>
                <Truck className="mr-2 h-4 w-4" />
                Reorder
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
