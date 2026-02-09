"use client";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface ParkingSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ParkingSearch({
  searchTerm,
  onSearchChange,
}: ParkingSearchProps) {
  const t = useTranslations("ParkingSearch");
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
