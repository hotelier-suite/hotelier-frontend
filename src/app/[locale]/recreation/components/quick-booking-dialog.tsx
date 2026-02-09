"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { recreationalService } from "@/lib/features/recreational/service";
import type {
  RecreationalBooking,
  RecreationalFacility,
  CreateRecreationalBookingData,
} from "@/lib/features/recreational/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { reservationsService } from "@/lib/features/reservations/service";
import type { Reservation } from "@/lib/features/reservations/types";

function createQuickBookingSchema(t: (key: string) => string) {
  return z.object({
    guestName: z.string().min(1, t("validationGuestNameRequired")),
    guestEmail: z.string().email(t("validationEmailInvalid")),
    guestPhone: z.string().optional(),
    roomNumber: z.string().optional(),
    facilityId: z.number().min(1, t("validationFacilityRequired")),
    bookingDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, t("validationDateFormat"))
      .min(1, t("validationDateRequired")),
    startTime: z.string().min(1, t("validationStartTimeRequired")),
    participants: z.number().min(1, t("validationParticipantsMin")),
  });
}

type QuickBookingFormValues = z.infer<
  ReturnType<typeof createQuickBookingSchema>
>;

interface QuickBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facilities: RecreationalFacility[];
  onBookingCreated: (booking: RecreationalBooking) => void;
}

