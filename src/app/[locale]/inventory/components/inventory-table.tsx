"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck } from "lucide-react";
import { InventoryItem } from "@/lib/features/inventory/types";

interface InventoryTableProps {
  items: InventoryItem[];
  onReorder: (itemId: string) => void;
}

export function InventoryTable({ items, onReorder }: InventoryTableProps) {
  const t = useTranslations("InventoryTable");
  const getStockBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("available")}
          </Badge>
        );
      case "low_stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("lowStock")}
          </Badge>
        );
      case "out_of_stock":
        return (
          <Badge className="bg-red-100 text-red-800">{t("outOfStock")}</Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t(`statuses.${status.toUpperCase()}`)}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("productsFound", { count: items.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("product")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{t("stock")}</TableHead>
              <TableHead>{t("minMax")}</TableHead>
              <TableHead>{t("unitCost")}</TableHead>
              <TableHead>{t("totalValue")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {t(`categories.${item.category}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {item.currentStock} {t(`units.${item.unit}`)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          item.currentStock <= item.minimumStock
                            ? "bg-red-600"
                            : item.currentStock <= item.minimumStock * 1.5
                              ? "bg-yellow-600"
                              : "bg-green-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            (item.currentStock / item.maximumStock) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {t("minLabel")}: {item.minimumStock}
                    </div>
                    <div>
                      {t("maxLabel")}: {item.maximumStock}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                <TableCell>
                  {formatCurrency(item.currentStock * item.unitCost)}
                </TableCell>
                <TableCell>{getStockBadge(item.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {(item.status === "low_stock" ||
                      item.status === "critical" ||
                      item.status === "out_of_stock") && (
                      <Button size="sm" onClick={() => onReorder(item.id)}>
                        <Truck className="mr-2 h-4 w-4" />
                        {t("restock")}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
