import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { RecreationalFacility } from "@/lib/features/recreational/types";

interface BookingsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  facilityFilter: string;
  onFacilityChange: (value: string) => void;
  facilities: RecreationalFacility[];
}

export function BookingsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  facilityFilter,
  onFacilityChange,
  facilities,
}: BookingsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest, email or room..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
          <SelectItem value="CHECKED_IN">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
          <SelectItem value="NO_SHOW">No Show</SelectItem>
        </SelectContent>
      </Select>

      <Select value={facilityFilter} onValueChange={onFacilityChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Facility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All facilities</SelectItem>
          {facilities.map((facility) => (
            <SelectItem key={facility.id} value={facility.id.toString()}>
              {facility.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
