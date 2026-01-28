"use client";

import { useState, useEffect, startTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Search, Filter, X, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  type AuditLogQuery,
  AuditAction,
  AuditResource,
} from "@/lib/features/audit/types";
import { cn } from "@/lib/utils";

interface AuditFiltersProps {
  query: AuditLogQuery;
  onQueryChange: (query: Partial<AuditLogQuery>) => void;
  loading?: boolean;
}

export function AuditFilters({
  query,
  onQueryChange,
  loading,
}: AuditFiltersProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    query.startDate ? new Date(query.startDate) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    query.endDate ? new Date(query.endDate) : undefined,
  );
  const [searchTerm, setSearchTerm] = useState(query.search || "");

  // Update local state when query changes externally
  useEffect(() => {
    startTransition(() => {
      setStartDate(query.startDate ? new Date(query.startDate) : undefined);
      setEndDate(query.endDate ? new Date(query.endDate) : undefined);
      setSearchTerm(query.search || "");
    });
  }, [query]);

  const handleSearch = () => {
    onQueryChange({
      search: searchTerm || undefined,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    onQueryChange({
      userId: undefined,
      action: undefined,
      resource: undefined,
      resourceId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
      skip: 0,
    });
  };

  const handleActionChange = (value: string) => {
    onQueryChange({
      action: value === "all" ? undefined : (value as AuditAction),
      skip: 0,
    });
  };

  const handleResourceChange = (value: string) => {
    onQueryChange({
      resource: value === "all" ? undefined : (value as AuditResource),
      skip: 0,
    });
  };

  const handleResourceIdChange = (value: string) => {
    onQueryChange({
      resourceId: value || undefined,
      skip: 0,
    });
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (query.action) count++;
    if (query.resource) count++;
    if (query.resourceId) count++;
    if (query.startDate) count++;
    if (query.endDate) count++;
    if (query.search) count++;
    if (query.userId) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Search Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} active filter
                {activeFiltersCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search in description</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Search in description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                disabled={loading}
              />
              <Button size="icon" onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Filter */}
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select
              value={query.action || "all"}
              onValueChange={handleActionChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value={AuditAction.CREATE}>Create</SelectItem>
                <SelectItem value={AuditAction.READ}>Read</SelectItem>
                <SelectItem value={AuditAction.UPDATE}>Update</SelectItem>
                <SelectItem value={AuditAction.DELETE}>Delete</SelectItem>
                <SelectItem value={AuditAction.LOGIN}>Login</SelectItem>
                <SelectItem value={AuditAction.LOGOUT}>Logout</SelectItem>
                <SelectItem value={AuditAction.LOGIN_FAILED}>
                  Login Failed
                </SelectItem>
                <SelectItem value={AuditAction.CHECK_IN}>Check In</SelectItem>
                <SelectItem value={AuditAction.CHECK_OUT}>Check Out</SelectItem>
                <SelectItem value={AuditAction.PAYMENT_PROCESSED}>
                  Payment Processed
                </SelectItem>
                <SelectItem value={AuditAction.INVOICE_GENERATED}>
                  Invoice Generated
                </SelectItem>
                <SelectItem value={AuditAction.STATUS_CHANGE}>
                  Status Change
                </SelectItem>
                <SelectItem value={AuditAction.SYSTEM_CONFIG_CHANGE}>
                  System Config
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resource Filter */}
          <div className="space-y-2">
            <Label htmlFor="resource">Resource</Label>
            <Select
              value={query.resource || "all"}
              onValueChange={handleResourceChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All resources</SelectItem>
                <SelectItem value={AuditResource.USER}>User</SelectItem>
                <SelectItem value={AuditResource.RESERVATION}>
                  Reservation
                </SelectItem>
                <SelectItem value={AuditResource.ROOM}>Room</SelectItem>
                <SelectItem value={AuditResource.GUEST}>Guest</SelectItem>
                <SelectItem value={AuditResource.INVOICE}>Invoice</SelectItem>
                <SelectItem value={AuditResource.PAYMENT}>Payment</SelectItem>
                <SelectItem value={AuditResource.EMPLOYEE}>Employee</SelectItem>
                <SelectItem value={AuditResource.SHIFT}>Shift</SelectItem>
                <SelectItem value={AuditResource.ATTENDANCE}>
                  Attendance
                </SelectItem>
                <SelectItem value={AuditResource.RESTAURANT}>
                  Restaurant
                </SelectItem>
                <SelectItem value={AuditResource.EVENT}>Event</SelectItem>
                <SelectItem value={AuditResource.RECREATIONAL}>
                  Recreation
                </SelectItem>
                <SelectItem value={AuditResource.PARKING}>Parking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resource ID */}
          <div className="space-y-2">
            <Label htmlFor="resourceId">Resource ID</Label>
            <Input
              id="resourceId"
              placeholder="123"
              value={query.resourceId || ""}
              onChange={(e) => handleResourceIdChange(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "PPP", { locale: enUS })
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate
                    ? format(endDate, "PPP", { locale: enUS })
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
