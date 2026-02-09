import { z } from "zod";

// Menu Item Schema
export function createMenuItemSchema(t: (key: string) => string) {
  return z.object({
    category: z.string().min(1, t("validation.categoryRequired")),
    name: z.string().min(1, t("validation.nameRequired")),
    description: z.string().optional(),
    price: z.number().min(0, t("validation.priceMin")),
    preparationTime: z.string().optional(),
    available: z.boolean(),
    ingredients: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
  });
}

export type MenuItemFormData = z.infer<ReturnType<typeof createMenuItemSchema>>;

// Restock Schema
export function createRestockSchema(t: (key: string) => string) {
  return z.object({
    newStock: z.number().min(0, t("validation.stockMin")),
  });
}

export type RestockFormData = z.infer<ReturnType<typeof createRestockSchema>>;

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
