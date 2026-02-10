"use client";

import { useTranslations, useLocale } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import { getDateFnsLocale } from "@/lib/utils/locale";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { type Room } from "@/lib/features/rooms/types";
import { useEffect, useState } from "react";
import { type Guest } from "@/lib/features/guests/types";
import { guestsService } from "@/lib/features/guests/service";
import { reservationsService } from "@/lib/features/reservations/service";

function createReservationFormSchema(t: (key: string) => string) {
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
          return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(val);
        }, t("validationPhoneInvalid")),
      guests: z
        .number()
        .min(1, t("validationGuestsMin"))
        .max(10, t("validationGuestsMax")),
      checkInDate: z
        .string({ message: t("validationCheckInRequired") })
        .min(1, t("validationCheckInRequired"))
        .refine((date) => {
          const checkIn = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return checkIn >= today;
        }, t("validationCheckInTodayOrLater")),
      checkOutDate: z
        .string({ message: t("validationCheckOutRequired") })
        .min(1, t("validationCheckOutRequired")),
      roomId: z.number().min(1, t("validationSelectRoom")),
      discountPercent: z
        .number()
        .min(0, t("validationDiscountAmountMin"))
        .max(100, t("validationDiscountPercentMax"))
        .nullable()
        .optional(),
      discountAmount: z
        .number()
        .min(0, t("validationDiscountAmountMin"))
        .nullable()
        .optional(),
      guestId: z.number().nullable().optional(),
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

type ReservationFormData = z.infer<
  ReturnType<typeof createReservationFormSchema>
>;

interface NewReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReservation: (data: ReservationFormData) => void;
  rooms: Room[];
  loading: boolean;
  currencyCode?: string;
  enableGuestSearch?: boolean;
  hideDiscounts?: boolean;
}

