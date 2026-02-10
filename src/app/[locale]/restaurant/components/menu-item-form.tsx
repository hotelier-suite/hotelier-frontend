"use client";

import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import {
  createMenuItemSchema,
  MenuItemFormData,
  stringToArray,
  arrayToString,
} from "@/lib/schemas/restaurant";
import type { MenuItem } from "@/lib/features/restaurant/types";

interface MenuItemFormProps {
  item?: MenuItem;
  onSubmit: (data: MenuItemFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export function MenuItemForm({
  item,
  onSubmit,
  onCancel,
  loading,
}: MenuItemFormProps) {
  const t = useTranslations("MenuItemFormComp");
  const isEditing = !!item;

  const categories = [
    { value: "Appetizers", label: t("appetizers") },
    { value: "Main Courses", label: t("mainCourses") },
    { value: "Desserts", label: t("desserts") },
    { value: "Beverages", label: t("beverages") },
    { value: "Specials", label: t("specials") },
  ];

  const menuItemSchema = createMenuItemSchema(t);

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      category: item?.category || "",
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 0,
      preparationTime: item?.preparationTime || "",
      available: item?.available ?? true,
      ingredients: item?.ingredients || [],
      allergens: item?.allergens || [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const handleFormSubmit = (data: MenuItemFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">{t("category")} *</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{t("price")} *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t("name")} *</Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea
          id="description"
          placeholder={t("descriptionPlaceholder")}
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preparationTime">{t("preparationTime")}</Label>
        <Input
          id="preparationTime"
          placeholder={t("prepTimePlaceholder")}
          {...register("preparationTime")}
        />
        {errors.preparationTime && (
          <p className="text-sm text-red-600">
            {errors.preparationTime.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredients">{t("ingredients")}</Label>
        <Controller
          name="ingredients"
          control={control}
          render={({ field }) => (
            <Textarea
              id="ingredients"
              placeholder={t("ingredientsPlaceholder")}
              rows={2}
              value={arrayToString(field.value)}
              onChange={(e) => field.onChange(stringToArray(e.target.value))}
            />
          )}
        />
        {errors.ingredients && (
          <p className="text-sm text-red-600">{errors.ingredients.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergens">{t("allergens")}</Label>
        <Controller
          name="allergens"
          control={control}
          render={({ field }) => (
            <Input
              id="allergens"
              placeholder={t("allergensPlaceholder")}
              value={arrayToString(field.value)}
              onChange={(e) => field.onChange(stringToArray(e.target.value))}
            />
          )}
        />
        {errors.allergens && (
          <p className="text-sm text-red-600">{errors.allergens.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">{t("available")}</Label>
          <div className="text-sm text-muted-foreground">
            {t("availableDesc")}
          </div>
        </div>
        <Controller
          name="available"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? t("updating")
              : t("creating")
            : isEditing
              ? t("update")
              : t("create")}
        </Button>
      </div>
    </form>
  );
}
