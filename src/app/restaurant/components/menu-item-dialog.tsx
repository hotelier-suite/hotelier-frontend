"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { restaurantService } from "@/lib/features/restaurant/service";
import type { MenuItem } from "@/lib/features/restaurant/types";
import { MenuItemFormData } from "@/lib/schemas/restaurant";
import { MenuItemForm } from "./menu-item-form";

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: MenuItem;
  onSuccess?: () => void;
}

export function MenuItemDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: MenuItemDialogProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!item;

  const handleSubmit = async (data: MenuItemFormData) => {
    setLoading(true);
    try {
      const payload = {
        category: data.category,
        name: data.name,
        price: data.price,
        available: data.available,
        ...(data.description &&
          data.description.trim() && { description: data.description.trim() }),
        ...(data.preparationTime &&
          data.preparationTime.trim() && {
            preparationTime: data.preparationTime.trim(),
          }),
        ...(data.ingredients?.length && { ingredients: data.ingredients }),
        ...(data.allergens?.length && { allergens: data.allergens }),
      };

      if (isEditing) {
        await restaurantService.updateMenuItem(item, payload);
        toast("Item updated", {
          description: `${data.name} has been updated successfully`,
        });
      } else {
        await restaurantService.createMenuItem(payload);
        toast("Item created", {
          description: `${data.name} has been created successfully`,
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving menu item:", error);
      let errorMessage = `Could not ${isEditing ? "update" : "create"} the menu item`;

      if (error instanceof Error) {
        if (
          error.message.includes("Access denied") ||
          error.message.includes("403")
        ) {
          errorMessage =
            "You don't have permission to perform this action. Contact the administrator.";
        } else if (
          error.message.includes("Authentication required") ||
          error.message.includes("401")
        ) {
          errorMessage = "Your session has expired. Please log in again.";
        } else if (
          error.message.includes("not found") ||
          error.message.includes("404")
        ) {
          errorMessage = "The menu item was not found.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      toast("Error", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Menu Item" : "Create New Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <MenuItemForm
          item={item}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