export function QuickBookingDialog({
  open,
  onOpenChange,
  facilities,
  onBookingCreated,
}: QuickBookingDialogProps) {
  const t = useTranslations("QuickBookingDialog");
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentReservations, setCurrentReservations] = useState<Reservation[]>(
    [],
  );

  const quickBookingSchema = createQuickBookingSchema(t);

  // Function to filter duplicate reservations by ID
  const getUniqueReservations = (reservations: Reservation[]) => {
    const uniqueMap = new Map();

    reservations.forEach((reservation) => {
      if (!uniqueMap.has(reservation.id)) {
        uniqueMap.set(reservation.id, reservation);
      }
    });

    return Array.from(uniqueMap.values());
  };

  useEffect(() => {
    const loadCurrentGuests = async () => {
      try {
        const reservations = await reservationsService.getCurrentGuests();
        const uniqueReservations = getUniqueReservations(reservations);
        setCurrentReservations(uniqueReservations);
      } catch (error) {
        console.error("Error loading current guests:", error);
        toast.error(t("errorLoadingGuests"));
      }
    };
    loadCurrentGuests();
  }, [t]);

  const form = useForm<QuickBookingFormValues>({
    resolver: zodResolver(quickBookingSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomNumber: "",
      facilityId: 0,
      bookingDate: new Date().toISOString().split("T")[0],
      startTime: "10:00",
      participants: 1,
    },
  });

  const selectedFacilityId = form.watch("facilityId");
  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  const calculateQuickDuration = (): number => {
    // For quick booking, use minimum booking hours
    return selectedFacility?.minimumBookingHours || 1;
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    return end.toTimeString().substring(0, 5);
  };

  // Time advance validations removed

  const onSubmit = async (values: QuickBookingFormValues) => {
    if (!selectedFacility) return;

    try {
      setLoading(true);

      const duration = calculateQuickDuration();
      const endTime = calculateEndTime(values.startTime, duration);

      // Only validate capacity
      if (values.participants > selectedFacility.capacity) {
        setErrorMessage(
          t("maximumCapacity", { capacity: selectedFacility.capacity }),
        );
        setErrorDialogOpen(true);
        return;
      }

      // Make sure the date is in the correct format
      const bookingData: CreateRecreationalBookingData = {
        ...values,
        bookingDate: new Date(values.bookingDate).toISOString().split("T")[0], // YYYY-MM-DD format
        endTime,
        duration,
        totalCost: 0, // Recreational facilities are free
        status: "PENDING",
        priority: "NORMAL",
        participants: values.participants || 1,
        guestPhone: values.guestPhone || undefined,
        roomNumber: values.roomNumber || undefined,
      };

      const result = await recreationalService.createBooking(bookingData);

      toast.success(t("bookingCreatedSuccess"));
      onBookingCreated(result);
      form.reset();
    } catch (error: unknown) {
      // Type guard for error with message
      const errorWithMessage = error as { message?: string };

      // Don't log expected time conflict errors
      if (!errorWithMessage.message?.includes("not available")) {
        console.error("Unexpected error creating booking:", error);
      }

      let errorMessage = "";
      if (errorWithMessage.message?.includes("not available")) {
        // This is an expected time conflict error
        errorMessage = t("timeSlotNotAvailable");
      } else {
        errorMessage = t("errorCreatingBooking");
      }

      // If we find information about the next available time
      if (errorMessage.includes("next available time")) {
        const timeMatch = errorMessage.match(/(\d{2}:\d{2})/);
        if (timeMatch) {
          const nextAvailableTime = timeMatch[1];
          form.setValue("startTime", nextAvailableTime);
        }
      }

      setErrorMessage(errorMessage);
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("errorTitle")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-4 w-full">
              <div className="text-2xl mb-4">⚠️</div>
              <div className="text-red-600 mb-4">
                {errorMessage.includes("not available") && (
                  <p className="mb-4">❌ {t("timeSlotNotAvailable")}</p>
                )}
              </div>
              {errorMessage.split("\n").map((part, index) => {
                if (part.includes("you can book")) {
                  return (
                    <div
                      key={index}
                      className="text-amber-600 font-semibold mt-2 p-3 bg-amber-50 rounded-md border border-amber-200"
                    >
                      ✅ {part.trim()}
                    </div>
                  );
                }
                return (
                  part.trim() && (
                    <p key={index} className="text-gray-600">
                      {part.trim()}
                    </p>
                  )
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setErrorDialogOpen(false)}>
              {errorMessage.includes("next available time")
                ? t("useThisTime")
                : t("ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Guest Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("guestName")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            const selectedGuest = currentReservations.find(
                              (r) => r.id.toString() === value,
                            );
                            if (selectedGuest) {
                              field.onChange(selectedGuest.guestName || "");
                              form.setValue(
                                "guestEmail",
                                selectedGuest.guestEmail || "",
                              );
                              form.setValue(
                                "guestPhone",
                                selectedGuest.guestPhone || "",
                              );
                              form.setValue(
                                "roomNumber",
                                selectedGuest.room.number || "",
                              );
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectGuest")}>
                              {field.value}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {currentReservations.map((reservation) => (
                              <SelectItem
                                key={reservation.id.toString()}
                                value={reservation.id.toString()}
                              >
                                <div className="font-medium">
                                  {reservation.guestName}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phone")}</FormLabel>
                      <FormControl>
                        <Input placeholder="+12345678901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room")}</FormLabel>
                      <FormControl>
                        <Input placeholder="301" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Facility Selection */}
              <FormField
                control={form.control}
                name="facilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("facility")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectFacility")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem
                            key={facility.id}
                            value={facility.id.toString()}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="font-medium">
                                  {facility.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {t("capLabel")}: {facility.capacity} •{" "}
                                  {t("minLabel")}:{" "}
                                  {facility.minimumBookingHours}
                                  {t("hoursUnit")}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bookingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("date")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("startTime")}</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          min={selectedFacility?.openingTime || "00:00"}
                          max={selectedFacility?.closingTime || "23:59"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("participants")}</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preview */}
              {selectedFacility && (
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <h4 className="font-semibold text-sm">
                    {t("bookingPreview")}:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {t("facilityLabel")}:
                      </span>
                      <div className="font-medium">{selectedFacility.name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("durationLabel")}:
                      </span>
                      <div className="font-medium">
                        {calculateQuickDuration()}
                        {t("hoursUnit")} ({t("minimum")})
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">
                        {t("scheduleLabel")}:
                      </span>
                      <div className="font-medium text-amber-600">
                        {selectedFacility.openingTime} a{" "}
                        {selectedFacility.closingTime}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("estimatedEndTime")}:
                      </span>
                      <div className="font-medium">
                        {calculateEndTime(
                          form.watch("startTime"),
                          calculateQuickDuration(),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={loading || !selectedFacility}>
                  {loading ? t("creating") : t("signUp")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
