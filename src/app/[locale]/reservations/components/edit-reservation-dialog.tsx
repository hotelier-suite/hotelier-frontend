"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { type Room } from "@/lib/features/rooms/types";
import { type Reservation } from "@/lib/features/reservations/types";
import { reservationsService } from "@/lib/features/reservations/service";

function createEditReservationFormSchema(t: (key: string) => string) {
  return z
    .object({
      guestName: z
        .string({ message: t("validationGuestNameRequired") })
        .min(2, t("validationNameMinLength"))
        .max(100, t("validationNameMaxLength")),
      guestEmail: z
        .string({ message: t("validationEmailRequired") })
        .email(t("validationEmailInvalid")),
      guestPhone: z
        .string()
        .optional()
        .refine((val) => {
          if (!val || val.trim() === "") return true;
          return /(\+\d{1,3}[- ]?)?\d{10}$/.test(val);
        }, t("validationPhoneInvalid")),
      guests: z
        .string({ message: t("validationGuestsRequired") })
        .min(1, t("validationSelectGuests"))
        .refine((val) => {
          const num = parseInt(val);
          return !isNaN(num) && num >= 1 && num <= 10;
        }, t("validationGuestsRange")),
      checkInDate: z
        .string({ message: t("validationCheckInRequired") })
        .min(1, t("validationCheckInRequired")),
      checkOutDate: z
        .string({ message: t("validationCheckOutRequired") })
        .min(1, t("validationCheckOutRequired")),
      roomId: z
        .string({ message: t("validationRoomRequired") })
        .min(1, t("validationSelectRoom"))
        .refine((val) => {
          const num = parseInt(val);
          return !isNaN(num) && num > 0;
        }, t("validationSelectValidRoom")),
      status: z.enum(
        ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"],
        {
          message: t("validationSelectValidStatus"),
        },
      ),
      discountPercent: z
        .string()
        .optional()
        .refine((val) => {
          if (!val || val.trim() === "") return true;
          const num = parseFloat(val);
          return !isNaN(num) && num >= 0 && num <= 100;
        }, t("validationDiscountPercentRange")),
      discountAmount: z
        .string()
        .optional()
        .refine((val) => {
          if (!val || val.trim() === "") return true;
          const num = parseFloat(val);
          return !isNaN(num) && num >= 0;
        }, t("validationDiscountAmountMin")),
    })
    .refine(
      (data) => {
        const checkIn = new Date(data.checkInDate);
        const checkOut = new Date(data.checkOutDate);
        return checkOut > checkIn;
      },
      {
        message: t("validationCheckOutAfterCheckIn"),
        path: ["checkOutDate"],
      },
    );
}

type EditReservationFormData = z.infer<
  ReturnType<typeof createEditReservationFormSchema>
>;

interface EditReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onUpdateReservation: (id: number, data: Partial<Reservation>) => void;
  rooms: Room[];
  loading: boolean;
  currencyCode?: string;
}

