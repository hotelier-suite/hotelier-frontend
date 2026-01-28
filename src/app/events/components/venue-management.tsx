"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { venuesApi, Venue as ApiVenue } from "@/lib/api/venues";
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

// Venue schema
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
        toast.success("Venue updated successfully");
      } catch (error) {
        console.error("Error updating venue:", error);
        toast.error("Error updating venue. Please try again.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingVenue(null);
    setEditFormData({});
  };

  const handleAddVenue = async (data: VenueFormData) => {
    try {
      const createdVenue = await venuesApi.create(data);
      onVenueAdd(createdVenue);
      newVenueForm.reset();
      toast.success("Venue created successfully");
    } catch (error) {
      console.error("Error creating venue:", error);
      toast.error("Error creating venue. Please try again.");
    }
  };

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800">Available</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Occupied</Badge>
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
            <DialogTitle>Edit Venue</DialogTitle>
            <DialogDescription>
              Modify the event venue details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-venue-name">Venue Name</Label>
              <Input
                id="edit-venue-name"
                value={editFormData.name || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                placeholder="Venue name"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
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
                <Label htmlFor="edit-area">Area (m²)</Label>
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
                <Label htmlFor="edit-hourly-rate">Hourly Rate</Label>
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
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editFormData.location || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: e.target.value,
                    })
                  }
                  placeholder="Floor 1"
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
                <Label htmlFor="edit-available">Venue available</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Venue description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Event Venues</CardTitle>
            <CardDescription>Manage event spaces</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-4 w-4" />
                New Venue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Venue</DialogTitle>
                <DialogDescription>
                  Register a new event venue
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={newVenueForm.handleSubmit(handleAddVenue)}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="venueName">Venue Name</Label>
                    <Input
                      id="venueName"
                      {...newVenueForm.register("name")}
                      placeholder="Venue name"
                    />
                    {newVenueForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {newVenueForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueCapacity">Capacity</Label>
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
                      <Label htmlFor="venueArea">Area (m²)</Label>
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
                      <Label htmlFor="venueHourlyRate">Hourly Rate</Label>
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
                      <Label htmlFor="venueLocation">Location</Label>
                      <Input
                        id="venueLocation"
                        {...newVenueForm.register("location")}
                        placeholder="Floor 1"
                      />
                      {newVenueForm.formState.errors.location && (
                        <p className="text-sm text-red-500">
                          {newVenueForm.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueDescription">Description</Label>
                    <Textarea
                      id="venueDescription"
                      {...newVenueForm.register("description")}
                      placeholder="Venue description..."
                    />
                    {newVenueForm.formState.errors.description && (
                      <p className="text-sm text-red-500">
                        {newVenueForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit">Create Venue</Button>
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
                  <TableHead>Venue</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Hourly Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
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
                    <TableCell>{venue.capacity} people</TableCell>
                    <TableCell>{venue.area} m²</TableCell>
                    <TableCell>{venue.location}</TableCell>
                    <TableCell>${venue.hourlyRate.toLocaleString()}</TableCell>
                    <TableCell>
                      {getAvailabilityBadge(venue.available)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVenue(venue)}
                      >
                        Edit
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
