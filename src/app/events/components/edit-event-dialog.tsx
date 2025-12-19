"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Edit Event Schema
const editEventSchema = z.object({
  title: z
    .string()
    .min(1, "Event name is required")
    .min(3, "Name must be at least 3 characters"),
  client: z.string().min(1, "Client name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Must select a venue"),
  capacity: z.string().min(1, "Capacity is required"),
  budget: z.string().min(1, "Budget is required"),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
    message: "Must select a valid status",
  }),
  services: z.object({
    catering: z.boolean(),
    audiovisual: z.boolean(),
    decoration: z.boolean(),
    accommodation: z.boolean(),
  }),
});

type EditEventFormData = z.infer<typeof editEventSchema>;

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

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEventUpdate: (id: number, updates: Partial<Event>) => Promise<void>;
  venues?: string[];
}

export function EditEventDialog({
  open,
  onOpenChange,
  event,
  onEventUpdate,
  venues = [
    "Main Hall",
    "Executive Room",
    "Garden Pavilion",
    "Conference Room Alpha",
  ],
}: EditEventDialogProps) {
  const form = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      title: "",
      client: "",
      date: "",
      time: "",
      venue: "",
      capacity: "",
      budget: "",
      status: "pending" as const,
      services: {
        catering: false,
        audiovisual: false,
        decoration: false,
        accommodation: false,
      },
    },
  });

  const { control, handleSubmit, reset } = form;

  // Reset form when event changes
  useEffect(() => {
    if (event && open) {
      reset({
        title: event.title,
        client: event.client,
        date: event.date,
        time: event.time,
        venue: event.venue,
        capacity: event.capacity.toString(),
        budget: event.budget.toString(),
        status: event.status as
          | "pending"
          | "confirmed"
          | "cancelled"
          | "completed",
        services: {
          catering: event.services.catering,
          audiovisual: event.services.audiovisual,
          decoration: event.services.decoration,
          accommodation: event.services.accommodation,
        },
      });
    }
  }, [event, open, reset]);

  const onSubmit = async (data: EditEventFormData) => {
    if (!event) return;

    try {
      console.log("EditDialog: Form data received:", data);

      const updateData = {
        title: data.title,
        client: data.client,
        date: data.date,
        time: data.time,
        venue: data.venue,
        capacity: parseInt(data.capacity, 10),
        budget: parseFloat(data.budget),
        status: data.status,
        services: data.services,
      };

      console.log("EditDialog: Sending update data:", updateData);

      await onEventUpdate(event.id, updateData);
      toast.success("Event updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("There was a problem updating the event");
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Modify the event information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Client full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="9:00 - 17:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of People</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of people"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Venue</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {venues.map((venue) => (
                          <SelectItem key={venue} value={venue}>
                            {venue}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Budget amount"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Additional Services</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                <FormField
                  control={control}
                  name="services.catering"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="flex-1 min-w-0">
                        <FormLabel className="text-sm font-medium">
                          Catering
                        </FormLabel>
                        <div className="text-xs text-muted-foreground">
                          +30% of budget
                        </div>
                      </div>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="services.audiovisual"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="flex-1 min-w-0">
                        <FormLabel className="text-sm font-medium">
                          Audiovisual
                        </FormLabel>
                        <div className="text-xs text-muted-foreground">
                          +15% of budget
                        </div>
                      </div>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="services.decoration"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="flex-1 min-w-0">
                        <FormLabel className="text-sm font-medium">
                          Decoration
                        </FormLabel>
                        <div className="text-xs text-muted-foreground">
                          +10% of budget
                        </div>
                      </div>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="services.accommodation"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="flex-1 min-w-0">
                        <FormLabel className="text-sm font-medium">
                          Accommodation
                        </FormLabel>
                        <div className="text-xs text-muted-foreground">
                          +25% of budget
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
