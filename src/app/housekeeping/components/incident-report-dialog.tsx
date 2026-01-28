"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Room } from "@/lib/features/housekeeping/types";
import { housekeepingService } from "@/lib/features/housekeeping/service";

// Zod schema for form validation
const incidentReportSchema = z.object({
  room: z
    .string()
    .min(1, "You must select a room")
    .refine((value) => value !== "loading" && value !== "no-rooms", {
      message: "You must select a valid room",
    }),
  type: z.string().min(1, "You must select an incident type"),
  priority: z.string().min(1, "You must select a priority"),
  description: z
    .string()
    .min(10, "Description must have at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

type IncidentReportFormData = z.infer<typeof incidentReportSchema>;

interface IncidentReportDialogProps {
  onReportIncident: (incident: {
    room: string;
    type: string;
    priority: string;
    description: string;
  }) => void;
}

export default function IncidentReportDialog({
  onReportIncident,
}: IncidentReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<IncidentReportFormData>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: {
      room: "",
      type: "",
      priority: "",
      description: "",
    },
  });

  // Load rooms when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadRooms();
    }
  }, [isOpen]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const availableRooms =
        await housekeepingService.getRoomsForIncidentReports();
      setRooms(availableRooms);
    } catch (error) {
      console.error("Error loading rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: IncidentReportFormData) => {
    try {
      setLoading(true);

      // Create incident report through API
      await housekeepingService.createIncidentReport({
        roomNumber: data.room,
        type: data.type,
        priority: data.priority,
        description: data.description,
        reportedBy: "Housekeeping Staff",
      });

      // Call parent callback for UI updates
      onReportIncident(data);

      // Show success toast
      toast.success("Incident reported successfully", {
        description: `Room ${data.room} has been marked for maintenance`,
      });

      // Reset form
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating incident report:", error);
      toast.error("Error reporting the incident", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Wrench className="mr-2 h-4 w-4" />
          Maintenance Request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Maintenance Request</DialogTitle>
          <DialogDescription>Create a new maintenance report</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading" disabled>
                            Loading rooms...
                          </SelectItem>
                        ) : rooms.length === 0 ? (
                          <SelectItem value="no-rooms" disabled>
                            No rooms available
                          </SelectItem>
                        ) : (
                          rooms.map((room) => (
                            <SelectItem key={room.number} value={room.number}>
                              Room {room.number} - {room.type}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Air Conditioning">
                          Air Conditioning
                        </SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Appliances">Appliances</SelectItem>
                        <SelectItem value="Structural">Structural</SelectItem>
                        <SelectItem value="Aesthetic">Aesthetic</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the incident..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? "Creating..." : "Create Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