export function EditReservationDialog({
  isOpen,
  onClose,
  reservation,
  onUpdateReservation,
  // rooms,
  loading,
  currencyCode,
}: EditReservationDialogProps) {
  const t = useTranslations("EditReservationDialog");
  const editReservationFormSchema = createEditReservationFormSchema(t);
  const form = useForm<EditReservationFormData>({
    resolver: zodResolver(editReservationFormSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guests: "1",
      checkInDate: "",
      checkOutDate: "",
      roomId: "",
      status: "PENDING",
      discountPercent: "",
      discountAmount: "",
    },
  });

  // Availability search (rooms based on selected dates and guests)
  const [availableRooms, setAvailableRooms] = useState<Room[] | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const formValues = form.watch();
  const totalGuests = parseInt(formValues.guests) || 0;

  useEffect(() => {
    const start = formValues.checkInDate;
    const end = formValues.checkOutDate;

    if (!start || !end) {
      setAvailableRooms(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setAvailabilityLoading(true);
        const list = await reservationsService.getAvailability(start, end, {
          guests: totalGuests > 0 ? totalGuests : undefined,
        });
        if (!cancelled) {
          setAvailableRooms(list);
          // Reset selected room if it is no longer available
          if (
            formValues.roomId &&
            !list.some((r) => r.id.toString() === formValues.roomId)
          ) {
            form.setValue("roomId", "");
          }
        }
      } catch (e) {
        console.error("Error fetching availability:", e);
        if (!cancelled) setAvailableRooms([]);
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    formValues.checkInDate,
    formValues.checkOutDate,
    formValues.roomId,
    totalGuests,
    form,
    reservation?.id,
  ]);

  useEffect(() => {
    if (reservation) {
      form.reset({
        guestName: reservation.guestName || "",
        guestEmail: reservation.guestEmail || "",
        guestPhone: reservation.guestPhone || "",
        guests: reservation.guests.toString(),
        checkInDate: new Date(reservation.checkInDate)
          .toISOString()
          .split("T")[0],
        checkOutDate: new Date(reservation.checkOutDate)
          .toISOString()
          .split("T")[0],
        roomId: reservation.roomId.toString(),
        status: reservation.status,
        discountPercent: reservation.discountPercent?.toString() || "",
        discountAmount: reservation.discountAmount?.toString() || "",
      });
    }
  }, [reservation, form]);

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

  const onSubmit = (data: EditReservationFormData) => {
    if (!reservation) return;

    const updateData = {
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone || undefined,
      guests: parseInt(data.guests),
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      roomId: parseInt(data.roomId),
      status: data.status,
      discountPercent: data.discountPercent
        ? parseFloat(data.discountPercent)
        : undefined,
      discountAmount: data.discountAmount
        ? parseFloat(data.discountAmount)
        : undefined,
    };

    onUpdateReservation(
      typeof reservation.id === "number"
        ? reservation.id
        : parseInt(reservation.id.toString()),
      updateData,
    );
  };

  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title", { id: reservation.id })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">{t("guestName")}</Label>
              <Input
                id="guestName"
                placeholder={t("fullName")}
                {...form.register("guestName")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.guestName ? "border-red-500" : ""
                }
              />
              {form.formState.errors.guestName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.guestName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestEmail">{t("email")}</Label>
              <Input
                id="guestEmail"
                type="email"
                placeholder="email@example.com"
                {...form.register("guestEmail")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.guestEmail ? "border-red-500" : ""
                }
              />
              {form.formState.errors.guestEmail && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.guestEmail.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestPhone">{t("phone")}</Label>
              <Input
                id="guestPhone"
                placeholder="+57 300 123 4567"
                {...form.register("guestPhone")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.guestPhone ? "border-red-500" : ""
                }
              />
              {form.formState.errors.guestPhone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.guestPhone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">{t("numberOfGuests")}</Label>
              <Select
                value={form.watch("guests")}
                onValueChange={(value) => form.setValue("guests", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t("guest1")}</SelectItem>
                  <SelectItem value="2">{t("guest2")}</SelectItem>
                  <SelectItem value="3">{t("guest3")}</SelectItem>
                  <SelectItem value="4">{t("guest4")}</SelectItem>
                  <SelectItem value="5">{t("guest5")}</SelectItem>
                  <SelectItem value="6">{t("guest6")}</SelectItem>
                  <SelectItem value="7">{t("guest7")}</SelectItem>
                  <SelectItem value="8">{t("guest8")}</SelectItem>
                  <SelectItem value="9">{t("guest9")}</SelectItem>
                  <SelectItem value="10">{t("guest10")}</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.guests && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.guests.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate">{t("checkInDate")}</Label>
              <Input
                id="checkInDate"
                type="date"
                {...form.register("checkInDate")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.checkInDate ? "border-red-500" : ""
                }
              />
              {form.formState.errors.checkInDate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.checkInDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOutDate">{t("checkOutDate")}</Label>
              <Input
                id="checkOutDate"
                type="date"
                {...form.register("checkOutDate")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.checkOutDate ? "border-red-500" : ""
                }
              />
              {form.formState.errors.checkOutDate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.checkOutDate.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">{t("room")}</Label>
              {availabilityLoading && (
                <div className="text-xs text-muted-foreground">
                  {t("searchingAvailability")}
                </div>
              )}
              <Select
                value={form.watch("roomId")}
                onValueChange={(value) => form.setValue("roomId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectRoom")} />
                </SelectTrigger>
                <SelectContent>
                  {availabilityLoading ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      {t("searchingAvailableRooms")}
                    </div>
                  ) : (
                    (() => {
                      // Only show rooms if we have dates selected and availability search has completed
                      if (!formValues.checkInDate || !formValues.checkOutDate) {
                        return (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            {t("selectDatesToSeeRooms")}
                          </div>
                        );
                      }

                      // If we have dates but no availability result, show searching message
                      if (availableRooms === null) {
                        return (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            {t("verifyingAvailability")}
                          </div>
                        );
                      }

                      const roomsToShow = availableRooms;

                      if (roomsToShow.length === 0) {
                        return (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            {t("noRoomsForDates")}
                          </div>
                        );
                      }

                      return roomsToShow.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.number} - {getRoomTypeDisplayName(room.type)} (
                          {formatCurrency(Number(room.price), currencyCode)}/{t("perNight")})
                        </SelectItem>
                      ));
                    })()
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.roomId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.roomId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t("status")}</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue(
                    "status",
                    value as
                      | "PENDING"
                      | "CONFIRMED"
                      | "CHECKED_IN"
                      | "CHECKED_OUT"
                      | "CANCELLED",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">{t("pending")}</SelectItem>
                  <SelectItem value="CONFIRMED">{t("confirmed")}</SelectItem>
                  <SelectItem value="CHECKED_IN">{t("checkedIn")}</SelectItem>
                  <SelectItem value="CHECKED_OUT">{t("checkedOut")}</SelectItem>
                  <SelectItem value="CANCELLED">{t("cancelled")}</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Discounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountPercent">
                {t("discountPercentOptional")}
              </Label>
              <Input
                id="discountPercent"
                type="number"
                min={0}
                max={100}
                step={0.01}
                placeholder="0"
                {...form.register("discountPercent")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.discountPercent ? "border-red-500" : ""
                }
              />
              {form.formState.errors.discountPercent && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.discountPercent.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountAmount">
                {t("discountAmountOptional")}
              </Label>
              <Input
                id="discountAmount"
                type="number"
                min={0}
                step={0.01}
                placeholder="0"
                {...form.register("discountAmount")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.discountAmount ? "border-red-500" : ""
                }
              />
              {form.formState.errors.discountAmount && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.discountAmount.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading || form.formState.isSubmitting}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("saveChanges")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
