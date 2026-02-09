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
import { useTranslations } from "next-intl";

interface FacilitiesManagementProps {
  facilities: RecreationalFacility[];
  onFacilitiesChange: (facilities: RecreationalFacility[]) => void;
}

export function FacilitiesManagement({
  facilities,
  onFacilitiesChange,
}: FacilitiesManagementProps) {
  const t = useTranslations("FacilitiesManagement");
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
    if (!confirm(t("deleteConfirmation", { name: facility.name }))) {
      return;
    }

    try {
      setDeletingId(Number(facility.id));
      await recreationalService.deleteFacility(Number(facility.id));
      onFacilitiesChange(facilities.filter((f) => f.id !== facility.id));
      toast.success(t("facilityDeletedSuccess"));
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error(t("errorDeleting"));
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
        t(
          updatedFacility.available
            ? "facilityActivated"
            : "facilityDeactivated",
        ),
      );
    } catch (error) {
      console.error("Error updating facility status:", error);
      toast.error(t("errorUpdatingStatus"));
    }
  };

  const getFacilityTypeLabel = (type: FacilityType) => {
    const typeLabels: Record<FacilityType, string> = {
      SWIMMING_POOL: t("facilityTypePool"),
      GYM: t("facilityTypeGym"),
      TENNIS_COURT: t("facilityTypeTennis"),
      SPA: t("facilityTypeSpa"),
      SAUNA: t("facilityTypeSauna"),
      JACUZZI: t("facilityTypeJacuzzi"),
      GAME_ROOM: t("facilityTypeGameRoom"),
      YOGA_STUDIO: t("facilityTypeYoga"),
      KIDS_PLAY_AREA: t("facilityTypeKidsPlay"),
      BUSINESS_CENTER: t("facilityTypeBusiness"),
      OTHER: t("facilityTypeOther"),
    };
    return typeLabels[type] || type;
  };

  const getStatusBadge = (status: FacilityStatus, available: boolean) => {
    if (!available || status === "OUT_OF_ORDER") {
      return <Badge variant="destructive">{t("statusOutOfService")}</Badge>;
    }

    switch (status) {
      case "AVAILABLE":
        return (
          <Badge variant="default" className="bg-green-500">
            {t("statusAvailable")}
          </Badge>
        );
      case "OCCUPIED":
        return (
          <Badge variant="secondary" className="bg-blue-500">
            {t("statusOccupied")}
          </Badge>
        );
      case "MAINTENANCE":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            {t("statusMaintenance")}
          </Badge>
        );
      case "RESERVED":
        return (
          <Badge variant="secondary" className="bg-purple-500">
            {t("statusReserved")}
          </Badge>
        );
      case "CLEANING":
        return (
          <Badge variant="secondary" className="bg-orange-500">
            {t("statusCleaning")}
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
            <h3 className="text-lg font-medium">{t("title")}</h3>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        {facilities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">
                {t("noFacilities")}
              </CardTitle>
              <CardDescription className="text-center mb-4">
                {t("noFacilitiesDescription")}
              </CardDescription>
              <Button onClick={() => setShowFacilityDialog(true)}>
                {t("createFirstFacility")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {t("facilitiesCount", { count: facilities.length })}
              </CardTitle>
              <CardDescription>
                {t("facilitiesListDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("facilityHead")}</TableHead>
                      <TableHead>{t("typeHead")}</TableHead>
                      <TableHead>{t("locationHead")}</TableHead>
                      <TableHead>{t("capacityHead")}</TableHead>
                      <TableHead>{t("statusHead")}</TableHead>
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
                        <TableCell>
                          {facility.capacity} {t("people")}
                        </TableCell>
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
                                <span className="sr-only">{t("openMenu")}</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                {t("actions")}
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleView(facility)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                {t("viewDetails")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(facility)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {t("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(facility)}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                {facility.available
                                  ? t("deactivate")
                                  : t("activate")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(facility)}
                                disabled={deletingId === facility.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deletingId === facility.id
                                  ? t("deleting")
                                  : t("delete")}
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
