"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarDays, DollarSign } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recreationalService } from "@/lib/features/recreational/service";
import type {
  RecreationalBooking,
  RecreationalFacility,
  BookingPriority,
  CreateRecreationalBookingData,
  FacilityAvailability,
  TimeSlot,
} from "@/lib/features/recreational/types";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { formatCurrency } from "@/lib/utils/currency";

function createBookingSchema(t: (key: string) => string) {
  return z.object({
    guestName: z.string().min(1, t("validationGuestNameRequired")),
    guestEmail: z.string().email(t("validationEmailInvalid")),
    guestPhone: z.string().optional(),
    roomNumber: z.string().optional(),
    facilityId: z.number().min(1, t("validationFacilityRequired")),
    bookingDate: z.string().min(1, t("validationDateRequired")),
    startTime: z.string().min(1, t("validationStartTimeRequired")),
    endTime: z.string().min(1, t("validationEndTimeRequired")),
    participants: z.number().min(1, t("validationParticipantsMin")),
    priority: z.string(),
    specialRequests: z.string().optional(),
    discountPercent: z.number().min(0).max(100).optional(),
    discountAmount: z.number().min(0).optional(),
  });
}

type BookingFormValues = z.infer<ReturnType<typeof createBookingSchema>>;

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: RecreationalBooking | null;
  facilities: RecreationalFacility[];
  onBookingCreated: (booking: RecreationalBooking) => void;
}

const priorityOptions: Array<{ value: BookingPriority; labelKey: string }> = [
  { value: "NORMAL", labelKey: "priorityNormal" },
  { value: "HIGH", labelKey: "priorityHigh" },
  { value: "VIP", labelKey: "priorityVIP" },
];

