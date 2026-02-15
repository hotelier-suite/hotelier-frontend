"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { type Reservation } from "@/lib/features/reservations/types";
import { reservationsService } from "@/lib/features/reservations/service";
import { type Room } from "@/lib/features/rooms/types";
import { useTranslations } from "next-intl";

import { NewReservationDialog } from "./new-reservation-dialog";
import { EditReservationDialog } from "./edit-reservation-dialog";
import { DeleteReservationDialog } from "./delete-reservation-dialog";
import { ViewReservationDialog } from "./view-reservation-dialog";
import { ReservationsTable } from "./reservations-table";

interface ReservationsProps {
  initialReservations: Reservation[];
  rooms: Room[];
  currencyCode?: string;
}

export function Reservations({
  initialReservations,
  rooms,
  currencyCode,
}: ReservationsProps) {
  const t = useTranslations("ReservationsManagement");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // Reservations come from backend already sorted by creation date (most recent first)
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);
  const [loading, setLoading] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Status for dialogs
  const [newReservationDialogOpen, setNewReservationDialogOpen] =
    useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  // The logic for new reservation is handled inside the NewReservationDialog component

  // Quick status updates
  const handleUpdateStatus = async (
    id: number,
    status: Reservation["status"],
  ) => {
    try {
      setLoading(true);
      const updatedReservation = await reservationsService.update(id, {
        status,
      });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? updatedReservation : r)),
      );
      toast(t("statusUpdated"), {
        description: t("statusUpdatedDesc", { id, status }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast(t("error"), { description: t("couldNotUpdateStatus") });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReservation = async (formData: {
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    guests: number;
    checkInDate: string;
    checkOutDate: string;
    roomId: number;
    discountAmount?: number | null;
    discountPercent?: number | null;
    guestId?: number | null;
    channel?: string;
  }) => {
    try {
      setLoading(true);
      const room = rooms.find((r) => r.id === formData.roomId);
      if (!room) {
        toast.error(t("error"), {
          description: t("roomNotFound"),
        });
        return;
      }

      // Prepare data ensuring numeric fields are valid
      const reservationData = {
        ...formData,
        channel: "DIRECT" as const,
        roomId: parseInt(formData.roomId.toString()),
        guests: parseInt(formData.guests.toString()),
        discountAmount: formData.discountAmount || null,
        discountPercent: formData.discountPercent || null,
        guestId: formData.guestId || null,
      };

      await reservationsService.createSelf(
        reservationData as unknown as Omit<
          Reservation,
          | "id"
          | "createdAt"
          | "updatedAt"
          | "user"
          | "room"
          | "totalAmount"
          | "status"
        >,
      );

      // Refresh the full list to ensure correct order from backend
      const updatedReservations = await reservationsService.getAll();
      setReservations(updatedReservations);

      toast(t("success"), { description: t("reservationCreated") });

      // Close the dialog after creating the reservation
      setNewReservationDialogOpen(false);
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error(t("error"), { description: t("couldNotCreateReservation") });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReservation = (reservationId: number) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (reservation) {
      setSelectedReservation(reservation);
      setViewDialogOpen(true);
    }
  };

  const handleEditReservation = (reservationId: number) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (reservation) {
      setSelectedReservation(reservation);
      setEditDialogOpen(true);
    }
  };

  const handleUpdateReservation = async (
    id: number,
    data: Partial<Reservation>,
  ) => {
    try {
      setLoading(true);
      const updatedReservation = await reservationsService.update(id, data);
      setReservations(
        reservations.map((r) => (r.id === id ? updatedReservation : r)),
      );
      setEditDialogOpen(false);
      setSelectedReservation(null);
      toast(t("success"), { description: t("reservationUpdated") });
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error(t("error"), { description: t("couldNotUpdateReservation") });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = (reservationId: number) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (reservation) {
      setSelectedReservation(reservation);
      setDeleteDialogOpen(true);
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      setProcessingCheckout(true);
      const dto = await reservationsService.checkout(id);
      const updated = dto.reservation;
      setReservations(reservations.map((r) => (r.id === id ? updated : r)));
      setViewDialogOpen(false);
      setSelectedReservation(null);
      toast(t("checkoutCompleted"), {
        description: t("checkoutCompletedDesc", {
          room: updated.room?.number ?? updated.roomId,
          assignmentId: dto.assignmentId ?? "",
        }),
      });
    } catch (error) {
      console.error("Error performing checkout:", error);
      toast.error(t("error"), {
        description: t("couldNotCompleteCheckout"),
      });
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedReservation) return;

    try {
      setLoading(true);
      await reservationsService.delete(Number(selectedReservation.id));
      setReservations(
        reservations.filter((r) => r.id !== selectedReservation.id),
      );
      setDeleteDialogOpen(false);
      setSelectedReservation(null);
      toast(t("success"), { description: t("reservationDeleted") });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error(t("error"), { description: t("couldNotDeleteReservation") });
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      (reservation.guestName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="PENDING">{t("pending")}</SelectItem>
              <SelectItem value="CONFIRMED">{t("confirmed")}</SelectItem>
              <SelectItem value="CHECKED_IN">{t("checkedIn")}</SelectItem>
              <SelectItem value="CHECKED_OUT">{t("checkedOut")}</SelectItem>
              <SelectItem value="CANCELLED">{t("cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setNewReservationDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("newReservation")}
        </Button>
      </div>

      <ReservationsTable
        reservations={filteredReservations}
        onViewReservation={handleViewReservation}
        onEditReservation={handleEditReservation}
        onDeleteReservation={handleDeleteReservation}
        currencyCode={currencyCode}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Dialogs */}
      <NewReservationDialog
        isOpen={newReservationDialogOpen}
        onClose={() => setNewReservationDialogOpen(false)}
        onAddReservation={handleAddReservation}
        rooms={rooms}
        loading={loading}
        currencyCode={currencyCode}
      />

      <ViewReservationDialog
        isOpen={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onCheckout={handleCheckout}
        isProcessing={processingCheckout}
        currencyCode={currencyCode}
      />

      <EditReservationDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onUpdateReservation={handleUpdateReservation}
        rooms={rooms}
        loading={loading}
      />

      <DeleteReservationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onConfirmDelete={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}
