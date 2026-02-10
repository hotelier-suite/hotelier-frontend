import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Venue } from "@/lib/features/venues/types";
import { useTranslations } from "next-intl";

function createVenueSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t("validationNameRequired")),
    capacity: z.number().min(1, t("validationCapacityPositive")),
    area: z.number().min(1, t("validationAreaPositive")),
    hourlyRate: z.number().min(1, t("validationHourlyRatePositive")),
    location: z.string().min(1, t("validationLocationRequired")),
    description: z.string().optional(),
    available: z.boolean(),
  });
}

type VenueFormData = z.infer<ReturnType<typeof createVenueSchema>>;

interface VenueFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue?: Venue | null;
  onSubmit: (data: VenueFormData) => Promise<void>;
  isEdit?: boolean;
}

export function VenueFormDialog({
  open,
  onOpenChange,
  venue,
  onSubmit,
  isEdit = false,
}: VenueFormDialogProps) {
  const t = useTranslations("VenueFormDialog");
  const venueSchema = createVenueSchema(t);
  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: venue
      ? {
          name: venue.name,
          capacity: venue.capacity,
          area: venue.area,
          hourlyRate: venue.hourlyRate,
          location: venue.location,
          description: venue.description,
          available: venue.available,
        }
      : {
          name: "",
          capacity: 0,
          area: 0,
          hourlyRate: 0,
          location: "",
          description: "",
          available: true,
        },
  });

  const handleSubmit = async (data: VenueFormData) => {
    await onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTitle") : t("addTitle")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("editDescription") : t("addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("venueName")}</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder={t("venueNamePlaceholder")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">{t("capacity")}</Label>
              <Input
                id="capacity"
                type="number"
                {...form.register("capacity", { valueAsNumber: true })}
                placeholder="100"
              />
              {form.formState.errors.capacity && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.capacity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">{t("area")}</Label>
              <Input
                id="area"
                type="number"
                {...form.register("area", { valueAsNumber: true })}
                placeholder="150"
              />
              {form.formState.errors.area && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.area.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">{t("hourlyRate")}</Label>
              <Input
                id="hourlyRate"
                type="number"
                {...form.register("hourlyRate", { valueAsNumber: true })}
                placeholder="500"
              />
              {form.formState.errors.hourlyRate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.hourlyRate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("locationLabel")}</Label>
              <Input
                id="location"
                {...form.register("location")}
                placeholder={t("locationPlaceholder")}
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("descriptionLabel")}</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={useWatch({ control: form.control, name: "available" })}
              onCheckedChange={(checked) =>
                form.setValue("available", checked as boolean)
              }
            />
            <Label htmlFor="available" className="cursor-pointer">
              {t("availableForReservations")}
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit">
              {isEdit ? t("saveChanges") : t("createVenue")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
