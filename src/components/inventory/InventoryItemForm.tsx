"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
const inventoryItemSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
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
    currentStock: z.number().min(0, "Current stock must be greater than or equal to 0"),
    minimumStock: z.number().min(0, "Minimum stock must be greater than or equal to 0"),
    maximumStock: z.number().min(1, "Maximum stock must be greater than 0"),
    unit: z.string().min(1, "Unit is required").max(20, "Unit too long"),
    unitCost: z.number().min(0, "Cost must be greater than or equal to 0"),
    supplier: z
      .string()
      .min(1, "Supplier is required")
      .max(100, "Supplier name too long"),
    description: z.string().optional(),
    location: z.string().optional(),
    supplierId: z.number().optional(),
    lastRestockDate: z.string().nullable().optional(),
  })
  .refine((data) => data.maximumStock >= data.minimumStock, {
    message: "Maximum stock must be greater than or equal to minimum stock",
    path: ["maximumStock"],
  })
  .refine((data) => data.maximumStock >= data.currentStock, {
    message: "Maximum stock must be greater than or equal to current stock",
    path: ["maximumStock"],
  });

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

interface InventoryItemFormProps {
  initialData?: Partial<InventoryItemFormData>;
  onSubmit: (data: InventoryItemFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const categoryLabels = {
  LINENS: "Linens",
  AMENITIES: "Amenities",
  CLEANING_SUPPLIES: "Cleaning Supplies",
  FOOD_BEVERAGE: "Food & Beverage",
  MAINTENANCE: "Maintenance",
  OFFICE_SUPPLIES: "Office Supplies",
  FURNITURE: "Furniture",
  ELECTRONICS: "Electronics",
};

export function InventoryItemForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save",
}: InventoryItemFormProps) {
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
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g.: White cotton sheets"
                    {...field}
                  />
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
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                <FormLabel>Current Stock</FormLabel>
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
                <FormLabel>Minimum Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Minimum quantity before alerting about low stock
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maximumStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum storage capacity
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit of Measure</FormLabel>
                <FormControl>
                  <Input placeholder="E.g.: pieces, liters, kg" {...field} />
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
                <FormLabel>Unit Cost</FormLabel>
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
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier name" {...field} />
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
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="E.g.: Warehouse A, Shelf 3" {...field} />
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
                <FormLabel>
                  Last Restock Date (Optional)
                </FormLabel>
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
              <FormLabel>Description (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed product description..."
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
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
