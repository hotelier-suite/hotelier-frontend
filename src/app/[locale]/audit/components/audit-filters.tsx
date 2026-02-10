"use client";

import { useState, useEffect, startTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { getDateFnsLocale } from "@/lib/utils/locale";
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
  const t = useTranslations("AuditFiltersComp");
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);
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
            {t("searchFilters")}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount}{" "}
                {t("activeFilters", { count: activeFiltersCount })}
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
              {t("clear")}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">{t("searchInDescription")}</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder={t("searchPlaceholder")}
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
            <Label htmlFor="action">{t("action")}</Label>
            <Select
              value={query.action || "all"}
              onValueChange={handleActionChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allActions")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allActions")}</SelectItem>
                <SelectItem value={AuditAction.CREATE}>
                  {t("actionCreate")}
                </SelectItem>
                <SelectItem value={AuditAction.READ}>
                  {t("actionRead")}
                </SelectItem>
                <SelectItem value={AuditAction.UPDATE}>
                  {t("actionUpdate")}
                </SelectItem>
                <SelectItem value={AuditAction.DELETE}>
                  {t("actionDelete")}
                </SelectItem>
                <SelectItem value={AuditAction.LOGIN}>
                  {t("actionLogin")}
                </SelectItem>
                <SelectItem value={AuditAction.LOGOUT}>
                  {t("actionLogout")}
                </SelectItem>
                <SelectItem value={AuditAction.LOGIN_FAILED}>
                  {t("actionLoginFailed")}
                </SelectItem>
                <SelectItem value={AuditAction.CHECK_IN}>
                  {t("actionCheckIn")}
                </SelectItem>
                <SelectItem value={AuditAction.CHECK_OUT}>
                  {t("actionCheckOut")}
                </SelectItem>
                <SelectItem value={AuditAction.PAYMENT_PROCESSED}>
                  {t("actionPaymentProcessed")}
                </SelectItem>
                <SelectItem value={AuditAction.INVOICE_GENERATED}>
                  {t("actionInvoiceGenerated")}
                </SelectItem>
                <SelectItem value={AuditAction.STATUS_CHANGE}>
                  {t("actionStatusChange")}
                </SelectItem>
                <SelectItem value={AuditAction.SYSTEM_CONFIG_CHANGE}>
                  {t("actionSystemConfig")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resource Filter */}
          <div className="space-y-2">
            <Label htmlFor="resource">{t("resource")}</Label>
            <Select
              value={query.resource || "all"}
              onValueChange={handleResourceChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allResources")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allResources")}</SelectItem>
                <SelectItem value={AuditResource.USER}>
                  {t("resourceUser")}
                </SelectItem>
                <SelectItem value={AuditResource.RESERVATION}>
                  {t("resourceReservation")}
                </SelectItem>
                <SelectItem value={AuditResource.ROOM}>
                  {t("resourceRoom")}
                </SelectItem>
                <SelectItem value={AuditResource.GUEST}>
                  {t("resourceGuest")}
                </SelectItem>
                <SelectItem value={AuditResource.INVOICE}>
                  {t("resourceInvoice")}
                </SelectItem>
                <SelectItem value={AuditResource.PAYMENT}>
                  {t("resourcePayment")}
                </SelectItem>
                <SelectItem value={AuditResource.EMPLOYEE}>
                  {t("resourceEmployee")}
                </SelectItem>
                <SelectItem value={AuditResource.SHIFT}>
                  {t("resourceShift")}
                </SelectItem>
                <SelectItem value={AuditResource.ATTENDANCE}>
                  {t("resourceAttendance")}
                </SelectItem>
                <SelectItem value={AuditResource.RESTAURANT}>
                  {t("resourceRestaurant")}
                </SelectItem>
                <SelectItem value={AuditResource.EVENT}>
                  {t("resourceEvent")}
                </SelectItem>
                <SelectItem value={AuditResource.RECREATIONAL}>
                  {t("resourceRecreation")}
                </SelectItem>
                <SelectItem value={AuditResource.PARKING}>
                  {t("resourceParking")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resource ID */}
          <div className="space-y-2">
            <Label htmlFor="resourceId">{t("resourceId")}</Label>
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
            <Label>{t("startDate")}</Label>
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
                    ? format(startDate, "PPP", { locale: dateFnsLocale })
                    : t("selectDate")}
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
            <Label>{t("endDate")}</Label>
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
                    ? format(endDate, "PPP", { locale: dateFnsLocale })
                    : t("selectDate")}
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
            {t("applyFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
