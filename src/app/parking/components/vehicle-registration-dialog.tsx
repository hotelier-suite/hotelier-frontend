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
import { ParkingSpace } from "@/lib/api/parking";

const vehicleSchema = z.object({
  licensePlate: z.string().min(3, "License plate must have at least 3 characters"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  color: z.string().min(1, "Color is required"),
  type: z.string().min(1, "Vehicle type is required"),
  owner: z.string().min(2, "Owner name is required"),
  room: z.string().optional(),
  guestType: z.string().min(1, "Guest type is required"),
  assignedSpace: z.string().min(1, "You must assign a space"),
  notes: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

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
  const [isOpen, setIsOpen] = useState(false);

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
          Register Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register Vehicle</DialogTitle>
          <DialogDescription>
            Register entry of a new vehicle
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={vehicleForm.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  {...vehicleForm.register("licensePlate")}
                  placeholder="ABC123"
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
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...vehicleForm.register("brand")}
                  placeholder="Toyota"
                />
                {vehicleForm.formState.errors.brand && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.brand.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  {...vehicleForm.register("model")}
                  placeholder="Corolla"
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
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  {...vehicleForm.register("color")}
                  placeholder="White"
                />
                {vehicleForm.formState.errors.color && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.color.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Controller
                  name="type"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="Truck">Truck</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
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
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  {...vehicleForm.register("owner")}
                  placeholder="Owner name"
                />
                {vehicleForm.formState.errors.owner && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.owner.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestType">Type</Label>
                <Controller
                  name="guestType"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">Guest</SelectItem>
                        <SelectItem value="visitor">Visitor</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
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
                <Label htmlFor="room">Room (Optional)</Label>
                <Input
                  id="room"
                  {...vehicleForm.register("room")}
                  placeholder="205"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedSpace">Assigned Space</Label>
                <Controller
                  name="assignedSpace"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select space" />
                      </SelectTrigger>
                      <SelectContent>
                        {spaces
                          .filter((e) => e.status === "available")
                          .map((space) => (
                            <SelectItem key={space.id} value={space.code}>
                              {space.code} - {space.zone} ({space.type})
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...vehicleForm.register("notes")}
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Register Vehicle</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
