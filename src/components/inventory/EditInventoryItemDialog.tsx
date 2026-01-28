"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InventoryItemForm,
  type InventoryItemFormData,
} from "./InventoryItemForm";
import { type InventoryItem } from "@/lib/features/inventory/types";
import { inventoryService } from "@/lib/features/inventory/service";
import { toast } from "sonner";

interface EditInventoryItemDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemUpdated?: () => void;
}

export function EditInventoryItemDialog({
  item,
  open,
  onOpenChange,
  onItemUpdated,
}: EditInventoryItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: InventoryItemFormData) => {
    if (!item) return;

    setIsSubmitting(true);
    try {
      await inventoryService.updateInventoryItem(item.id, data);

      toast.success("Product updated successfully");

      onOpenChange(false);
      onItemUpdated?.();
    } catch (error) {
      console.error("Error updating inventory item:", error);
      toast.error("Could not update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  // Transform item data to form data format
  const getInitialData = (): Partial<InventoryItemFormData> | undefined => {
    if (!item) return undefined;

    // Make sure to parse the date correctly
    let lastRestockDate: Date | undefined;
    try {
      lastRestockDate = item.lastPurchaseDate
        ? new Date(item.lastPurchaseDate)
        : undefined;
    } catch (e) {
      console.error("Error parsing lastPurchaseDate:", e);
      lastRestockDate = undefined;
    }

    return {
      name: item.name,
      category: item.category as
        | "LINENS"
        | "AMENITIES"
        | "CLEANING_SUPPLIES"
        | "FOOD_BEVERAGE"
        | "MAINTENANCE"
        | "OFFICE_SUPPLIES"
        | "FURNITURE"
        | "ELECTRONICS",
      currentStock: item.currentStock,
      minimumStock: item.minimumStock,
      maximumStock: item.maximumStock,
      unit: item.unit,
      unitCost: item.unitCost,
      supplier: item.supplier,
      description: "", // Not available in current InventoryItem type
      location: item.location,
      supplierId: undefined, // Not available in current InventoryItem type
      lastRestockDate: lastRestockDate
        ? lastRestockDate.toISOString()
        : undefined,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Modify the product information. Marked fields are required.
          </DialogDescription>
        </DialogHeader>

        {item && (
          <InventoryItemForm
            initialData={getInitialData()}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
