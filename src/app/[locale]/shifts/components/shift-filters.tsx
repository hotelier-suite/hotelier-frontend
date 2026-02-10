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
import { Search } from "lucide-react";

interface ShiftFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (filter: string) => void;
}

export function ShiftFilters({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  departmentFilter,
  setDepartmentFilter,
}: ShiftFiltersProps) {
  const t = useTranslations("ShiftFiltersComp");
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchEmployee")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-80"
        />
      </div>

      <Input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-40"
      />

      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t("department")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all")}</SelectItem>
          <SelectItem value="RECEPTION">{t("reception")}</SelectItem>
          <SelectItem value="HOUSEKEEPING">{t("housekeeping")}</SelectItem>
          <SelectItem value="RESTAURANT">{t("restaurant")}</SelectItem>
          <SelectItem value="MAINTENANCE">{t("maintenance")}</SelectItem>
          <SelectItem value="SECURITY">{t("security")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
