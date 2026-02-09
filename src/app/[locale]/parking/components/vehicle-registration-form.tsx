"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useActiveGuests } from "@/hooks/use-active-guests";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

function createVehicleFormSchema(t: (key: string) => string) {
  return z.object({
    licensePlate: z
      .string({ message: t("validationLicensePlateRequired") })
      .min(1, t("validationLicensePlateRequired"))
      .max(20, t("validationLicensePlateMax"))
      .regex(/^[A-Z0-9-]+$/i, t("validationLicensePlateFormat")),
    brand: z
      .string({ message: t("validationBrandRequired") })
      .min(1, t("validationBrandRequired"))
      .max(50, t("validationBrandMax")),
    model: z
      .string({ message: t("validationModelRequired") })
      .min(1, t("validationModelRequired"))
      .max(50, t("validationModelMax")),
    color: z
      .string({ message: t("validationColorRequired") })
      .min(1, t("validationColorRequired"))
      .max(30, t("validationColorMax")),
    type: z
      .string({ message: t("validationVehicleTypeRequired") })
      .min(1, t("validationSelectVehicleType")),
    guestId: z
      .string({ message: t("validationOwnerRequired") })
      .min(1, t("validationSelectOwner")),
  });
}

type VehicleFormData = z.infer<ReturnType<typeof createVehicleFormSchema>>;

interface VehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  type: string;
  guestId: string;
}

interface VehicleRegistrationFormProps {
  onRegister?: (vehicleData: VehicleData) => void;
}

export function VehicleRegistrationForm({
  onRegister,
}: VehicleRegistrationFormProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("VehicleRegistrationForm");
  const { guests, loading, error } = useActiveGuests();

  const vehicleSchema = createVehicleFormSchema(t);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      licensePlate: "",
      brand: "",
      model: "",
      color: "",
      type: "",
      guestId: "",
    },
  });

  const handleFormSubmit = (data: VehicleFormData) => {
    if (onRegister) {
      onRegister(data);
    }
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">{t("registerNewVehicle")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="licensePlate" className="text-right">
                {t("licensePlate")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="licensePlate"
                  {...form.register("licensePlate")}
                  className={
                    form.formState.errors.licensePlate ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.licensePlate && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.licensePlate.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                {t("brand")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="brand"
                  {...form.register("brand")}
                  className={
                    form.formState.errors.brand ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.brand && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.brand.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                {t("model")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="model"
                  {...form.register("model")}
                  className={
                    form.formState.errors.model ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.model && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.model.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                {t("color")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="color"
                  {...form.register("color")}
                  className={
                    form.formState.errors.color ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.color && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.color.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                {t("type")}
              </Label>
              <div className="col-span-3">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          form.formState.errors.type ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder={t("selectVehicleType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">{t("vehicleCar")}</SelectItem>
                        <SelectItem value="Motorcycle">
                          {t("vehicleMotorcycle")}
                        </SelectItem>
                        <SelectItem value="Van">{t("vehicleVan")}</SelectItem>
                        <SelectItem value="Truck">
                          {t("vehicleTruck")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.type && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guestId" className="text-right">
                {t("owner")}
              </Label>
              <div className="col-span-3">
                <Controller
                  name="guestId"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger
                        className={
                          form.formState.errors.guestId ? "border-red-500" : ""
                        }
                      >
                        <SelectValue
                          placeholder={
                            loading ? t("loadingGuests") : t("selectGuest")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">{t("loading")}</span>
                          </div>
                        ) : error ? (
                          <div className="p-2 text-red-500">
                            {t("errorLoadingGuests")}
                          </div>
                        ) : guests.length === 0 ? (
                          <div className="p-2">{t("noActiveGuests")}</div>
                        ) : (
                          guests.map((guest) => (
                            <SelectItem
                              key={guest.id}
                              value={guest.id.toString()}
                            >
                              <div>
                                <div>{guest.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {guest.email}{" "}
                                  {guest.roomNumber
                                    ? `- ${t("room")} ${guest.roomNumber}`
                                    : ""}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.guestId && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.guestId.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setOpen(false);
              }}
            >
              {t("cancel")}
            </Button>
            <Button type="submit">{t("register")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
