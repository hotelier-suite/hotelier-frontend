"use client";

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
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employee..."
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
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="RECEPTION">Reception</SelectItem>
          <SelectItem value="HOUSEKEEPING">Housekeeping</SelectItem>
          <SelectItem value="RESTAURANT">Restaurant</SelectItem>
          <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
          <SelectItem value="SECURITY">Security</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
