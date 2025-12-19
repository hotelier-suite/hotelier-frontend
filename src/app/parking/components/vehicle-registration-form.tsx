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

const vehicleSchema = z.object({
  licensePlate: z
    .string({ message: "License plate is required" })
    .min(1, "License plate is required")
    .max(20, "License plate must be at most 20 characters")
    .regex(
      /^[A-Z0-9-]+$/i,
      "License plate can only contain letters, numbers, and hyphens",
    ),
  brand: z
    .string({ message: "Brand is required" })
    .min(1, "Brand is required")
    .max(50, "Brand must be at most 50 characters"),
  model: z
    .string({ message: "Model is required" })
    .min(1, "Model is required")
    .max(50, "Model must be at most 50 characters"),
  color: z
    .string({ message: "Color is required" })
    .min(1, "Color is required")
    .max(30, "Color must be at most 30 characters"),
  type: z
    .string({ message: "Vehicle type is required" })
    .min(1, "Please select a vehicle type"),
  guestId: z
    .string({ message: "Owner is required" })
    .min(1, "Please select an owner"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

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
  const { guests, loading, error } = useActiveGuests();

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
        <Button variant="default">Register New Vehicle</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Vehicle</DialogTitle>
          <DialogDescription>
            Enter the vehicle information to register it in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="licensePlate" className="text-right">
                License Plate *
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
                Brand *
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
                Model *
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
                Color *
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
                Type *
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
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Truck">Truck</SelectItem>
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
                Owner *
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
                            loading
                              ? "Loading guests..."
                              : "Select a guest"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Loading...</span>
                          </div>
                        ) : error ? (
                          <div className="p-2 text-red-500">
                            Error loading guests
                          </div>
                        ) : guests.length === 0 ? (
                          <div className="p-2">No active guests</div>
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
                                    ? `- Room ${guest.roomNumber}`
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
              Cancel
            </Button>
            <Button type="submit">Register</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
