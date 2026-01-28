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

const venueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  capacity: z.number().min(1, "Capacity must be greater than 0"),
  area: z.number().min(1, "Area must be greater than 0"),
  hourlyRate: z.number().min(1, "Hourly rate must be greater than 0"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  available: z.boolean(),
});

type VenueFormData = z.infer<typeof venueSchema>;

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
          <DialogTitle>{isEdit ? "Edit Venue" : "Add Venue"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modify the event venue data"
              : "Complete the data to create a new event venue"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Venue Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="E.g: Main Hall"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (people)</Label>
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
              <Label htmlFor="area">Area (m²)</Label>
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
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...form.register("location")}
                placeholder="Floor 2, East Wing"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Venue description..."
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
              Available for reservations
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Venue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
