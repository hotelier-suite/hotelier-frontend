"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  recreationalApi,
  type RecreationalBooking,
  type RecreationalFacility,
  type BookingPriority,
  type CreateRecreationalBookingData,
  type FacilityAvailability,
  type TimeSlot,
} from "@/lib/api/recreational";
import { toast } from "sonner";

const bookingSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Invalid email"),
  guestPhone: z.string().optional(),
  roomNumber: z.string().optional(),
  facilityId: z.number().min(1, "Select a facility"),
  bookingDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  participants: z.number().min(1, "Must have at least 1 participant"),
  priority: z.string(),
  specialRequests: z.string().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: RecreationalBooking | null;
  facilities: RecreationalFacility[];
  onBookingCreated: (booking: RecreationalBooking) => void;
}

const priorityOptions: Array<{ value: BookingPriority; label: string }> = [
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "VIP", label: "VIP" },
];

export function BookingDialog({
  open,
  onOpenChange,
  booking,
  facilities,
  onBookingCreated,
}: BookingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] =
    useState<RecreationalFacility | null>(null);
  const [availability, setAvailability] = useState<FacilityAvailability | null>(
    null,
  );
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState(0);

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

  // Declare callback functions first
  const checkAvailability = useCallback(async () => {
    if (!selectedFacility || !bookingDate) return;

    try {
      setLoadingAvailability(true);
      const availabilityData = await recreationalApi.getFacilityAvailability(
        Number(selectedFacility.id),
        bookingDate,
      );
      setAvailability(availabilityData);
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Error checking availability");
    } finally {
      setLoadingAvailability(false);
    }
  }, [selectedFacility, bookingDate]);

  const calculateCost = useCallback(() => {
    if (!selectedFacility || !startTime || !endTime) return;

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
  }, [selectedFacility, startTime, endTime, discountPercent, discountAmount]);

  // Update selected facility when facilityId changes
  useEffect(() => {
    const facility = facilities.find((f) => f.id === facilityId);
    setSelectedFacility(facility || null);
  }, [facilityId, facilities]);

  // Check availability when facility, date changes
  useEffect(() => {
    if (selectedFacility && bookingDate) {
      checkAvailability();
    }
  }, [selectedFacility, bookingDate, checkAvailability]);

  // Calculate cost when relevant fields change
  useEffect(() => {
    if (selectedFacility && startTime && endTime) {
      calculateCost();
    }
  }, [
    selectedFacility,
    startTime,
    endTime,
    discountPercent,
    discountAmount,
    calculateCost,
  ]);

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
        toast.error("End time must be after start time");
        return;
      }

      if (selectedFacility) {
        if (duration < selectedFacility.minimumBookingHours) {
          toast.error(
            `Minimum duration is ${selectedFacility.minimumBookingHours} hours`,
          );
          return;
        }
        if (duration > selectedFacility.maximumBookingHours) {
          toast.error(
            `Maximum duration is ${selectedFacility.maximumBookingHours} hours`,
          );
          return;
        }
        if (values.participants > selectedFacility.capacity) {
          toast.error(
            `Maximum capacity is ${selectedFacility.capacity} people`,
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
        result = await recreationalApi.updateBooking(
          Number(booking.id),
          bookingData,
        );
        toast.success("Booking updated successfully");
      } else {
        result = await recreationalApi.createBooking(bookingData);
        toast.success("Booking created successfully");
      }

      onBookingCreated(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error(
        booking
          ? "Error updating booking"
          : "Error creating booking",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {booking ? "Edit Booking" : "New Booking"}
          </DialogTitle>
          <DialogDescription>
            {booking
              ? "Modify the recreational booking details"
              : "Create a new booking for recreational facilities"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Guest Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">Guest Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
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
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@email.com"
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
                      <FormLabel>Phone</FormLabel>
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
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input placeholder="301" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h4 className="font-semibold">Booking Details</h4>

              <FormField
                control={form.control}
                name="facilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
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
                                  Free
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
                        <span className="font-medium">Capacity:</span>{" "}
                        {selectedFacility.capacity}
                      </div>
                      <div>
                        <span className="font-medium">Rate:</span> Free
                      </div>
                      <div>
                        <span className="font-medium">Min:</span>{" "}
                        {selectedFacility.minimumBookingHours}h
                      </div>
                      <div>
                        <span className="font-medium">Max:</span>{" "}
                        {selectedFacility.maximumBookingHours}h
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">Schedule:</span>{" "}
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
                      <FormLabel>Date *</FormLabel>
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
                      <FormLabel>Start Time *</FormLabel>
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
                      <FormLabel>End Time *</FormLabel>
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
                      <FormLabel>Participants *</FormLabel>
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
                      <FormLabel>Priority</FormLabel>
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
                              {priority.label}
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
                    Availability -{" "}
                    {new Date(bookingDate).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingAvailability ? (
                    <div className="text-sm text-muted-foreground">
                      Checking availability...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Capacidad: {availability.totalCapacity} •{" "}
                        {availability.isFullyBooked
                          ? "Fully booked"
                          : "Available"}
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
                          No available time slots
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
                    Cost Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-green-600">
                    Total: ${calculatedCost.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discounts */}
            <div className="space-y-4">
              <h4 className="font-semibold">Discounts (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountPercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
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
                      <FormLabel>Fixed Discount ($)</FormLabel>
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
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes or special requests..."
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
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? booking
                    ? "Updating..."
                    : "Creating..."
                  : booking
                    ? "Update"
                    : "Create Booking"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
