"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { recreationalService } from "@/lib/features/recreational/service";
import type {
  RecreationalBooking,
  RecreationalFacility,
} from "@/lib/features/recreational/types";
import { BookingDialog } from "./booking-dialog";
import { BookingDetailsDialog } from "./booking-details-dialog";
import { BookingsFilters } from "./bookings-filters";
import { BookingsTable } from "./bookings-table";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface BookingsManagementProps {
  bookings: RecreationalBooking[];
  facilities: RecreationalFacility[];
  onBookingsChange: (bookings: RecreationalBooking[]) => void;
}

export function BookingsManagement({
  bookings,
  facilities,
  onBookingsChange,
}: BookingsManagementProps) {
  const t = useTranslations("BookingsManagement");
  const [editingBooking, setEditingBooking] =
    useState<RecreationalBooking | null>(null);
  const [viewingBooking, setViewingBooking] =
    useState<RecreationalBooking | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [actioningId, setActioningId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [facilityFilter, setFacilityFilter] = useState<string>("all");

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facilities
        .find((f) => f.id === booking.facilityId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesFacility =
      facilityFilter === "all" ||
      booking.facilityId.toString() === facilityFilter;

    return matchesSearch && matchesStatus && matchesFacility;
  });

  const handleEdit = (booking: RecreationalBooking) => {
    setEditingBooking(booking);
    setShowBookingDialog(true);
  };

  const handleView = (booking: RecreationalBooking) => {
    setViewingBooking(booking);
  };

  const handleConfirm = async (booking: RecreationalBooking) => {
    try {
      setActioningId(booking.id);
      const bookingId =
        typeof booking.id === "string" ? parseInt(booking.id) : booking.id;
      const updatedBooking = await recreationalService.updateBooking(
        bookingId,
        {
          status: "CONFIRMED",
        },
      );

      onBookingsChange(
        bookings.map((b) => (b.id === booking.id ? updatedBooking : b)),
      );

      toast.success(t("bookingConfirmedSuccess"));
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error(t("errorConfirming"));
    } finally {
      setActioningId(null);
    }
  };

  const handleCancel = async (booking: RecreationalBooking) => {
    if (
      !confirm(
        t("cancelConfirmation", { guest: booking.guestName }),
      )
    ) {
      return;
    }

    try {
      setActioningId(booking.id);
      const bookingId =
        typeof booking.id === "string" ? parseInt(booking.id) : booking.id;
      const updatedBooking = await recreationalService.cancelBooking(
        bookingId,
        t("cancelledByStaff"),
      );

      onBookingsChange(
        bookings.map((b) => (b.id === booking.id ? updatedBooking : b)),
      );

      toast.success(t("bookingCancelledSuccess"));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(t("errorCancelling"));
    } finally {
      setActioningId(null);
    }
  };

  const handleCheckIn = async (booking: RecreationalBooking) => {
    try {
      setActioningId(booking.id);
      const bookingId =
        typeof booking.id === "string" ? parseInt(booking.id) : booking.id;
      const updatedBooking =
        await recreationalService.checkInBooking(bookingId);

      onBookingsChange(
        bookings.map((b) => (b.id === booking.id ? updatedBooking : b)),
      );

      toast.success(t("checkInSuccess"));
    } catch (error) {
      console.error("Error checking in:", error);
      toast.error(t("errorCheckIn"));
    } finally {
      setActioningId(null);
    }
  };

  const handleCheckOut = async (booking: RecreationalBooking) => {
    try {
      setActioningId(booking.id);
      const bookingId =
        typeof booking.id === "string" ? parseInt(booking.id) : booking.id;
      const updatedBooking =
        await recreationalService.checkOutBooking(bookingId);

      onBookingsChange(
        bookings.map((b) => (b.id === booking.id ? updatedBooking : b)),
      );

      toast.success(t("checkOutSuccess"));
    } catch (error) {
      console.error("Error checking out:", error);
      toast.error(t("errorCheckOut"));
    } finally {
      setActioningId(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              facilityFilter={facilityFilter}
              onFacilityChange={setFacilityFilter}
              facilities={facilities}
            />

            <BookingsTable
              bookings={filteredBookings}
              facilities={facilities}
              actioningId={actioningId}
              onView={handleView}
              onEdit={handleEdit}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={(open) => {
          setShowBookingDialog(open);
          if (!open) {
            setEditingBooking(null);
          }
        }}
        booking={editingBooking}
        facilities={facilities}
        onBookingCreated={(booking) => {
          if (editingBooking) {
            onBookingsChange(
              bookings.map((b) => (b.id === booking.id ? booking : b)),
            );
          } else {
            onBookingsChange([...bookings, booking]);
          }
          setShowBookingDialog(false);
          setEditingBooking(null);
        }}
      />

      {/* View Details Dialog */}
      <BookingDetailsDialog
        booking={viewingBooking}
        facility={
          viewingBooking
            ? facilities.find((f) => f.id === viewingBooking.facilityId) || null
            : null
        }
        open={!!viewingBooking}
        onOpenChange={(open) => {
          if (!open) {
            setViewingBooking(null);
          }
        }}
      />
    </>
  );
}
