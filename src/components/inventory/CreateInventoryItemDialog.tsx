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
import { useTranslations } from "next-intl";

interface CreateInventoryItemDialogProps {
  onItemCreated?: () => void;
}

export function CreateInventoryItemDialog({
  onItemCreated,
}: CreateInventoryItemDialogProps) {
  const t = useTranslations("CreateInventoryItemDialog");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: InventoryItemFormData) => {
    setIsSubmitting(true);
    try {
      await inventoryService.createInventoryItem(data);

      toast.success(t("productCreated"));

      setOpen(false);
      onItemCreated?.();
    } catch (error) {
      console.error("Error creating inventory item:", error);
      toast.error(t("errorCreating"));
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
          {t("addProduct")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <InventoryItemForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitLabel={t("createProduct")}
        />
      </DialogContent>
    </Dialog>
  );
}
