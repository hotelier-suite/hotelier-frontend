"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface InventoryFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function InventoryFilters({
  searchTerm,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
}: InventoryFiltersProps) {
  const t = useTranslations("InventoryFilters");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              <SelectItem value="CLEANING_SUPPLIES">{t("supplies")}</SelectItem>
              <SelectItem value="LINENS">{t("linens")}</SelectItem>
              <SelectItem value="AMENITIES">{t("amenities")}</SelectItem>
              <SelectItem value="ELECTRONICS">{t("electronics")}</SelectItem>
              <SelectItem value="MAINTENANCE">{t("maintenance")}</SelectItem>
              <SelectItem value="HOUSEKEEPING">{t("housekeeping")}</SelectItem>
              <SelectItem value="FOOD_BEVERAGE">{t("foodBeverage")}</SelectItem>
              <SelectItem value="OFFICE">{t("office")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
