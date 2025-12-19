"use client";

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
import { type Reservation } from "@/lib/api/reservations";
import Link from "next/link";

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
  const formatCurrency = (val: number) => {
    try {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: currencyCode || "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    } catch {
      return `$${val.toLocaleString()}`;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        );
      case "CHECKED_IN":
        return <Badge className="bg-blue-100 text-blue-800">Checked-in</Badge>;
      case "CHECKED_OUT":
        return <Badge className="bg-gray-100 text-gray-800">Checked-out</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoomStatusBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge className="bg-green-100 text-green-800">Available</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Being cleaned</Badge>
    );
  };

  const getChannelDisplayName = (channel: string) => {
    switch (channel) {
      case "DIRECT":
        return "Direct";
      case "BOOKING_COM":
        return "Booking.com";
      case "EXPEDIA":
        return "Expedia";
      case "AIRBNB":
        return "Airbnb";
      case "AGENCY":
        return "Agency";
      case "PHONE":
        return "Phone";;
      default:
        return channel;
    }
  };

  const getRoomTypeDisplayName = (type: string) => {
    switch (type) {
      case "INDIVIDUAL":
        return "Single";
      case "DOBLE":
        return "Double";
      case "SUITE":
        return "Suite";
      case "FAMILIAR":
        return "Family";
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
            Reservation #{reservation.id}
            {getStatusBadge(reservation.status)}
          </DialogTitle>
          <DialogDescription>
            Complete reservation details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Guest Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-muted-foreground">{reservation.guestName}</p>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {reservation.guestEmail}
                  </p>
                </div>
              </div>
              {reservation.guestPhone && (
                <div className="col-span-2">
                  <span className="font-medium">Phone:</span>
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
              Reservation Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Check-in Date:</span>
                <p className="text-muted-foreground">
                  {new Date(reservation.checkInDate).toLocaleDateString(
                    "en-US",
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
                <span className="font-medium">Check-out Date:</span>
                <p className="text-muted-foreground">
                  {new Date(reservation.checkOutDate).toLocaleDateString(
                    "en-US",
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
                <span className="font-medium">Nights:</span>
                <p className="text-muted-foreground">
                  {reservation.nights || 0} nights
                </p>
              </div>
              <div>
                <span className="font-medium">Guests:</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {reservation.guests} person(s)
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
              Room Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Number:</span>
                <p className="text-muted-foreground">
                  {reservation.room.number}
                </p>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <p className="text-muted-foreground">
                  {getRoomTypeDisplayName(reservation.room.type)}
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <span className="font-medium">Status:</span>
                {getRoomStatusBadge(!!reservation.room.isAvailable)}
                {!reservation.room.isAvailable && (
                  <Link
                    href="/housekeeping"
                    className="ml-2 text-xs text-primary hover:underline"
                  >
                    View cleaning assignments
                  </Link>
                )}
              </div>
              <div>
                <span className="font-medium">Capacity:</span>
                <p className="text-muted-foreground">
                  Up to {reservation.room.capacity} people
                </p>
              </div>
              <div>
                <span className="font-medium">Price per night:</span>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {formatCurrency(Number(reservation.room.price))}
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
              Payment Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total:</span>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(Number(reservation.totalAmount))}
                </p>
              </div>
              <div>
                <span className="font-medium">Booking Channel:</span>
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
                    <span className="font-medium">Discount %:</span>
                    <p className="text-muted-foreground">
                      {Number(reservation.discountPercent).toFixed(2)}%
                    </p>
                  </div>
                ) : null}
                {reservation.discountAmount ? (
                  <div>
                    <span className="font-medium">Discount $:</span>
                    <p className="text-muted-foreground">
                      {formatCurrency(Number(reservation.discountAmount))}
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
                <h3 className="text-lg font-semibold">Notes</h3>
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
              Created: {new Date(reservation.createdAt).toLocaleString("en-US")}
            </p>
            <p>
              Updated:{" "}
              {new Date(reservation.updatedAt).toLocaleString("en-US")}
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
                {isProcessing ? "Processing..." : "Checkout"}
              </Button>
            )}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
