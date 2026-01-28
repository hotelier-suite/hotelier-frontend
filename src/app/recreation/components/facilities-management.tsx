"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { recreationalService } from "@/lib/features/recreational/service";
import type {
  RecreationalFacility,
  FacilityType,
  FacilityStatus,
} from "@/lib/features/recreational/types";
import { FacilityDialog } from "./facility-dialog";
import { FacilityDetailsDialog } from "./facility-details-dialog";
import { toast } from "sonner";

interface FacilitiesManagementProps {
  facilities: RecreationalFacility[];
  onFacilitiesChange: (facilities: RecreationalFacility[]) => void;
}

export function FacilitiesManagement({
  facilities,
  onFacilitiesChange,
}: FacilitiesManagementProps) {
  const [editingFacility, setEditingFacility] =
    useState<RecreationalFacility | null>(null);
  const [viewingFacility, setViewingFacility] =
    useState<RecreationalFacility | null>(null);
  const [showFacilityDialog, setShowFacilityDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (facility: RecreationalFacility) => {
    setEditingFacility(facility);
    setShowFacilityDialog(true);
  };

  const handleView = (facility: RecreationalFacility) => {
    setViewingFacility(facility);
  };

  const handleDelete = async (facility: RecreationalFacility) => {
    if (
      !confirm(
        `Are you sure you want to delete the facility "${facility.name}"?`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(Number(facility.id));
      await recreationalService.deleteFacility(Number(facility.id));
      onFacilitiesChange(facilities.filter((f) => f.id !== facility.id));
      toast.success("Facility deleted successfully");
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Error deleting facility");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusToggle = async (facility: RecreationalFacility) => {
    try {
      const newStatus: FacilityStatus = facility.available
        ? "OUT_OF_ORDER"
        : "AVAILABLE";
      const updatedFacility = await recreationalService.updateFacility(
        Number(facility.id),
        {
          status: newStatus,
          available: !facility.available,
        },
      );

      onFacilitiesChange(
        facilities.map((f) => (f.id === facility.id ? updatedFacility : f)),
      );

      toast.success(
        `Facility ${updatedFacility.available ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Error updating facility status:", error);
      toast.error("Error updating facility status");
    }
  };

  const getFacilityTypeLabel = (type: FacilityType) => {
    const typeLabels: Record<FacilityType, string> = {
      SWIMMING_POOL: "Swimming Pool",
      GYM: "Gym",
      TENNIS_COURT: "Tennis Court",
      SPA: "Spa",
      SAUNA: "Sauna",
      JACUZZI: "Jacuzzi",
      GAME_ROOM: "Game Room",
      YOGA_STUDIO: "Yoga Studio",
      KIDS_PLAY_AREA: "Kids Play Area",
      BUSINESS_CENTER: "Business Center",
      OTHER: "Other",
    };
    return typeLabels[type] || type;
  };

  const getStatusBadge = (status: FacilityStatus, available: boolean) => {
    if (!available || status === "OUT_OF_ORDER") {
      return <Badge variant="destructive">Out of Service</Badge>;
    }

    switch (status) {
      case "AVAILABLE":
        return (
          <Badge variant="default" className="bg-green-500">
            Available
          </Badge>
        );
      case "OCCUPIED":
        return (
          <Badge variant="secondary" className="bg-blue-500">
            Occupied
          </Badge>
        );
      case "MAINTENANCE":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Maintenance
          </Badge>
        );
      case "RESERVED":
        return (
          <Badge variant="secondary" className="bg-purple-500">
            Reserved
          </Badge>
        );
      case "CLEANING":
        return (
          <Badge variant="secondary" className="bg-orange-500">
            Housekeeping
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Facilities Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage all recreational facilities in the hotel
            </p>
          </div>
        </div>

        {facilities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No facilities</CardTitle>
              <CardDescription className="text-center mb-4">
                No recreational facilities have been registered yet. Create the
                first facility to get started.
              </CardDescription>
              <Button onClick={() => setShowFacilityDialog(true)}>
                Create First Facility
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Recreational Facilities ({facilities.length})
              </CardTitle>
              <CardDescription>
                List of all available facilities in the hotel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilities.map((facility) => (
                      <TableRow key={facility.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{facility.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {facility.openingTime} - {facility.closingTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getFacilityTypeLabel(facility.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {facility.location}
                        </TableCell>
                        <TableCell>{facility.capacity} people</TableCell>
                        <TableCell>
                          {getStatusBadge(facility.status, facility.available)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                disabled={deletingId === facility.id}
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleView(facility)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(facility)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(facility)}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                {facility.available ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(facility)}
                                disabled={deletingId === facility.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deletingId === facility.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <FacilityDialog
        open={showFacilityDialog}
        onOpenChange={(open) => {
          setShowFacilityDialog(open);
          if (!open) {
            setEditingFacility(null);
          }
        }}
        facility={editingFacility}
        onFacilityCreated={(facility) => {
          if (editingFacility) {
            onFacilitiesChange(
              facilities.map((f) => (f.id === facility.id ? facility : f)),
            );
          } else {
            onFacilitiesChange([...facilities, facility]);
          }
          setShowFacilityDialog(false);
          setEditingFacility(null);
        }}
      />

      {/* View Details Dialog */}
      <FacilityDetailsDialog
        facility={viewingFacility}
        open={!!viewingFacility}
        onOpenChange={(open) => {
          if (!open) {
            setViewingFacility(null);
          }
        }}
      />
    </>
  );
}
