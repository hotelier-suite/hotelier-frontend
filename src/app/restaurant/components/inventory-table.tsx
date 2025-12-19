"use client";

import { useState } from "react";
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
import { BeverageInventoryItem } from "@/lib/api/restaurant";
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
        return <Badge variant="default">Available</Badge>;
      case "low_stock":
        return <Badge variant="secondary">Low Stock</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Beverage and Food Inventory</CardTitle>
          <CardDescription>Stock control and restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Minimum</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
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
                  <TableCell>${item.unitCost}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestockClick(item)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Restock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {items.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No inventory items available
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
