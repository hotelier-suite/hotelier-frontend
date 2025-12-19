"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { MenuItem } from "@/lib/api/restaurant";

const orderItemSchema = z.object({
  menuItemId: z
    .string({ message: "Select a product" })
    .min(1, "Select a product"),
  quantity: z
    .number({ message: "Quantity is required" })
    .min(1, "Quantity must be greater than 0")
    .max(99, "Quantity must be less than 100"),
  specialRequests: z.string().optional(),
});

const newOrderSchema = z.object({
  roomNumber: z
    .string({ message: "Room number is required" })
    .min(1, "Enter room number")
    .max(10, "Room number too long"),
  guestName: z
    .string({ message: "Guest name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  specialInstructions: z
    .string()
    .max(500, "Instructions must be at most 500 characters")
    .optional(),
  selectedItems: z
    .array(orderItemSchema)
    .min(1, "Must add at least one product"),
});

type NewOrderFormData = z.infer<typeof newOrderSchema>;

interface NewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItems: MenuItem[];
  onCreateOrder: (orderData: NewOrderFormData) => void;
  isLoading?: boolean;
}

export function NewOrderDialog({
  open,
  onOpenChange,
  menuItems,
  onCreateOrder,
  isLoading = false,
}: NewOrderDialogProps) {
  const form = useForm<NewOrderFormData>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      roomNumber: "",
      guestName: "",
      specialInstructions: "",
      selectedItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "selectedItems",
  });

  const onSubmit = (data: NewOrderFormData) => {
    onCreateOrder(data);
    form.reset();
    onOpenChange(false);
  };

  const addItemToOrder = () => {
    append({ menuItemId: "", quantity: 1, specialRequests: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Room Service Order</DialogTitle>
          <DialogDescription>
            Create a new order for room service
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNumber">Room *</Label>
              <Input
                id="roomNumber"
                {...form.register("roomNumber")}
                placeholder="101"
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.roomNumber ? "border-red-500" : ""
                }
              />
              {form.formState.errors.roomNumber && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.roomNumber.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="guestName">Guest Name *</Label>
              <Input
                id="guestName"
                {...form.register("guestName")}
                placeholder="John Doe"
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.guestName ? "border-red-500" : ""
                }
              />
              {form.formState.errors.guestName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.guestName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Products</Label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 p-3 border rounded-lg"
                >
                  <Controller
                    control={form.control}
                    name={`selectedItems.${index}.menuItemId`}
                    render={({ field: controllerField }) => (
                      <Select
                        value={controllerField.value}
                        onValueChange={controllerField.onChange}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuItems
                            .filter((menuItem) => menuItem.available)
                            .map((menuItem) => (
                              <SelectItem key={menuItem.id} value={menuItem.id}>
                                {menuItem.name} - $
                                {menuItem.price.toLocaleString()}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    type="number"
                    className="w-20"
                    placeholder="Qty."
                    min="1"
                    {...form.register(`selectedItems.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    disabled={form.formState.isSubmitting}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={form.formState.isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addItemToOrder}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="specialInstructions">
              Special Instructions
            </Label>
            <Textarea
              id="specialInstructions"
              {...form.register("specialInstructions")}
              placeholder="Special instructions for the order..."
              disabled={form.formState.isSubmitting}
              className={
                form.formState.errors.specialInstructions
                  ? "border-red-500"
                  : ""
              }
            />
            {form.formState.errors.specialInstructions && (
              <p className="text-sm text-red-500">
                {form.formState.errors.specialInstructions.message}
              </p>
            )}
          </div>

          {form.formState.errors.selectedItems && (
            <p className="text-sm text-red-500">
              {form.formState.errors.selectedItems.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              className="flex-1"
            >
              {(isLoading || form.formState.isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Order
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
