import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";

interface AttendanceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
}

export function AttendanceFilters({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  selectedDate,
  onDateChange,
}: AttendanceFiltersProps) {
  const t = useTranslations("AttendanceFiltersComp");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchEmployee")}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Select value={departmentFilter} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t("department")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allDepartments")}</SelectItem>
              <SelectItem value="RECEPTION">{t("reception")}</SelectItem>
              <SelectItem value="HOUSEKEEPING">{t("housekeeping")}</SelectItem>
              <SelectItem value="MAINTENANCE">{t("maintenance")}</SelectItem>
              <SelectItem value="MANAGEMENT">{t("management")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="PRESENT">{t("present")}</SelectItem>
              <SelectItem value="ABSENT">{t("absent")}</SelectItem>
              <SelectItem value="LATE">{t("late")}</SelectItem>
              <SelectItem value="EARLY_LEAVE">{t("earlyLeave")}</SelectItem>
              <SelectItem value="SICK_LEAVE">{t("sickLeave")}</SelectItem>
              <SelectItem value="VACATION">{t("vacation")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full sm:w-[150px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
