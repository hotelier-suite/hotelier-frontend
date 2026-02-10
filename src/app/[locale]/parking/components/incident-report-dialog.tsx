"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import type { Vehicle, ParkingSpace } from "@/lib/features/parking/types";
import { useTranslations } from "next-intl";

// Zod schema factory for validation
function createIncidentFormSchema(t: (key: string) => string) {
  return z.object({
    type: z.string().min(1, t("validationTypeRequired")),
    description: z.string().min(1, t("validationDescriptionRequired")),
    vehicle: z.string().optional(),
    space: z.string().optional(),
    priority: z.string().min(1, t("validationPriorityRequired")),
  });
}

type IncidentFormValues = z.infer<ReturnType<typeof createIncidentFormSchema>>;

interface ParkingIncidentReportDialogProps {
  vehicles: Vehicle[];
  spaces: ParkingSpace[];
  onIncidentAdd: (incident: {
    type: string;
    description: string;
    vehicle: string;
    space: string;
    priority: string;
  }) => void;
}

export default function ParkingIncidentReportDialog({
  vehicles,
  spaces,
  onIncidentAdd,
}: ParkingIncidentReportDialogProps) {
  const t = useTranslations("ParkingIncidentReportDialog");
  const [isOpen, setIsOpen] = useState(false);

  const incidentFormSchema = createIncidentFormSchema(t);

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      type: "",
      description: "",
      vehicle: "",
      space: "",
      priority: "",
    },
  });

  const onSubmit = (data: IncidentFormValues) => {
    console.log("Form submitted with data:", data);

    try {
      onIncidentAdd({
        type: data.type,
        description: data.description,
        vehicle: data.vehicle || "",
        space: data.space || "",
        priority: data.priority,
      });

      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <AlertTriangle className="mr-2 h-4 w-4" />
          {t("reportIncident")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("incidentType")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vehicle Damage">
                          {t("vehicleDamage")}
                        </SelectItem>
                        <SelectItem value="Infrastructure">
                          {t("infrastructure")}
                        </SelectItem>
                        <SelectItem value="Security">
                          {t("security")}
                        </SelectItem>
                        <SelectItem value="Cleaning">
                          {t("cleaning")}
                        </SelectItem>
                        <SelectItem value="Other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectPriority")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">{t("high")}</SelectItem>
                        <SelectItem value="medium">{t("medium")}</SelectItem>
                        <SelectItem value="low">{t("low")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("vehicleOptional")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectVehicle")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles
                          .filter((v) => v.status === "parqueado")
                          .map((vehicle) => (
                            <SelectItem
                              key={vehicle.id}
                              value={vehicle.licensePlate}
                            >
                              {vehicle.licensePlate} - {vehicle.owner}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="space"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("spaceOptional")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectSpace")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {spaces.map((space) => (
                          <SelectItem key={space.id} value={space.code}>
                            {space.code} - {space.zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">{t("reportIncident")}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
