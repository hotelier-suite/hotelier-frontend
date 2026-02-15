"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const t = useTranslations("MenuItemDialogComp");
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
        toast(t("itemUpdated"), {
          description: t("itemUpdatedDesc", { name: data.name }),
        });
      } else {
        await restaurantService.createMenuItem(payload);
        toast(t("itemCreated"), {
          description: t("itemCreatedDesc", { name: data.name }),
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving menu item:", error);
      let errorMessage = t(isEditing ? "couldNotUpdate" : "couldNotCreate");

      if (error instanceof Error) {
        if (
          error.message.includes("Access denied") ||
          error.message.includes("403")
        ) {
          errorMessage = t("noPermission");
        } else if (
          error.message.includes("Authentication required") ||
          error.message.includes("401")
        ) {
          errorMessage = t("sessionExpired");
        } else if (
          error.message.includes("not found") ||
          error.message.includes("404")
        ) {
          errorMessage = t("itemNotFound");
        }
      }

      toast(t("error"), {
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t("editDescription") : t("createDescription")}
          </DialogDescription>
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
