"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  recreationalApi,
  type RecreationalFacility,
  type FacilityType,
  type CreateRecreationalFacilityData,
} from "@/lib/api/recreational";
import { toast } from "sonner";

const facilitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  area: z.number().optional(),
  openingTime: z.string().min(1, "Opening time is required"),
  closingTime: z.string().min(1, "Closing time is required"),
  minimumBookingHours: z.number().min(1, "Minimum 1 hour"),
  maximumBookingHours: z.number().min(1, "Maximum must be at least 1 hour"),
  advanceBookingHours: z.number().min(0, "Must be a positive number"),
  isAvailable: z.boolean(),
  amenities: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  availableDays: z.array(z.number()).optional(),
  maintenanceNotes: z.string().optional(),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

interface FacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: RecreationalFacility | null;
  onFacilityCreated: (facility: RecreationalFacility) => void;
}

const facilityTypes: Array<{ value: FacilityType; label: string }> = [
  { value: "SWIMMING_POOL", label: "Swimming Pool" },
  { value: "GYM", label: "Gym" },
  { value: "TENNIS_COURT", label: "Tennis Court" },
  { value: "SPA", label: "Spa" },
  { value: "SAUNA", label: "Sauna" },
  { value: "JACUZZI", label: "Jacuzzi" },
  { value: "GAME_ROOM", label: "Game Room" },
  { value: "YOGA_STUDIO", label: "Yoga Studio" },
  { value: "KIDS_PLAY_AREA", label: "Kids Play Area" },
  { value: "BUSINESS_CENTER", label: "Business Center" },
  { value: "OTHER", label: "Other" },
];

const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function FacilityDialog({
  open,
  onOpenChange,
  facility,
  onFacilityCreated,
}: FacilityDialogProps) {
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [newRule, setNewRule] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 0,
  ]); // All days by default

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: "",
      type: "" as FacilityType,
      location: "",
      description: "",
      capacity: 10,
      area: 0,

      openingTime: "08:00",
      closingTime: "22:00",
      minimumBookingHours: 1,
      maximumBookingHours: 4,
      advanceBookingHours: 1,
      isAvailable: true,
      amenities: [],
      rules: [],
      availableDays: [1, 2, 3, 4, 5, 6, 0],
      maintenanceNotes: "",
    },
  });

  // Initialize form when facility changes
  useEffect(() => {
    if (facility) {
      form.reset({
        name: facility.name,
        type: facility.type,
        location: facility.location,
        description: facility.description || "",
        capacity: facility.capacity,
        area: facility.area || 0,
        openingTime: facility.openingTime,
        closingTime: facility.closingTime,
        minimumBookingHours: facility.minimumBookingHours,
        maximumBookingHours: facility.maximumBookingHours,
        advanceBookingHours: facility.advanceBookingHours,
        isAvailable: facility.isAvailable,
        maintenanceNotes: facility.maintenanceNotes || "",
      });
      setAmenities(facility.amenities || []);
      setRules(facility.rules || []);
      setAvailableDays(facility.availableDays || [1, 2, 3, 4, 5, 6, 0]);
    } else {
      form.reset();
      setAmenities([]);
      setRules([]);
      setAvailableDays([1, 2, 3, 4, 5, 6, 0]);
    }
  }, [facility, form]);

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleDayToggle = (day: number) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const onSubmit = async (values: FacilityFormValues) => {
    try {
      setLoading(true);

      const facilityData: CreateRecreationalFacilityData = {
        ...values,
        type: values.type as FacilityType,
        status: values.isAvailable ? "AVAILABLE" : "OUT_OF_ORDER",
        amenities: amenities.length > 0 ? amenities : undefined,
        rules: rules.length > 0 ? rules : undefined,
        availableDays: availableDays.length > 0 ? availableDays : undefined,
        area: values.area || undefined,
        description: values.description || undefined,
        maintenanceNotes: values.maintenanceNotes || undefined,
      };

      let result: RecreationalFacility;

      if (facility) {
        result = await recreationalApi.updateFacility(
          Number(facility.id),
          facilityData,
        );
        toast.success("Facility updated successfully");
      } else {
        result = await recreationalApi.createFacility(facilityData);
        toast.success("Facility created successfully");
      }

      onFacilityCreated(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving facility:", error);
      toast.error(
        facility
          ? "Error updating facility"
          : "Error creating facility",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {facility ? "Edit Facility" : "New Facility"}
          </DialogTitle>
          <DialogDescription>
            {facility
              ? "Modify the recreational facility details"
              : "Create a new recreational facility for the hotel"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Olympic Swimming Pool" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Wellness Center - Ground Floor"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Detailed description of the facility..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (people) *</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="openingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Time *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Time *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Booking Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="minimumBookingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min. Booking Hours *</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maximumBookingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max. Booking Hours *</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="advanceBookingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Hours *</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Minimum hours in advance to book
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Available Days */}
            <div>
              <FormLabel>Available Days</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {daysOfWeek.map((day) => (
                  <Badge
                    key={day.value}
                    variant={
                      availableDays.includes(day.value) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleDayToggle(day.value)}
                  >
                    {day.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <FormLabel>Amenities</FormLabel>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add amenity..."
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddAmenity())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddAmenity}
                  >
                    Add
                  </Button>
                </div>
                {amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {amenity}
                        <X
                          className="ml-2 h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveAmenity(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Rules */}
            <div>
              <FormLabel>Rules</FormLabel>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add rule..."
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddRule())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddRule}
                  >
                    Add
                  </Button>
                </div>
                {rules.length > 0 && (
                  <div className="space-y-1">
                    {rules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                      >
                        <span>{rule}</span>
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveRule(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="maintenanceNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes about maintenance, cleaning, etc..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active Facility
                    </FormLabel>
                    <FormDescription>
                      Allow bookings for this facility
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? facility
                    ? "Updating..."
                    : "Creating..."
                  : facility
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
