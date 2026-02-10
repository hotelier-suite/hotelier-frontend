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
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Event {
  id: number;
  title: string;
  client: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  services: {
    catering: boolean;
    audiovisual: boolean;
    decoration: boolean;
    accommodation: boolean;
  };
  budget: number;
  status: string;
}

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEventDelete: (id: number) => Promise<void>;
}

export function DeleteEventDialog({
  open,
  onOpenChange,
  event,
  onEventDelete,
}: DeleteEventDialogProps) {
  const t = useTranslations("DeleteEventDialog");
  const handleDelete = async () => {
    if (!event) return;

    try {
      await onEventDelete(event.id);
      toast.success(t("successMessage"));
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(t("errorMessage"));
    }
  };

  if (!event) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description", {
              title: event.title,
              date: event.date,
              client: event.client,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
