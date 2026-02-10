"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { restaurantService } from "@/lib/features/restaurant/service";
import type { BeverageInventoryItem } from "@/lib/features/restaurant/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRestockSchema, RestockFormData } from "@/lib/schemas/restaurant";

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: BeverageInventoryItem;
  onSuccess?: () => void;
}

export function RestockDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: RestockDialogProps) {
  const t = useTranslations("RestockDialogComp");
  const [loading, setLoading] = useState(false);

  const restockSchema = createRestockSchema(t);

  const form = useForm<RestockFormData>({
    resolver: zodResolver(restockSchema),
    defaultValues: {
      newStock: item?.stock || 0,
    },
  });

  const handleSubmit = async (data: RestockFormData) => {
    if (!item) return;

    setLoading(true);
    try {
      await restaurantService.updateBeverageItem(item.id, {
        stock: data.newStock,
      });

      toast(t("inventoryUpdated"), {
        description: t("updatedStock", {
          name: item.name,
          stock: data.newStock,
        }),
      });

      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast(t("error"), {
        description: t("couldNotUpdate"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("updateStock", { name: item.name })}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newStock">{t("newStockTotal")} *</Label>
            <Input
              id="newStock"
              type="number"
              min="0"
              placeholder={t("newStockPlaceholder")}
              {...form.register("newStock", { valueAsNumber: true })}
            />
            {form.formState.errors.newStock && (
              <p className="text-sm text-red-500">
                {form.formState.errors.newStock.message}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-3 rounded-md space-y-1">
            <p className="text-sm text-gray-600">
              <strong>{t("currentStock")}:</strong> {item.stock} {item.unit}
            </p>
            <p className="text-sm text-gray-600">
              <strong>{t("minimumStock")}:</strong> {item.minimumStock}{" "}
              {item.unit}
            </p>
            <p className="text-sm text-gray-600">
              <strong>{t("supplierLabel")}:</strong> {item.supplier}
            </p>
            <p className="text-sm text-gray-600">
              <strong>{t("unitCost")}:</strong> {formatCurrency(item.unitCost)}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("updating") : t("updateStockBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
