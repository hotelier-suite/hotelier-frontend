"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, Plus } from "lucide-react";
import type { BeverageInventoryItem } from "@/lib/features/restaurant/types";
import { RestockDialog } from "./restock-dialog";

interface InventoryTableProps {
  items: BeverageInventoryItem[];
  onRestock: (itemId: string, newStock: number) => void;
  onRefresh?: () => void;
}

export function InventoryTable({
  items,
  /* onRestock, */ onRefresh,
}: InventoryTableProps) {
  const t = useTranslations("RestaurantInventoryTable");
  const [selectedItem, setSelectedItem] = useState<
    BeverageInventoryItem | undefined
  >();
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);

  const handleRestockClick = (item: BeverageInventoryItem) => {
    setSelectedItem(item);
    setRestockDialogOpen(true);
  };

  const handleRestockSuccess = () => {
    onRefresh?.();
  };

  const getStatusBadge = (item: BeverageInventoryItem) => {
    switch (item.status) {
      case "available":
        return <Badge variant="default">{t("available")}</Badge>;
      case "low_stock":
        return <Badge variant="secondary">{t("lowStock")}</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">{t("outOfStock")}</Badge>;
      default:
        return <Badge variant="outline">{t("unknown")}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("product")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("stock")}</TableHead>
                <TableHead>{t("minimum")}</TableHead>
                <TableHead>{t("unit")}</TableHead>
                <TableHead>{t("costUnit")}</TableHead>
                <TableHead>{t("supplier")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {item.stock}
                      {item.stock <= item.minimumStock && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.minimumStock}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestockClick(item)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t("restock")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {items.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              {t("noItems")}
            </div>
          )}
        </CardContent>
      </Card>

      <RestockDialog
        open={restockDialogOpen}
        onOpenChange={setRestockDialogOpen}
        item={selectedItem}
        onSuccess={handleRestockSuccess}
      />
    </>
  );
}
