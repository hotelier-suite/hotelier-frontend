"use client";

import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { formatCurrency } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  User,
  Phone,
  Mail,
  Home,
  Users,
  CreditCard,
  MapPin,
} from "lucide-react";
import { type Reservation } from "@/lib/features/reservations/types";
import { Link } from "@/i18n/navigation";

interface ViewReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onCheckout?: (id: number) => void;
  isProcessing?: boolean;
  currencyCode?: string;
}

export function ViewReservationDialog({
  isOpen,
  onClose,
  reservation,
  onCheckout,
  isProcessing,
  currencyCode,
}: ViewReservationDialogProps) {
  const t = useTranslations("ViewReservationDialog");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("confirmed")}
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("pending")}
          </Badge>
        );
      case "CHECKED_IN":
        return (
          <Badge className="bg-blue-100 text-blue-800">{t("checkedIn")}</Badge>
        );
      case "CHECKED_OUT":
        return (
          <Badge className="bg-gray-100 text-gray-800">{t("checkedOut")}</Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800">{t("cancelled")}</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoomStatusBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge className="bg-green-100 text-green-800">{t("available")}</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">
        {t("beingCleaned")}
      </Badge>
    );
  };

  const getChannelDisplayName = (channel: string) => {
    switch (channel) {
      case "DIRECT":
        return t("channelDirect");
      case "BOOKING_COM":
        return "Booking.com";
      case "EXPEDIA":
        return "Expedia";
      case "AIRBNB":
        return "Airbnb";
      case "AGENCY":
        return t("channelAgency");
      case "PHONE":
        return t("channelPhone");
      default:
        return channel;
    }
  };

  const getRoomTypeDisplayName = (type: string) => {
    switch (type) {
      case "INDIVIDUAL":
        return t("roomSingle");
      case "DOBLE":
        return t("roomDouble");
      case "SUITE":
        return t("roomSuite");
      case "FAMILIAR":
        return t("roomFamily");
      default:
        return type;
    }
  };

  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t("title", { id: reservation.id })}
            {getStatusBadge(reservation.status)}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("guestInformation")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t("name")}</span>
                <p className="text-muted-foreground">{reservation.guestName}</p>
              </div>
              <div>
                <span className="font-medium">{t("email")}</span>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {reservation.guestEmail}
                  </p>
                </div>
              </div>
              {reservation.guestPhone && (
                <div className="col-span-2">
                  <span className="font-medium">{t("phone")}</span>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <p className="text-muted-foreground">
                      {reservation.guestPhone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Reservation Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {t("reservationDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t("checkInDate")}</span>
                <p className="text-muted-foreground">
                  {new Date(reservation.checkInDate).toLocaleDateString(
                    intlLocale,
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium">{t("checkOutDate")}</span>
                <p className="text-muted-foreground">
                  {new Date(reservation.checkOutDate).toLocaleDateString(
                    intlLocale,
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium">{t("nights")}</span>
                <p className="text-muted-foreground">
                  {reservation.nights || 0} {t("nightsUnit")}
                </p>
              </div>
              <div>
                <span className="font-medium">{t("guests")}</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {reservation.guests} {t("persons")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Room Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              {t("roomInformation")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t("number")}</span>
                <p className="text-muted-foreground">
                  {reservation.room.number}
                </p>
              </div>
              <div>
                <span className="font-medium">{t("type")}</span>
                <p className="text-muted-foreground">
                  {getRoomTypeDisplayName(reservation.room.type)}
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <span className="font-medium">{t("statusLabel")}</span>
                {getRoomStatusBadge(!!reservation.room.isAvailable)}
                {!reservation.room.isAvailable && (
                  <Link
                    href="/housekeeping"
                    className="ml-2 text-xs text-primary hover:underline"
                  >
                    {t("viewCleaningAssignments")}
                  </Link>
                )}
              </div>
              <div>
                <span className="font-medium">{t("capacity")}</span>
                <p className="text-muted-foreground">
                  {t("upToPeople", { count: reservation.room.capacity })}
                </p>
              </div>
              <div>
                <span className="font-medium">{t("pricePerNight")}</span>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {formatCurrency(Number(reservation.room.price), currencyCode)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("paymentInformation")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t("totalLabel")}</span>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(Number(reservation.totalAmount), currencyCode)}
                </p>
              </div>
              <div>
                <span className="font-medium">{t("bookingChannel")}</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {getChannelDisplayName(reservation.channel)}
                  </p>
                </div>
              </div>
            </div>

            {(reservation.discountPercent || reservation.discountAmount) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
                {reservation.discountPercent ? (
                  <div>
                    <span className="font-medium">{t("discountPercent")}</span>
                    <p className="text-muted-foreground">
                      {t("percentValue", { value: Number(reservation.discountPercent).toFixed(2) })}
                    </p>
                  </div>
                ) : null}
                {reservation.discountAmount ? (
                  <div>
                    <span className="font-medium">{t("discountAmount")}</span>
                    <p className="text-muted-foreground">
                      {formatCurrency(Number(reservation.discountAmount), currencyCode)}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {reservation.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t("notes")}</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {reservation.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* System Dates Information */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              {t("created")}{" "}
              {new Date(reservation.createdAt).toLocaleString(intlLocale)}
            </p>
            <p>
              {t("updated")}{" "}
              {new Date(reservation.updatedAt).toLocaleString(intlLocale)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
          {reservation &&
            reservation.status !== "CHECKED_OUT" &&
            onCheckout && (
              <Button
                onClick={() => onCheckout(Number(reservation.id))}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? t("processing") : t("checkout")}
              </Button>
            )}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