export function BookingDialog({
  open,
  onOpenChange,
  booking,
  facilities,
  onBookingCreated,
}: BookingDialogProps) {
  const t = useTranslations("BookingDialog");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] =
    useState<RecreationalFacility | null>(null);
  const [availability, setAvailability] = useState<FacilityAvailability | null>(
    null,
  );
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState(0);

  const bookingSchema = createBookingSchema(t);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomNumber: "",
      facilityId: 0,
      bookingDate: "",
      startTime: "",
      endTime: "",
      participants: 1,
      priority: "NORMAL",
      specialRequests: "",
      discountPercent: 0,
      discountAmount: 0,
    },
  });

  const facilityId = form.watch("facilityId");
  const bookingDate = form.watch("bookingDate");
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const discountPercent = form.watch("discountPercent") || 0;
  const discountAmount = form.watch("discountAmount") || 0;

  // Update selected facility when facilityId changes
  useEffect(() => {
    const facility = facilities.find((f) => f.id === facilityId);
    setSelectedFacility(facility || null);
  }, [facilityId, facilities]);

  // Check availability when facility, date changes
  useEffect(() => {
    if (selectedFacility && bookingDate) {
      const checkAvailability = async () => {
        try {
          setLoadingAvailability(true);
          const availabilityData =
            await recreationalService.getFacilityAvailability(
              Number(selectedFacility.id),
              bookingDate,
            );
          setAvailability(availabilityData);
        } catch (error) {
          console.error("Error checking availability:", error);
          toast.error(t("errorCheckingAvailability"));
        } finally {
          setLoadingAvailability(false);
        }
      };
      checkAvailability();
    }
  }, [selectedFacility, bookingDate, t]);

  // Calculate cost when relevant fields change
  useEffect(() => {
    if (selectedFacility && startTime && endTime) {
      const calculateCost = () => {
        try {
          const start = new Date(`2000-01-01T${startTime}:00`);
          const end = new Date(`2000-01-01T${endTime}:00`);
          const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

          if (duration <= 0) {
            setCalculatedCost(0);
            return;
          }

          let cost = 0; // All facilities are free

          // Apply discounts
          if (discountPercent > 0) {
            cost = cost * (1 - discountPercent / 100);
          }
          if (discountAmount > 0) {
            cost = Math.max(0, cost - discountAmount);
          }

          setCalculatedCost(Math.round(cost * 100) / 100);
        } catch (error) {
          console.error("Error calculating cost:", error);
          setCalculatedCost(0);
        }
      };
      calculateCost();
    }
  }, [selectedFacility, startTime, endTime, discountPercent, discountAmount]);

  // Initialize form when booking changes
  useEffect(() => {
    if (booking) {
      form.reset({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone || "",
        roomNumber: booking.roomNumber || "",
        facilityId: booking.facilityId,
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        participants: booking.participants,
        priority: booking.priority,
        specialRequests: booking.specialRequests || "",
        discountPercent: booking.discountPercent || 0,
        discountAmount: booking.discountAmount || 0,
      });
    } else {
      form.reset();
      setAvailability(null);
      setCalculatedCost(0);
    }
  }, [booking, form]);

  const getAvailableTimeSlots = (): TimeSlot[] => {
    if (!availability) return [];
    return availability.availableSlots.filter((slot) => slot.isAvailable);
  };

  const onSubmit = async (values: BookingFormValues) => {
    try {
      setLoading(true);

      // Validate time range
      const start = new Date(`2000-01-01T${values.startTime}:00`);
      const end = new Date(`2000-01-01T${values.endTime}:00`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      if (duration <= 0) {
        toast.error(t("endTimeAfterStart"));
        return;
      }

      if (selectedFacility) {
        if (duration < selectedFacility.minimumBookingHours) {
          toast.error(
            t("minimumDuration", {
              hours: selectedFacility.minimumBookingHours,
            }),
          );
          return;
        }
        if (duration > selectedFacility.maximumBookingHours) {
          toast.error(
            t("maximumDuration", {
              hours: selectedFacility.maximumBookingHours,
            }),
          );
          return;
        }
        if (values.participants > selectedFacility.capacity) {
          toast.error(
            t("maximumCapacity", { capacity: selectedFacility.capacity }),
          );
          return;
        }
      }

      const bookingData: CreateRecreationalBookingData = {
        ...values,
        priority: values.priority as BookingPriority,
        duration,
        totalCost: calculatedCost,
        status: "PENDING",
        discountPercent: values.discountPercent || undefined,
        discountAmount: values.discountAmount || undefined,
        specialRequests: values.specialRequests || undefined,
        guestPhone: values.guestPhone || undefined,
        roomNumber: values.roomNumber || undefined,
      };

      let result: RecreationalBooking;

      if (booking) {
        result = await recreationalService.updateBooking(
          Number(booking.id),
          bookingData,
        );
        toast.success(t("bookingUpdatedSuccess"));
      } else {
        result = await recreationalService.createBooking(bookingData);
        toast.success(t("bookingCreatedSuccess"));
      }

      onBookingCreated(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error(booking ? t("errorUpdating") : t("errorCreating"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{booking ? t("editTitle") : t("newTitle")}</DialogTitle>
          <DialogDescription>
            {booking ? t("editDescription") : t("newDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Guest Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">{t("guestInformation")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("guestName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholderGuestName")}
                          {...field}
                        />
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
                          placeholder={t("placeholderEmail")}
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
                        <Input placeholder={t("placeholderPhone")} {...field} />
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
                      <FormLabel>{t("roomNumber")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholderRoomNumber")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h4 className="font-semibold">{t("bookingDetails")}</h4>

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
                        {facilities
                          .filter(
                            (f) =>
                              f.status === "AVAILABLE" || f.id === field.value,
                          )
                          .map((facility) => (
                            <SelectItem
                              key={facility.id}
                              value={facility.id.toString()}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{facility.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {t("free")}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Facility Details */}
              {selectedFacility && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {selectedFacility.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="font-medium">
                          {t("capacityLabel")}:
                        </span>{" "}
                        {selectedFacility.capacity}
                      </div>
                      <div>
                        <span className="font-medium">{t("rate")}:</span>{" "}
                        {t("free")}
                      </div>
                      <div>
                        <span className="font-medium">{t("min")}:</span>{" "}
                        {selectedFacility.minimumBookingHours}
                        {t("hoursUnit")}
                      </div>
                      <div>
                        <span className="font-medium">{t("max")}:</span>{" "}
                        {selectedFacility.maximumBookingHours}
                        {t("hoursUnit")}
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">{t("schedule")}:</span>{" "}
                      {selectedFacility.openingTime} -{" "}
                      {selectedFacility.closingTime}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bookingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dateLabel")}</FormLabel>
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
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("endTime")}</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("participantsLabel")}</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("priority")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityOptions.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                            >
                              {t(priority.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Availability Info */}
            {availability && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {t("availability")} -{" "}
                    {new Date(bookingDate).toLocaleDateString(intlLocale)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingAvailability ? (
                    <div className="text-sm text-muted-foreground">
                      {t("checkingAvailability")}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        {t("capacity")}: {availability.totalCapacity} •{" "}
                        {availability.isFullyBooked
                          ? t("fullyBooked")
                          : t("availableStatus")}
                      </div>
                      {getAvailableTimeSlots().length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {getAvailableTimeSlots().map((slot, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {slot.startTime}-{slot.endTime}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-red-600">
                          {t("noAvailableSlots")}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cost Calculation */}
            {calculatedCost > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {t("costCalculation")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-green-600">
                    {t("total")}: {formatCurrency(calculatedCost)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discounts */}
            <div className="space-y-4">
              <h4 className="font-semibold">{t("discounts")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountPercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("discountPercent")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fixedDiscount")}</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("specialRequests")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("specialRequestsPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? booking
                    ? t("updating")
                    : t("creating")
                  : booking
                    ? t("update")
                    : t("createBooking")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
