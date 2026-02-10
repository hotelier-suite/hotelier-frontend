"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Define the schema based on the backend entity structure
function createInventoryItemSchema(t: (key: string) => string) {
  return z
    .object({
      name: z.string().min(1, t("nameRequired")).max(100, t("nameTooLong")),
      category: z.enum([
        "LINENS",
        "AMENITIES",
        "CLEANING_SUPPLIES",
        "FOOD_BEVERAGE",
        "MAINTENANCE",
        "OFFICE_SUPPLIES",
        "FURNITURE",
        "ELECTRONICS",
      ]),
      currentStock: z.number().min(0, t("currentStockMin")),
      minimumStock: z.number().min(0, t("minimumStockMin")),
      maximumStock: z.number().min(1, t("maximumStockMin")),
      unit: z.string().min(1, t("unitRequired")).max(20, t("unitTooLong")),
      unitCost: z.number().min(0, t("costMin")),
      supplier: z
        .string()
        .min(1, t("supplierRequired"))
        .max(100, t("supplierTooLong")),
      description: z.string().optional(),
      location: z.string().optional(),
      supplierId: z.number().optional(),
      lastRestockDate: z.string().nullable().optional(),
    })
    .refine((data) => data.maximumStock >= data.minimumStock, {
      message: t("maxGteMin"),
      path: ["maximumStock"],
    })
    .refine((data) => data.maximumStock >= data.currentStock, {
      message: t("maxGteCurrent"),
      path: ["maximumStock"],
    });
}

export type InventoryItemFormData = z.infer<
  ReturnType<typeof createInventoryItemSchema>
>;

interface InventoryItemFormProps {
  initialData?: Partial<InventoryItemFormData>;
  onSubmit: (data: InventoryItemFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function InventoryItemForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
}: InventoryItemFormProps) {
  const t = useTranslations("InventoryItemForm");

  const resolvedSubmitLabel = submitLabel || t("save");

  const inventoryItemSchema = createInventoryItemSchema(t);

  const categoryLabels = {
    LINENS: t("linens"),
    AMENITIES: t("amenities"),
    CLEANING_SUPPLIES: t("cleaningSupplies"),
    FOOD_BEVERAGE: t("foodBeverage"),
    MAINTENANCE: t("maintenance"),
    OFFICE_SUPPLIES: t("officeSupplies"),
    FURNITURE: t("furniture"),
    ELECTRONICS: t("electronics"),
  };

  const form = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || undefined,
      currentStock: initialData?.currentStock || 0,
      minimumStock: initialData?.minimumStock || 0,
      maximumStock: initialData?.maximumStock || 0,
      unit: initialData?.unit || "",
      unitCost: initialData?.unitCost || 0,
      supplier: initialData?.supplier || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      supplierId: initialData?.supplierId || undefined,
      lastRestockDate: initialData?.lastRestockDate || undefined,
    },
  });

  const handleSubmit = async (data: InventoryItemFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("productName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("productNamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("category")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("currentStock")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimumStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("minimumStock")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>{t("minimumStockDesc")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maximumStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("maximumStock")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>{t("maximumStockDesc")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("unitOfMeasure")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("unitPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("unitCost")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("supplier")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("supplierPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("locationOptional")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("locationPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastRestockDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("lastRestockDate")}</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("descriptionOptional")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {resolvedSubmitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
