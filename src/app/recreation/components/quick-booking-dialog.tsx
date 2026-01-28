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
import { reservationsService } from "@/lib/features/reservations/service";
import type { Reservation } from "@/lib/features/reservations/types";

const quickBookingSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Invalid email"),
  guestPhone: z.string().optional(),
  roomNumber: z.string().optional(),
  facilityId: z.number().min(1, "Select a facility"),
  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  participants: z.number().min(1, "Must have at least 1 participant"),
});

type QuickBookingFormValues = z.infer<typeof quickBookingSchema>;

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
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentReservations, setCurrentReservations] = useState<Reservation[]>(
    [],
  );

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
        toast.error("Error loading current guest list");
      }
    };
    loadCurrentGuests();
  }, []);

  const form = useForm<QuickBookingFormValues>({
    resolver: zodResolver(quickBookingSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomNumber: "",
      facilityId: 0,
      bookingDate: new Date().toISOString().split("T")[0], // Today by default
      startTime: "10:00", // Default opening time
      participants: 1,
    },
  });

  const selectedFacilityId = form.watch("facilityId");
  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const calculateQuickDuration = (..._args: [string]): number => {
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

      const duration = calculateQuickDuration(values.startTime);
      const endTime = calculateEndTime(values.startTime, duration);

      // Only validate capacity
      if (values.participants > selectedFacility.capacity) {
        setErrorMessage(
          `Maximum capacity is ${selectedFacility.capacity} people`,
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

      toast.success("Quick booking created successfully");
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
        errorMessage = errorWithMessage.message;
      } else if (typeof errorWithMessage.message === "string") {
        errorMessage = errorWithMessage.message;
      } else {
        errorMessage = "Error creating quick booking";
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
            <DialogTitle>Error creating booking</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-4 w-full">
              <div className="text-2xl mb-4">⚠️</div>
              <div className="text-red-600 mb-4">
                {errorMessage.includes("not available") && (
                  <p className="mb-4">
                    ❌ The selected time slot is not available
                  </p>
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
                ? "Use this time"
                : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Attend Facility</DialogTitle>
            <DialogDescription>
              Create a quick booking to attend our facilities with minimum
              duration for immediate availability
            </DialogDescription>
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
                      <FormLabel>Guest Name *</FormLabel>
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
                            <SelectValue placeholder="Select a guest">
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
                      <FormLabel>Email *</FormLabel>
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
                      <FormLabel>Room</FormLabel>
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
                                  Cap: {facility.capacity} • Min:{" "}
                                  {facility.minimumBookingHours}h
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
                      <FormLabel>Participants *</FormLabel>
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
                  <h4 className="font-semibold text-sm">Booking preview:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Facility:</span>
                      <div className="font-medium">{selectedFacility.name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-medium">
                        {calculateQuickDuration(form.watch("startTime"))}h
                        (minimum)
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Schedule:</span>
                      <div className="font-medium text-amber-600">
                        {selectedFacility.openingTime} a{" "}
                        {selectedFacility.closingTime}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Estimated end time:
                      </span>
                      <div className="font-medium">
                        {calculateEndTime(
                          form.watch("startTime"),
                          calculateQuickDuration(form.watch("startTime")),
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
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !selectedFacility}>
                  {loading ? "Creating..." : "Sign Up!"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
