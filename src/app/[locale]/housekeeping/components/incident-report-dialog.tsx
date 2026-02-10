"use client";

import { useTranslations } from "next-intl";
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
function createIncidentReportSchema(t: (key: string) => string) {
  return z.object({
    room: z
      .string()
      .min(1, t("validationRoomRequired"))
      .refine((value) => value !== "loading" && value !== "no-rooms", {
        message: t("validationRoomValid"),
      }),
    type: z.string().min(1, t("validationTypeRequired")),
    priority: z.string().min(1, t("validationPriorityRequired")),
    description: z
      .string()
      .min(10, t("validationDescriptionMinLength"))
      .max(500, t("validationDescriptionMaxLength")),
  });
}

type IncidentReportFormData = z.infer<
  ReturnType<typeof createIncidentReportSchema>
>;

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
  const t = useTranslations("IncidentReportDialog");
  const incidentReportSchema = createIncidentReportSchema(t);
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
        reportedBy: t("housekeepingStaff"),
      });

      // Call parent callback for UI updates
      onReportIncident(data);

      // Show success toast
      toast.success(t("incidentReportedSuccess"), {
        description: t("roomMarkedForMaintenance", { room: data.room }),
      });

      // Reset form
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating incident report:", error);
      toast.error(t("errorReportingIncident"), {
        description: t("pleaseTryAgain"),
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
          {t("maintenanceRequest")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("maintenanceRequest")}</DialogTitle>
          <DialogDescription>{t("createNewReport")}</DialogDescription>
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
                    <FormLabel>{t("room")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectRoom")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading" disabled>
                            {t("loadingRooms")}
                          </SelectItem>
                        ) : rooms.length === 0 ? (
                          <SelectItem value="no-rooms" disabled>
                            {t("noRoomsAvailable")}
                          </SelectItem>
                        ) : (
                          rooms.map((room) => (
                            <SelectItem key={room.number} value={room.number}>
                              {t("roomLabel")} {room.number} -{" "}
                              {t(`roomTypes.${room.type}`)}
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
                    <FormLabel>{t("incidentType")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Plumbing">
                          {t("typePlumbing")}
                        </SelectItem>
                        <SelectItem value="Electrical">
                          {t("typeElectrical")}
                        </SelectItem>
                        <SelectItem value="Air Conditioning">
                          {t("typeAirConditioning")}
                        </SelectItem>
                        <SelectItem value="Furniture">
                          {t("typeFurniture")}
                        </SelectItem>
                        <SelectItem value="Appliances">
                          {t("typeAppliances")}
                        </SelectItem>
                        <SelectItem value="Structural">
                          {t("typeStructural")}
                        </SelectItem>
                        <SelectItem value="Aesthetic">
                          {t("typeAesthetic")}
                        </SelectItem>
                        <SelectItem value="General">
                          {t("typeGeneral")}
                        </SelectItem>
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
                  <FormLabel>{t("priority")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectPriority")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">{t("priorityHigh")}</SelectItem>
                      <SelectItem value="medium">
                        {t("priorityMedium")}
                      </SelectItem>
                      <SelectItem value="low">{t("priorityLow")}</SelectItem>
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
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
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
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? t("creating") : t("createReport")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
