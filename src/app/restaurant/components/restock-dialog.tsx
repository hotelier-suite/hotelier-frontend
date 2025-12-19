"use client";

import { useState } from "react";
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
import { BeverageInventoryItem, restaurantApi } from "@/lib/api/restaurant";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restockSchema, RestockFormData } from "@/lib/schemas/restaurant";

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
  const [loading, setLoading] = useState(false);

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
      await restaurantApi.updateBeverageStock(item.id, data.newStock);

      toast("Inventory updated", {
        description: `Updated ${item.name} stock to ${data.newStock} units`,
      });

      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast("Error", {
        description: "Could not update the inventory",
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
          <DialogTitle>Update Stock: {item.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newStock">New stock total *</Label>
            <Input
              id="newStock"
              type="number"
              min="0"
              placeholder="New stock"
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
              <strong>Current stock:</strong> {item.stock} {item.unit}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Minimum stock:</strong> {item.minimumStock} {item.unit}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Supplier:</strong> {item.supplier}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Unit cost:</strong> ${item.unitCost}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