// Subcomponent for Guest Search Section
function GuestSearchSection({
  form,
  enabled = true,
  t,
}: {
  form: UseFormReturn<ReservationFormData>;
  enabled?: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  const [guestSearch, setGuestSearch] = useState<string>("");
  const [guestOptions, setGuestOptions] = useState<Guest[]>([]);

  useEffect(() => {
    if (!enabled || !guestSearch.trim()) return;

    let active = true;
    (async () => {
      try {
        const list = await guestsService.search(guestSearch);
        if (active) setGuestOptions(list.slice(0, 20));
      } catch (e) {
        console.error("Error loading guests:", e);
      }
    })();
    return () => {
      active = false;
    };
  }, [guestSearch, enabled]);

  const handleGuestSearchChange = (value: string) => {
    setGuestSearch(value);
    if (!value.trim()) {
      setGuestOptions([]);
    }
  };

  if (!enabled) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{t("searchGuest")}</Label>
        <Input
          placeholder={t("searchGuestPlaceholder")}
          value={guestSearch}
          onChange={(e) => handleGuestSearchChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guestId">{t("selectGuestOptional")}</Label>
        <Select
          value={form.watch("guestId")?.toString() || ""}
          onValueChange={(value) =>
            form.setValue("guestId", value ? parseInt(value) : null)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("notAssigned")} />
          </SelectTrigger>
          <SelectContent>
            {guestOptions.map((g) => (
              <SelectItem key={g.id} value={g.id.toString()}>
                {g.name} ({g.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Subcomponent for Date Selection
function DateSelectionSection({
  form,
  t,
}: {
  form: UseFormReturn<ReservationFormData>;
  t: ReturnType<typeof useTranslations>;
}) {
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);
  const formValues = form.watch();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{t("checkInDate")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formValues.checkInDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formValues.checkInDate ? (
                (() => {
                  const [year, month, day] = formValues.checkInDate.split("-");
                  const date = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day),
                  );
                  return format(date, "PPP", { locale: dateFnsLocale });
                })()
              ) : (
                <span>{t("selectDate")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                formValues.checkInDate
                  ? (() => {
                      const [year, month, day] =
                        formValues.checkInDate.split("-");
                      return new Date(
                        parseInt(year),
                        parseInt(month) - 1,
                        parseInt(day),
                      );
                    })()
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  form.setValue("checkInDate", `${year}-${month}-${day}`);
                }
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {form.formState.errors.checkInDate && (
          <p className="text-sm text-red-500">
            {form.formState.errors.checkInDate.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>{t("checkOutDate")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formValues.checkOutDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formValues.checkOutDate ? (
                (() => {
                  const [year, month, day] = formValues.checkOutDate.split("-");
                  const date = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day),
                  );
                  return format(date, "PPP", { locale: dateFnsLocale });
                })()
              ) : (
                <span>{t("selectDate")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                formValues.checkOutDate
                  ? (() => {
                      const [year, month, day] =
                        formValues.checkOutDate.split("-");
                      return new Date(
                        parseInt(year),
                        parseInt(month) - 1,
                        parseInt(day),
                      );
                    })()
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  form.setValue("checkOutDate", `${year}-${month}-${day}`);
                }
              }}
              disabled={(date) => {
                if (!formValues.checkInDate) {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date <= today;
                }
                const [year, month, day] = formValues.checkInDate.split("-");
                const checkInDate = new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  parseInt(day),
                );
                checkInDate.setHours(0, 0, 0, 0);
                return date <= checkInDate;
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {form.formState.errors.checkOutDate && (
          <p className="text-sm text-red-500">
            {form.formState.errors.checkOutDate.message}
          </p>
        )}
      </div>
    </div>
  );
}

export function NewReservationDialog({
  isOpen,
  onClose,
  onAddReservation,
  rooms,
  loading,
  currencyCode,
  enableGuestSearch,
  hideDiscounts,
}: NewReservationDialogProps) {
  const t = useTranslations("NewReservationDialog");
  const reservationFormSchema = createReservationFormSchema(t);
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guests: 1,
      checkInDate: "",
      checkOutDate: "",
      roomId: 0,
      discountPercent: null,
      discountAmount: null,
      guestId: null,
    },
  });

  const formValues = form.watch();

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

  // Get guest count from form
  const totalGuests = formValues.guests || 1;

  // Availability search (rooms based on selected dates and guests)
  const [availableRooms, setAvailableRooms] = useState<Room[] | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

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
            !list.some((r) => Number(r.id) === formValues.roomId)
          ) {
            form.setValue("roomId", 0);
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
  ]);

  // Calculate totals with dependencies tracked for React
  const roomList = availableRooms ?? rooms;
  const selectedRoom = roomList.find((r) => Number(r.id) === formValues.roomId);

  const nights = (() => {
    if (!formValues.checkInDate || !formValues.checkOutDate) return 0;
    const checkIn = new Date(formValues.checkInDate);
    const checkOut = new Date(formValues.checkOutDate);
    if (checkOut <= checkIn) return 0;
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
  })();

  const roomPrice = selectedRoom ? Number(selectedRoom.price) : 0;
  const baseTotal = roomPrice * nights;
  const calcDiscountPercent = Number(formValues.discountPercent || 0);
  const discountFromPercent =
    calcDiscountPercent > 0 ? (baseTotal * calcDiscountPercent) / 100 : 0;
  const finalTotal = Math.max(0, baseTotal - discountFromPercent);
  const calculations = {
    roomPrice,
    baseTotal,
    discountPercent: calcDiscountPercent,
    discountFromPercent,
    finalTotal,
  };

  const onSubmit = (data: ReservationFormData) => {
    onAddReservation(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <GuestSearchSection
            form={form}
            enabled={enableGuestSearch !== false}
            t={t}
          />

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
                value={formValues.guests?.toString() || "1"}
                onValueChange={(value) =>
                  form.setValue("guests", Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectQuantity")} />
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

          <DateSelectionSection form={form} t={t} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">{t("room")}</Label>
              {availabilityLoading && (
                <div className="text-xs text-muted-foreground">
                  {t("searchingAvailability")}
                </div>
              )}
              <Select
                value={formValues.roomId?.toString() || ""}
                onValueChange={(value) =>
                  form.setValue("roomId", Number(value))
                }
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
                      const roomsToShow =
                        availableRooms !== null
                          ? availableRooms
                          : rooms.filter((room) => room.isAvailable);

                      if (roomsToShow.length === 0) {
                        return (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            {formValues.checkInDate && formValues.checkOutDate
                              ? t("noRoomsForDates")
                              : t("noRoomsSelectDates")}
                          </div>
                        );
                      }

                      return roomsToShow.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.number} - {getRoomTypeDisplayName(room.type)} (
                          {formatCurrency(Number(room.price), currencyCode)}
                          {t("perNight")}, {t("capacityAbbr")} {room.capacity})
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
          </div>

          {/* Discount - only show if not hidden */}
          {!hideDiscounts && (
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
                    form.formState.errors.discountPercent
                      ? "border-red-500"
                      : ""
                  }
                />
                {form.formState.errors.discountPercent && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.discountPercent.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Estimated total */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>
                {t("nights")}{" "}
                <span className="font-medium text-foreground">{nights}</span>
              </div>
              <div>
                {t("subtotal")}{" "}
                <span className="font-medium text-foreground">
                  {formatCurrency(calculations.baseTotal, currencyCode)}
                </span>
              </div>
              {!hideDiscounts && calculations.discountPercent > 0 && (
                <div>
                  {t("discount")}{" "}
                  <span className="font-medium text-foreground">
                    {t("percentValue", { value: calculations.discountPercent })}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm">{t("estimatedTotal")}</div>
              <div className="text-2xl font-bold">
                {formatCurrency(calculations.finalTotal, currencyCode)}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
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
              {(loading || form.formState.isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("createReservation")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
