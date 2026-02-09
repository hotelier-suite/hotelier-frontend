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
import { recreationalService } from "@/lib/features/recreational/service";
import type {
  RecreationalFacility,
  FacilityType,
  CreateRecreationalFacilityData,
} from "@/lib/features/recreational/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function createFacilitySchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t("validationNameRequired")),
    type: z.string().min(1, t("validationTypeRequired")),
    location: z.string().min(1, t("validationLocationRequired")),
    description: z.string().optional(),
    capacity: z.number().min(1, t("validationCapacityMin")),
    area: z.number().optional(),
    openingTime: z.string().min(1, t("validationOpeningTimeRequired")),
    closingTime: z.string().min(1, t("validationClosingTimeRequired")),
    minimumBookingHours: z.number().min(1, t("validationMinBookingHours")),
    maximumBookingHours: z.number().min(1, t("validationMaxBookingHours")),
    advanceBookingHours: z.number().min(0, t("validationAdvanceHoursPositive")),
    available: z.boolean(),
    amenities: z.array(z.string()).optional(),
    rules: z.array(z.string()).optional(),
    availableDays: z.array(z.number()).optional(),
    maintenanceNotes: z.string().optional(),
  });
}

type FacilityFormValues = z.infer<ReturnType<typeof createFacilitySchema>>;

interface FacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: RecreationalFacility | null;
  onFacilityCreated: (facility: RecreationalFacility) => void;
}

const facilityTypes: Array<{ value: FacilityType; labelKey: string }> = [
  { value: "SWIMMING_POOL", labelKey: "typeSwimmingPool" },
  { value: "GYM", labelKey: "typeGym" },
  { value: "TENNIS_COURT", labelKey: "typeTennisCourt" },
  { value: "SPA", labelKey: "typeSpa" },
  { value: "SAUNA", labelKey: "typeSauna" },
  { value: "JACUZZI", labelKey: "typeJacuzzi" },
  { value: "GAME_ROOM", labelKey: "typeGameRoom" },
  { value: "YOGA_STUDIO", labelKey: "typeYogaStudio" },
  { value: "KIDS_PLAY_AREA", labelKey: "typeKidsPlayArea" },
  { value: "BUSINESS_CENTER", labelKey: "typeBusinessCenter" },
  { value: "OTHER", labelKey: "typeOther" },
];

const daysOfWeek = [
  { value: 0, labelKey: "daySunday" },
  { value: 1, labelKey: "dayMonday" },
  { value: 2, labelKey: "dayTuesday" },
  { value: 3, labelKey: "dayWednesday" },
  { value: 4, labelKey: "dayThursday" },
  { value: 5, labelKey: "dayFriday" },
  { value: 6, labelKey: "daySaturday" },
];

export function FacilityDialog({
  open,
  onOpenChange,
  facility,
  onFacilityCreated,
}: FacilityDialogProps) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("FacilityDialog");
  const [newAmenity, setNewAmenity] = useState("");
  const [newRule, setNewRule] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 0,
  ]); // All days by default

  const facilitySchema = createFacilitySchema(t);

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
      available: true,
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
        available: facility.available,
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
        status: values.available ? "AVAILABLE" : "OUT_OF_ORDER",
        amenities: amenities.length > 0 ? amenities : undefined,
        rules: rules.length > 0 ? rules : undefined,
        availableDays: availableDays.length > 0 ? availableDays : undefined,
        area: values.area || undefined,
        description: values.description || undefined,
        maintenanceNotes: values.maintenanceNotes || undefined,
      };

      let result: RecreationalFacility;

      if (facility) {
        result = await recreationalService.updateFacility(
          Number(facility.id),
          facilityData,
        );
        toast.success(t("facilityUpdatedSuccess"));
      } else {
        result = await recreationalService.createFacility(facilityData);
        toast.success(t("facilityCreatedSuccess"));
      }

      onFacilityCreated(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving facility:", error);
      toast.error(facility ? t("errorUpdating") : t("errorCreating"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{facility ? t("editTitle") : t("newTitle")}</DialogTitle>
          <DialogDescription>
            {facility ? t("editDescription") : t("newDescription")}
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
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholderName")} {...field} />
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
                    <FormLabel>{t("type")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {t(type.labelKey)}
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
                  <FormLabel>{t("location")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholderLocation")} {...field} />
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
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[80px]" {...field} />
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
                    <FormLabel>{t("capacity")}</FormLabel>
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
                    <FormLabel>{t("area")}</FormLabel>
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
                    <FormLabel>{t("openingTime")}</FormLabel>
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
                    <FormLabel>{t("closingTime")}</FormLabel>
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
                    <FormLabel>{t("minBookingHours")}</FormLabel>
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
                    <FormLabel>{t("maxBookingHours")}</FormLabel>
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
                    <FormLabel>{t("advanceHours")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("advanceHoursDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Available Days */}
            <div>
              <FormLabel>{t("availableDays")}</FormLabel>
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
                    {t(day.labelKey)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <FormLabel>{t("amenities")}</FormLabel>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("addAmenityPlaceholder")}
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
                    {t("add")}
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
              <FormLabel>{t("rules")}</FormLabel>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("addRulePlaceholder")}
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
                    {t("add")}
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
                  <FormLabel>{t("maintenanceNotes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("placeholderMaintenanceNotes")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("activeFacility")}
                    </FormLabel>
                    <FormDescription>
                      {t("activeFacilityDescription")}
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
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? facility
                    ? t("updating")
                    : t("creating")
                  : facility
                    ? t("update")
                    : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
