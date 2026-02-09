"use client";

import { Clock, MapPin, Users, DollarSign, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type {
  RecreationalFacility,
  FacilityType,
  FacilityStatus,
} from "@/lib/features/recreational/types";
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";

interface FacilityDetailsDialogProps {
  facility: RecreationalFacility | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacilityDetailsDialog({
  facility,
  open,
  onOpenChange,
}: FacilityDetailsDialogProps) {
  const t = useTranslations("FacilityDetailsDialog");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  if (!facility) return null;

  const getFacilityTypeLabel = (type: FacilityType) => {
    const typeLabels: Record<FacilityType, string> = {
      SWIMMING_POOL: t("facilityTypePool"),
      GYM: t("facilityTypeGym"),
      TENNIS_COURT: t("facilityTypeTennis"),
      SPA: t("facilityTypeSpa"),
      SAUNA: t("facilityTypeSauna"),
      JACUZZI: t("facilityTypeJacuzzi"),
      GAME_ROOM: t("facilityTypeGameRoom"),
      YOGA_STUDIO: t("facilityTypeYoga"),
      KIDS_PLAY_AREA: t("facilityTypeKidsPlay"),
      BUSINESS_CENTER: t("facilityTypeBusiness"),
      OTHER: t("facilityTypeOther"),
    };
    return typeLabels[type] || type;
  };

  const getStatusBadge = (status: FacilityStatus, available: boolean) => {
    if (!available || status === "OUT_OF_ORDER") {
      return <Badge variant="destructive">{t("statusOutOfService")}</Badge>;
    }

    switch (status) {
      case "AVAILABLE":
        return (
          <Badge variant="default" className="bg-green-500">
            {t("statusAvailable")}
          </Badge>
        );
      case "OCCUPIED":
        return (
          <Badge variant="secondary" className="bg-blue-500">
            {t("statusOccupied")}
          </Badge>
        );
      case "MAINTENANCE":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            {t("statusMaintenance")}
          </Badge>
        );
      case "RESERVED":
        return (
          <Badge variant="secondary" className="bg-purple-500">
            {t("statusReserved")}
          </Badge>
        );
      case "CLEANING":
        return (
          <Badge variant="secondary" className="bg-orange-500">
            {t("statusCleaning")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDayNames = (days: number[]) => {
    const dayNames = [
      t("daySun"),
      t("dayMon"),
      t("dayTue"),
      t("dayWed"),
      t("dayThu"),
      t("dayFri"),
      t("daySat"),
    ];
    return days.map((day) => dayNames[day]).join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{facility.name}</DialogTitle>
              <DialogDescription className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {facility.location}
              </DialogDescription>
            </div>
            <div className="text-right">
              {getStatusBadge(facility.status, facility.available)}
              <div className="mt-1">
                <Badge variant="outline">
                  {getFacilityTypeLabel(facility.type)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {facility.description && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                {t("descriptionLabel")}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {facility.description}
              </p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {t("capacityAndSpace")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{t("maximumCapacity")}:</span>
                  <span className="text-sm font-medium">
                    {facility.capacity} {t("people")}
                  </span>
                </div>
                {facility.area && (
                  <div className="flex justify-between">
                    <span className="text-sm">{t("area")}:</span>
                    <span className="text-sm font-medium">
                      {facility.area} {t("areaUnit")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {t("restrictions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{t("minBooking")}:</span>
                  <span className="text-sm font-medium">
                    {facility.minimumBookingHours}
                    {t("hoursUnit")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t("maxBooking")}:</span>
                  <span className="text-sm font-medium">
                    {facility.maximumBookingHours}
                    {t("hoursUnit")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t("advanceNotice")}:</span>
                  <span className="text-sm font-medium">
                    {facility.advanceBookingHours}
                    {t("hoursUnit")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operating Hours */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {t("operatingHours")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">{t("hours")}:</span>
                    <span className="text-sm font-medium">
                      {facility.openingTime} - {facility.closingTime}
                    </span>
                  </div>
                  {facility.availableDays &&
                    facility.availableDays.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">{t("availableDays")}:</span>
                        <span className="text-sm font-medium">
                          {getDayNames(facility.availableDays)}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          {facility.amenities && facility.amenities.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                {t("amenities")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {facility.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Rules */}
          {facility.rules && facility.rules.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">{t("rulesAndPolicies")}</h4>
              <div className="space-y-2">
                {facility.rules.map((rule, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Notes */}
          {facility.maintenanceNotes && (
            <div>
              <h4 className="font-semibold mb-2">{t("maintenanceNotes")}</h4>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  {facility.maintenanceNotes}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>{t("created")}:</span>
              <span>
                {new Date(facility.createdAt).toLocaleString(intlLocale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("lastUpdated")}:</span>
              <span>
                {new Date(facility.updatedAt).toLocaleString(intlLocale)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
