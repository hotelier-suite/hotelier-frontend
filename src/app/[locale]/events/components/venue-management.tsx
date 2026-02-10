"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { type Venue as ApiVenue } from "@/lib/features/venues/types";
import { venuesService } from "@/lib/features/venues/service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";

// Venue schema
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

// Use the API Venue type
type Venue = ApiVenue;

interface VenueManagementProps {
  venues: ApiVenue[];
  onVenueAdd: (venue: ApiVenue) => void;
  onVenueUpdate?: (id: number, updates: Partial<ApiVenue>) => void;
}

export default function VenueManagement({
  venues,
  onVenueAdd,
  onVenueUpdate,
}: VenueManagementProps) {
  const t = useTranslations("VenueManagement");
  const venueSchema = createVenueSchema(t);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Venue>>({});

  const editForm = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      area: 0,
      hourlyRate: 0,
      location: "",
      description: "",
      available: true,
    },
  });

  const newVenueForm = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      area: 0,
      hourlyRate: 0,
      location: "",
      description: "",
      available: true,
    },
  });
  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue);
    setEditFormData({
      name: venue.name,
      capacity: venue.capacity,
      area: venue.area,
      hourlyRate: venue.hourlyRate,
      location: venue.location,
      description: venue.description,
      available: venue.available,
    });
  };

  const handleSaveEdit = async () => {
    if (editingVenue && onVenueUpdate) {
      try {
        const venueId =
          typeof editingVenue.id === "string"
            ? parseInt(editingVenue.id)
            : editingVenue.id;
        await onVenueUpdate(venueId, editFormData);
        setEditingVenue(null);
        editForm.reset();
        toast.success(t("venueUpdatedSuccess"));
      } catch (error) {
        console.error("Error updating venue:", error);
        toast.error(t("venueUpdatedError"));
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingVenue(null);
    setEditFormData({});
  };

  const handleAddVenue = async (data: VenueFormData) => {
    try {
      const createdVenue = await venuesService.create(data);
      onVenueAdd(createdVenue);
      newVenueForm.reset();
      toast.success(t("venueCreatedSuccess"));
    } catch (error) {
      console.error("Error creating venue:", error);
      toast.error(t("venueCreatedError"));
    }
  };

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800">{t("available")}</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">{t("occupied")}</Badge>
    );
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      {/* Edit Venue Dialog */}
      <Dialog
        open={!!editingVenue}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("editVenueTitle")}</DialogTitle>
            <DialogDescription>{t("editVenueDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-venue-name">{t("venueName")}</Label>
              <Input
                id="edit-venue-name"
                value={editFormData.name || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                placeholder={t("venueNamePlaceholder")}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">{t("capacity")}</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={editFormData.capacity || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      capacity: Number(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-area">{t("area")}</Label>
                <Input
                  id="edit-area"
                  type="number"
                  value={editFormData.area || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      area: Number(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hourly-rate">{t("hourlyRate")}</Label>
                <Input
                  id="edit-hourly-rate"
                  type="number"
                  value={editFormData.hourlyRate || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      hourlyRate: Number(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">{t("location")}</Label>
                <Input
                  id="edit-location"
                  value={editFormData.location || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: e.target.value,
                    })
                  }
                  placeholder={t("locationPlaceholder")}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="edit-available"
                  checked={editFormData.available ?? false}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      available: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-available">{t("venueAvailable")}</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t("description")}</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                placeholder={t("descriptionPlaceholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveEdit}>{t("saveChanges")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{t("eventVenuesTitle")}</CardTitle>
            <CardDescription>{t("eventVenuesDescription")}</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-4 w-4" />
                {t("newVenue")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("newVenueTitle")}</DialogTitle>
                <DialogDescription>
                  {t("newVenueDescription")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={newVenueForm.handleSubmit(handleAddVenue)}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="venueName">{t("venueName")}</Label>
                    <Input
                      id="venueName"
                      {...newVenueForm.register("name")}
                      placeholder={t("venueNamePlaceholder")}
                    />
                    {newVenueForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {newVenueForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueCapacity">{t("capacity")}</Label>
                      <Input
                        id="venueCapacity"
                        type="number"
                        {...newVenueForm.register("capacity", {
                          valueAsNumber: true,
                        })}
                        placeholder="0"
                      />
                      {newVenueForm.formState.errors.capacity && (
                        <p className="text-sm text-red-500">
                          {newVenueForm.formState.errors.capacity.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venueArea">{t("area")}</Label>
                      <Input
                        id="venueArea"
                        type="number"
                        {...newVenueForm.register("area", {
                          valueAsNumber: true,
                        })}
                        placeholder="0"
                      />
                      {newVenueForm.formState.errors.area && (
                        <p className="text-sm text-red-500">
                          {newVenueForm.formState.errors.area.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venueHourlyRate">{t("hourlyRate")}</Label>
                      <Input
                        id="venueHourlyRate"
                        type="number"
                        {...newVenueForm.register("hourlyRate", {
                          valueAsNumber: true,
                        })}
                        placeholder="0"
                      />
                      {newVenueForm.formState.errors.hourlyRate && (
                        <p className="text-sm text-red-500">
                          {newVenueForm.formState.errors.hourlyRate.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueLocation">{t("location")}</Label>
                      <Input
                        id="venueLocation"
                        {...newVenueForm.register("location")}
                        placeholder={t("locationPlaceholder")}
                      />
                      {newVenueForm.formState.errors.location && (
                        <p className="text-sm text-red-500">
                          {newVenueForm.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueDescription">{t("description")}</Label>
                    <Textarea
                      id="venueDescription"
                      {...newVenueForm.register("description")}
                      placeholder={t("descriptionPlaceholder")}
                    />
                    {newVenueForm.formState.errors.description && (
                      <p className="text-sm text-red-500">
                        {newVenueForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline">
                      {t("cancel")}
                    </Button>
                    <Button type="submit">{t("createVenue")}</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("venueHead")}</TableHead>
                  <TableHead>{t("capacityHead")}</TableHead>
                  <TableHead>{t("areaHead")}</TableHead>
                  <TableHead>{t("locationHead")}</TableHead>
                  <TableHead>{t("hourlyRateHead")}</TableHead>
                  <TableHead>{t("statusHead")}</TableHead>
                  <TableHead>{t("actionsHead")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{venue.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {venue.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {venue.capacity} {t("peopleSuffix")}
                    </TableCell>
                    <TableCell>
                      {venue.area} {t("areaUnit")}
                    </TableCell>
                    <TableCell>{venue.location}</TableCell>
                    <TableCell>
                      {formatCurrency(venue.hourlyRate)}/{t("perHour")}
                    </TableCell>
                    <TableCell>
                      {getAvailabilityBadge(venue.available)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVenue(venue)}
                      >
                        {t("edit")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
