"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Phone,
  Mail,
  Home,
  AlertTriangle,
  FileText,
} from "lucide-react";
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
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import type {
  RecreationalBooking,
  RecreationalFacility,
  BookingStatus,
} from "@/lib/features/recreational/types";

interface BookingDetailsDialogProps {
  booking: RecreationalBooking | null;
  facility: RecreationalFacility | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDialog({
  booking,
  facility,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  const t = useTranslations("BookingDetailsDialog");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);

  if (!booking) return null;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            {t("statusPending")}
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="default" className="bg-blue-500">
            {t("statusConfirmed")}
          </Badge>
        );
      case "CHECKED_IN":
        return (
          <Badge variant="default" className="bg-green-500">
            {t("statusInProgress")}
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="default" className="bg-gray-500">
            {t("statusCompleted")}
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">{t("statusCancelled")}</Badge>;
      case "NO_SHOW":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            {t("statusNoShow")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "VIP":
        return (
          <Badge variant="default" className="bg-purple-500">
            {t("priorityVip")}
          </Badge>
        );
      case "HIGH":
        return (
          <Badge variant="default" className="bg-orange-500">
            {t("priorityHigh")}
          </Badge>
        );
      case "NORMAL":
        return <Badge variant="outline">{t("priorityNormal")}</Badge>;
      case "MAINTENANCE":
        return <Badge variant="secondary">{t("priorityMaintenance")}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const calculateActualDuration = () => {
    if (!booking.actualCheckIn || !booking.actualCheckOut) return null;

    const checkIn = new Date(booking.actualCheckIn);
    const checkOut = new Date(booking.actualCheckOut);
    const duration =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

    return Math.round(duration * 100) / 100;
  };

  const actualDuration = calculateActualDuration();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {t("bookingId", { id: booking.id })}
              </DialogTitle>
              <DialogDescription className="flex items-center mt-1">
                <User className="h-4 w-4 mr-1" />
                {booking.guestName}
              </DialogDescription>
            </div>
            <div className="text-right space-y-1">
              {getStatusBadge(booking.status)}
              {getPriorityBadge(booking.priority)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <User className="h-4 w-4 mr-2" />
                {t("guestInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">{t("name")}:</span>
                    <span className="ml-2">{booking.guestName}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">{t("email")}:</span>
                    <span className="ml-2">{booking.guestEmail}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {booking.guestPhone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="font-medium">{t("phone")}:</span>
                      <span className="ml-2">{booking.guestPhone}</span>
                    </div>
                  )}
                  {booking.roomNumber && (
                    <div className="flex items-center text-sm">
                      <Home className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="font-medium">{t("room")}:</span>
                      <span className="ml-2">{booking.roomNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {t("bookingDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {facility && (
                <div className="bg-muted p-3 rounded-md">
                  <div className="font-medium">{facility.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {facility.location}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">{t("date")}:</span>
                    <span className="ml-2">
                      {new Date(booking.bookingDate).toLocaleDateString(
                        intlLocale,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">{t("schedule")}:</span>
                    <span className="ml-2">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">{t("duration")}:</span>
                    <span className="ml-2">
                      {booking.duration} {t("hours")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">{t("participants")}:</span>
                    <span className="ml-2">{booking.participants}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timing Information */}
          {(booking.actualCheckIn || booking.actualCheckOut) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {t("actualTimes")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {booking.actualCheckIn && (
                  <div className="flex justify-between text-sm">
                    <span>{t("actualCheckIn")}:</span>
                    <span className="font-medium">
                      {new Date(booking.actualCheckIn).toLocaleString(
                        intlLocale,
                      )}
                    </span>
                  </div>
                )}
                {booking.actualCheckOut && (
                  <div className="flex justify-between text-sm">
                    <span>{t("actualCheckOut")}:</span>
                    <span className="font-medium">
                      {new Date(booking.actualCheckOut).toLocaleString(
                        intlLocale,
                      )}
                    </span>
                  </div>
                )}
                {actualDuration && (
                  <div className="flex justify-between text-sm">
                    <span>{t("actualDuration")}:</span>
                    <span className="font-medium">
                      {actualDuration} {t("hours")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t("specialRequests")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {booking.specialRequests}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Staff Notes */}
          {booking.staffNotes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {t("staffNotes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">{booking.staffNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>{t("bookingIdLabel")}:</span>
                <span>#{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("created")}:</span>
                <span>
                  {new Date(booking.createdAt).toLocaleString(intlLocale)}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>{t("lastUpdated")}:</span>
                <span>
                  {new Date(booking.updatedAt).toLocaleString(intlLocale)}
                </span>
              </div>
              {booking.createdByUserId && (
                <div className="flex justify-between">
                  <span>{t("createdByUser")}:</span>
                  <span>#{booking.createdByUserId}</span>
                </div>
              )}
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
