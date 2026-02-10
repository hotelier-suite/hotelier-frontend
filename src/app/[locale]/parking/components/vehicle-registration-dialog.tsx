"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { ParkingSpace } from "@/lib/features/parking/types";
import { useTranslations } from "next-intl";

function createVehicleSchema(t: (key: string) => string) {
  return z.object({
    licensePlate: z.string().min(3, t("validationLicensePlateMin")),
    brand: z.string().min(2, t("validationBrandRequired")),
    model: z.string().min(1, t("validationModelRequired")),
    color: z.string().min(1, t("validationColorRequired")),
    type: z.string().min(1, t("validationVehicleTypeRequired")),
    owner: z.string().min(2, t("validationOwnerRequired")),
    room: z.string().optional(),
    guestType: z.string().min(1, t("validationGuestTypeRequired")),
    assignedSpace: z.string().min(1, t("validationAssignedSpaceRequired")),
    notes: z.string().optional(),
  });
}

type VehicleFormData = z.infer<ReturnType<typeof createVehicleSchema>>;

interface VehicleRegistrationDialogProps {
  spaces: ParkingSpace[];
  onVehicleAdd: (vehicle: {
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
    type: string;
    owner: string;
    room?: string;
    guestType: string;
    assignedSpace: string;
    notes?: string;
  }) => void;
}

export default function VehicleRegistrationDialog({
  spaces,
  onVehicleAdd,
}: VehicleRegistrationDialogProps) {
  const t = useTranslations("VehicleRegistrationDialog");
  const [isOpen, setIsOpen] = useState(false);

  const vehicleSchema = createVehicleSchema(t);

  const vehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      licensePlate: "",
      brand: "",
      model: "",
      color: "",
      type: "",
      owner: "",
      room: "",
      guestType: "",
      assignedSpace: "",
      notes: "",
    },
  });

  const handleSubmit = (data: VehicleFormData) => {
    onVehicleAdd(data);
    vehicleForm.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("registerVehicle")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={vehicleForm.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">{t("licensePlate")}</Label>
                <Input
                  id="licensePlate"
                  {...vehicleForm.register("licensePlate")}
                  placeholder={t("placeholderLicensePlate")}
                  onChange={(e) => {
                    vehicleForm.setValue(
                      "licensePlate",
                      e.target.value.toUpperCase(),
                    );
                  }}
                />
                {vehicleForm.formState.errors.licensePlate && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.licensePlate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">{t("brand")}</Label>
                <Input
                  id="brand"
                  {...vehicleForm.register("brand")}
                  placeholder={t("placeholderBrand")}
                />
                {vehicleForm.formState.errors.brand && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.brand.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">{t("model")}</Label>
                <Input
                  id="model"
                  {...vehicleForm.register("model")}
                  placeholder={t("placeholderModel")}
                />
                {vehicleForm.formState.errors.model && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.model.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">{t("color")}</Label>
                <Input
                  id="color"
                  {...vehicleForm.register("color")}
                  placeholder={t("placeholderColor")}
                />
                {vehicleForm.formState.errors.color && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.color.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">{t("vehicleType")}</Label>
                <Controller
                  name="type"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">{t("vehicleCar")}</SelectItem>
                        <SelectItem value="SUV">{t("vehicleSUV")}</SelectItem>
                        <SelectItem value="Motorcycle">
                          {t("vehicleMotorcycle")}
                        </SelectItem>
                        <SelectItem value="Truck">
                          {t("vehicleTruck")}
                        </SelectItem>
                        <SelectItem value="Other">
                          {t("vehicleOther")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {vehicleForm.formState.errors.type && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.type.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">{t("owner")}</Label>
                <Input
                  id="owner"
                  {...vehicleForm.register("owner")}
                  placeholder={t("placeholderOwner")}
                />
                {vehicleForm.formState.errors.owner && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.owner.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestType">{t("guestType")}</Label>
                <Controller
                  name="guestType"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">
                          {t("guestTypeGuest")}
                        </SelectItem>
                        <SelectItem value="visitor">
                          {t("guestTypeVisitor")}
                        </SelectItem>
                        <SelectItem value="employee">
                          {t("guestTypeEmployee")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {vehicleForm.formState.errors.guestType && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.guestType.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">{t("roomOptional")}</Label>
                <Input
                  id="room"
                  {...vehicleForm.register("room")}
                  placeholder={t("placeholderRoom")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedSpace">{t("assignedSpace")}</Label>
                <Controller
                  name="assignedSpace"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectSpace")} />
                      </SelectTrigger>
                      <SelectContent>
                        {spaces
                          .filter((e) => e.status === "available")
                          .map((space) => (
                            <SelectItem key={space.id} value={space.code}>
                              {space.code} - {space.zone} (
                              {t(`spaceTypes.${space.type}`)})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {vehicleForm.formState.errors.assignedSpace && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.assignedSpace.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea
                id="notes"
                {...vehicleForm.register("notes")}
                placeholder={t("placeholderNotes")}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">{t("registerVehicle")}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
