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
import { useTranslations } from "next-intl";

// Edit Event Schema
function createEditEventSchema(t: (key: string) => string) {
  return z.object({
    title: z
      .string()
      .min(1, t("validationEventNameRequired"))
      .min(3, t("validationNameMinLength")),
    client: z.string().min(1, t("validationClientNameRequired")),
    date: z.string().min(1, t("validationDateRequired")),
    time: z.string().min(1, t("validationTimeRequired")),
    venue: z.string().min(1, t("validationVenueRequired")),
    capacity: z.string().min(1, t("validationCapacityRequired")),
    budget: z.string().min(1, t("validationBudgetRequired")),
    status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
      message: t("validationStatusRequired"),
    }),
    services: z.object({
      catering: z.boolean(),
      audiovisual: z.boolean(),
      decoration: z.boolean(),
      accommodation: z.boolean(),
    }),
  });
}

type EditEventFormData = z.infer<ReturnType<typeof createEditEventSchema>>;

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
  venues,
}: EditEventDialogProps) {
  const t = useTranslations("EditEventDialog");
  const defaultVenues = venues ?? [
    t("venueMainHall"),
    t("venueExecutiveRoom"),
    t("venueGardenPavilion"),
    t("venueConferenceRoomAlpha"),
  ];
  const editEventSchema = createEditEventSchema(t);
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
      toast.success(t("successMessage"));
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(t("errorMessage"));
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("eventName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("eventNamePlaceholder")}
                        {...field}
                      />
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
                    <FormLabel>{t("clientName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("clientNamePlaceholder")}
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
                    <FormLabel>{t("date")}</FormLabel>
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
                    <FormLabel>{t("time")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("timePlaceholder")} {...field} />
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
                    <FormLabel>{t("numberOfPeople")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("numberOfPeoplePlaceholder")}
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
                    <FormLabel>{t("eventVenue")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectVenue")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {defaultVenues.map((venue) => (
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
                    <FormLabel>{t("status")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">
                          {t("statusPending")}
                        </SelectItem>
                        <SelectItem value="confirmed">
                          {t("statusConfirmed")}
                        </SelectItem>
                        <SelectItem value="cancelled">
                          {t("statusCancelled")}
                        </SelectItem>
                        <SelectItem value="completed">
                          {t("statusCompleted")}
                        </SelectItem>
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
                  <FormLabel>{t("baseBudget")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("budgetPlaceholder")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>{t("additionalServices")}</Label>
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
                          {t("catering")}
                        </FormLabel>
                        <div className="text-xs text-muted-foreground">
                          {t("cateringCost")}
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
                          {t("audiovisual")}
                        </FormLabel>
                        <div className="text-xs text-muted-foreground">
                          {t("audiovisualCost")}
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
                          {t("decoration")}
                        </FormLabel>
                        <div className="text-xs text-muted-foreground">
                          {t("decorationCost")}
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
                          {t("accommodation")}
                        </FormLabel>
                        <div className="text-xs text-muted-foreground">
                          {t("accommodationCost")}
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
                {t("cancel")}
              </Button>
              <Button type="submit">{t("saveChanges")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
