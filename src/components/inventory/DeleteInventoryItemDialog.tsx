"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type InventoryItem } from "@/lib/features/inventory/types";
import { inventoryService } from "@/lib/features/inventory/service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeleteInventoryItemDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemDeleted?: () => void;
}

export function DeleteInventoryItemDialog({
  item,
  open,
  onOpenChange,
  onItemDeleted,
}: DeleteInventoryItemDialogProps) {
  const t = useTranslations("DeleteInventoryItemDialog");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    try {
      await inventoryService.deleteInventoryItem(item.id);

      toast.success(t("productDeleted"));

      onOpenChange(false);
      onItemDeleted?.();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      toast.error(t("errorDeleting"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!item) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description", { name: item.name })}
            {item.currentStock > 0 && (
              <span className="block mt-2 text-amber-600 font-medium">
                {t("stockWarning", {
                  stock: item.currentStock,
                  unit: item.unit,
                })}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
