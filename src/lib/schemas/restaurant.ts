import { z } from "zod";

// Menu Item Schema
export const menuItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be greater than 0"),
  preparationTime: z.string().optional(),
  available: z.boolean(),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;

// Restock Schema
export const restockSchema = z.object({
  newStock: z.number().min(0, "Stock must be 0 or greater"),
});

export type RestockFormData = z.infer<typeof restockSchema>;

// Helper function to convert comma-separated string to array
export const stringToArray = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

// Helper function to convert array to comma-separated string
export const arrayToString = (arr: string[] | undefined): string => {
  return arr ? arr.join(", ") : "";
};
