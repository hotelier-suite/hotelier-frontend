"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ParkingStatistics } from "./parking-statistics";
import { ParkingSearch } from "./parking-search";
import { ParkingSpaceCard } from "./parking-space-card";
import { ParkingRecentActivities } from "./recent-activities";
import { EntryDialog } from "./entry-dialog";
import { ExitDialog } from "./exit-dialog";

interface ParkingSpace {
  id: string;
  number: string;
  zone: string;
  type: "standard" | "premium" | "disability" | "electric";
  status: "available" | "occupied" | "reserved" | "maintenance";
  currentVehicle?: {
    licensePlate: string;
    owner: string;
    entryTime: string;
    room?: string;
  };
}

interface ParkingActivity {
  id: string;
  action: "entry" | "exit";
  licensePlate: string;
  ownerName: string;
  room?: string;
  spaceNumber: string;
  timestamp: string;
  duration?: string;
  amount?: number;
}

interface ParkingSpaceManagementProps {
  initialSpaces: ParkingSpace[];
  initialActivities: ParkingActivity[];
}

export function ParkingSpaceManagement({
  initialSpaces,
  initialActivities,
}: ParkingSpaceManagementProps) {
  const t = useTranslations("ParkingSpaceManagement");
  const [spaces, setSpaces] = useState<ParkingSpace[]>(initialSpaces);
  const [activities, setActivities] =
    useState<ParkingActivity[]>(initialActivities);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [showEntryDialog, setShowEntryDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [entryForm, setEntryForm] = useState({
    licensePlate: "",
    ownerName: "",
    room: "",
    guestType: "guest" as "guest" | "visitor" | "employee",
  });

  const [exitForm, setExitForm] = useState({
    amount: "",
    notes: "",
  });

  const filteredSpaces = spaces.filter(
    (space) =>
      space.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.currentVehicle?.licensePlate
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      space.currentVehicle?.owner
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleSpaceClick = (space: ParkingSpace) => {
    setSelectedSpace(space);
    if (space.status === "available") {
      setShowEntryDialog(true);
    } else if (space.status === "occupied") {
      setShowExitDialog(true);
    }
  };

  const handleVehicleEntry = () => {
    if (!selectedSpace) {
      toast.error(t("noSpaceSelected"));
      return;
    }

    const newActivity: ParkingActivity = {
      id: `ACT${Date.now()}`,
      action: "entry",
      licensePlate: entryForm.licensePlate,
      ownerName: entryForm.ownerName,
      room: entryForm.room || undefined,
      spaceNumber: selectedSpace.number,
      timestamp: new Date().toISOString(),
    };

    const updatedSpaces = spaces.map((space) =>
      space.id === selectedSpace.id
        ? {
            ...space,
            status: "occupied" as const,
            currentVehicle: {
              licensePlate: entryForm.licensePlate,
              owner: entryForm.ownerName,
              entryTime: new Date().toISOString(),
              room: entryForm.room || undefined,
            },
          }
        : space,
    );

    setSpaces(updatedSpaces);
    setActivities([newActivity, ...activities]);

    // Reset form
    setEntryForm({
      licensePlate: "",
      ownerName: "",
      room: "",
      guestType: "guest",
    });

    setShowEntryDialog(false);
    setSelectedSpace(null);

    toast.success(t("vehicleRegisteredSuccess"));
  };

  const handleVehicleExit = () => {
    if (!selectedSpace || !selectedSpace.currentVehicle) {
      toast.error(t("noVehicleInSpace"));
      return;
    }

    const entryTime = new Date(selectedSpace.currentVehicle.entryTime);
    const exitTime = new Date();
    const durationMs = exitTime.getTime() - entryTime.getTime();
    const hours = Math.ceil(durationMs / (1000 * 60 * 60));
    const duration = `${hours}${t("hoursUnit")}`;

    const newActivity: ParkingActivity = {
      id: `ACT${Date.now()}`,
      action: "exit",
      licensePlate: selectedSpace.currentVehicle.licensePlate,
      ownerName: selectedSpace.currentVehicle.owner,
      room: selectedSpace.currentVehicle.room,
      spaceNumber: selectedSpace.number,
      timestamp: exitTime.toISOString(),
      duration,
      amount: exitForm.amount ? parseFloat(exitForm.amount) : undefined,
    };

    const updatedSpaces = spaces.map((space) =>
      space.id === selectedSpace.id
        ? {
            ...space,
            status: "available" as const,
            currentVehicle: undefined,
          }
        : space,
    );

    setSpaces(updatedSpaces);
    setActivities([newActivity, ...activities]);

    // Reset form
    setExitForm({
      amount: "",
      notes: "",
    });

    setShowExitDialog(false);
    setSelectedSpace(null);

    toast.success(t("vehicleRemovedSuccess"));
  };

  const handleEntryFormChange = (field: string, value: string) => {
    setEntryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleExitFormChange = (field: string, value: string) => {
    setExitForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {/* Statistics */}
      <ParkingStatistics spaces={spaces} />

      {/* Search and Filter */}
      <ParkingSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Parking Spaces Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSpaces.map((space) => (
          <ParkingSpaceCard
            key={space.id}
            space={space}
            onClick={handleSpaceClick}
          />
        ))}
      </div>

      {/* Recent Activities */}
      <ParkingRecentActivities activities={activities} />

      {/* Entry Dialog */}
      <EntryDialog
        open={showEntryDialog}
        onOpenChange={setShowEntryDialog}
        selectedSpace={selectedSpace}
        entryForm={entryForm}
        onFormChange={handleEntryFormChange}
        onSubmit={handleVehicleEntry}
      />

      {/* Exit Dialog */}
      <ExitDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        selectedSpace={selectedSpace}
        exitForm={exitForm}
        onFormChange={handleExitFormChange}
        onSubmit={handleVehicleExit}
      />
    </div>
  );
}
