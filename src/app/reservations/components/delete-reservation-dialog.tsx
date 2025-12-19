"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { type Reservation } from "@/lib/api/reservations";

interface DeleteReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onConfirmDelete: () => void;
  loading: boolean;
}

export function DeleteReservationDialog({
  isOpen,
  onClose,
  reservation,
  onConfirmDelete,
  loading,
}: DeleteReservationDialogProps) {
  if (!reservation) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete reservation?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete reservation #{reservation.id} from{" "}
            <strong>{reservation.guestName}</strong>?
            <br />
            <br />
            This action cannot be undone. The reservation will be permanently
            deleted from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
