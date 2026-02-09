"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
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
import type { MenuItem } from "@/lib/features/restaurant/types";

function createNewOrderSchema(t: (key: string) => string) {
  const orderItemSchema = z.object({
    menuItemId: z
      .string({ message: t("validationSelectProduct") })
      .min(1, t("validationSelectProduct")),
    quantity: z
      .number({ message: t("validationQuantityRequired") })
      .min(1, t("validationQuantityPositive"))
      .max(99, t("validationQuantityMax")),
    specialRequests: z.string().optional(),
  });

  return z.object({
    roomNumber: z
      .string({ message: t("validationRoomNumberRequired") })
      .min(1, t("validationEnterRoomNumber"))
      .max(10, t("validationRoomNumberTooLong")),
    guestName: z
      .string({ message: t("validationGuestNameRequired") })
      .min(2, t("validationNameMinLength"))
      .max(100, t("validationNameMaxLength")),
    specialInstructions: z
      .string()
      .max(500, t("validationInstructionsMaxLength"))
      .optional(),
    selectedItems: z
      .array(orderItemSchema)
      .min(1, t("validationMinOneProduct")),
  });
}

type NewOrderFormData = z.infer<ReturnType<typeof createNewOrderSchema>>;

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
  const t = useTranslations("NewOrderDialogComp");
  const newOrderSchema = createNewOrderSchema(t);
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
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNumber">{t("room")} *</Label>
              <Input
                id="roomNumber"
                {...form.register("roomNumber")}
                placeholder={t("placeholderRoom")}
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
              <Label htmlFor="guestName">{t("guestName")} *</Label>
              <Input
                id="guestName"
                {...form.register("guestName")}
                placeholder={t("placeholderGuestName")}
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
            <Label>{t("products")}</Label>
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
                          <SelectValue placeholder={t("selectProduct")} />
                        </SelectTrigger>
                        <SelectContent>
                          {menuItems
                            .filter((menuItem) => menuItem.available)
                            .map((menuItem) => (
                              <SelectItem key={menuItem.id} value={menuItem.id}>
                                {menuItem.name} -{" "}
                                {formatCurrency(menuItem.price)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    type="number"
                    className="w-20"
                    placeholder={t("qty")}
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
                {t("addProduct")}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="specialInstructions">
              {t("specialInstructions")}
            </Label>
            <Textarea
              id="specialInstructions"
              {...form.register("specialInstructions")}
              placeholder={t("specialInstructionsPlaceholder")}
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
              {t("createOrder")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
