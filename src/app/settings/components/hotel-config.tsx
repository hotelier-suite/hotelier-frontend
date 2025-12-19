"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hotel, Save, RefreshCw } from "lucide-react";

const hotelConfigSchema = z.object({
  propertyName: z.string().min(1, "Hotel name is required"),
  propertyEmail: z.string().email("Invalid email"),
  propertyPhone: z.string().min(1, "Phone is required"),
  propertyAddress: z.string().min(1, "Address is required"),
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),
  cancellationPolicy: z.string().optional().or(z.literal("")),
  timeZone: z.string().optional().or(z.literal("")),
});

type HotelConfigData = z.infer<typeof hotelConfigSchema>;

interface HotelConfigProps {
  initialData?: HotelConfigData;
  isLoading: boolean;
  onSave: (config: HotelConfigData) => void;
}

export function HotelConfig({
  initialData,
  isLoading,
  onSave,
}: HotelConfigProps) {
  const form = useForm<HotelConfigData>({
    resolver: zodResolver(hotelConfigSchema),
    defaultValues: {
      propertyName: initialData?.propertyName || "",
      propertyEmail: initialData?.propertyEmail || "",
      propertyPhone: initialData?.propertyPhone || "",
      propertyAddress: initialData?.propertyAddress || "",
      checkInTime: initialData?.checkInTime || "15:00",
      checkOutTime: initialData?.checkOutTime || "11:00",
      cancellationPolicy: initialData?.cancellationPolicy || "",
      timeZone: initialData?.timeZone || "",
    },
  });

  const onSubmit = (data: HotelConfigData) => {
    onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          Hotel Information
        </CardTitle>
        <CardDescription>
          Configure your hotel&apos;s basic information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyName">Hotel Name</Label>
              <Input
                id="propertyName"
                placeholder="Ex: Plaza Hotel"
                {...form.register("propertyName")}
              />
              {form.formState.errors.propertyName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.propertyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyEmail">Email</Label>
              <Input
                id="propertyEmail"
                type="email"
                placeholder="contacto@hotel.com"
                {...form.register("propertyEmail")}
              />
              {form.formState.errors.propertyEmail && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.propertyEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyPhone">Phone</Label>
              <Input
                id="propertyPhone"
                placeholder="+1 234 567 8900"
                {...form.register("propertyPhone")}
              />
              {form.formState.errors.propertyPhone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.propertyPhone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyAddress">Address</Label>
              <Input
                id="propertyAddress"
                placeholder="123 Main Street, City, Country"
                {...form.register("propertyAddress")}
              />
              {form.formState.errors.propertyAddress && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.propertyAddress.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInTime">Check-in</Label>
              <Input
                id="checkInTime"
                type="time"
                {...form.register("checkInTime")}
              />
              {form.formState.errors.checkInTime && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.checkInTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutTime">Check-out</Label>
              <Input
                id="checkOutTime"
                type="time"
                {...form.register("checkOutTime")}
              />
              {form.formState.errors.checkOutTime && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.checkOutTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
