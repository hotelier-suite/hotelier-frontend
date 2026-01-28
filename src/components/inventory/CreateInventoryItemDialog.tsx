"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  InventoryItemForm,
  type InventoryItemFormData,
} from "./InventoryItemForm";
import { inventoryService } from "@/lib/features/inventory/service";
import { toast } from "sonner";

interface CreateInventoryItemDialogProps {
  onItemCreated?: () => void;
}

export function CreateInventoryItemDialog({
  onItemCreated,
}: CreateInventoryItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: InventoryItemFormData) => {
    setIsSubmitting(true);
    try {
      await inventoryService.createInventoryItem(data);

      toast.success("Product created successfully");

      setOpen(false);
      onItemCreated?.();
    } catch (error) {
      console.error("Error creating inventory item:", error);
      toast.error("Could not create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product to Inventory</DialogTitle>
          <DialogDescription>
            Complete the information for the new product. Marked fields are
            required.
          </DialogDescription>
        </DialogHeader>

        <InventoryItemForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitLabel="Create Product"
        />
      </DialogContent>
    </Dialog>
  );
}
