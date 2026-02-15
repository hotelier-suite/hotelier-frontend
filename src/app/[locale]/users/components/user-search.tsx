"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function UserSearch({ searchTerm, onSearchChange }: UserSearchProps) {
  const t = useTranslations("UserSearch");
  return (
    <div className="mb-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("placeholder")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}
