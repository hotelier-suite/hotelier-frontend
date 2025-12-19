"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface EntryForm {
  licensePlate: string;
  ownerName: string;
  room: string;
  guestType: "guest" | "visitor" | "employee";
}

interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSpace: ParkingSpace | null;
  entryForm: EntryForm;
  onFormChange: (field: keyof EntryForm, value: string) => void;
  onSubmit: () => void;
}

export function EntryDialog({
  open,
  onOpenChange,
  selectedSpace,
  entryForm,
  onFormChange,
  onSubmit,
}: EntryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Entry</DialogTitle>
          <DialogDescription>
            Space: {selectedSpace?.number} ({selectedSpace?.zone})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="licensePlate">Vehicle License Plate *</Label>
            <Input
              id="licensePlate"
              value={entryForm.licensePlate}
              onChange={(e) => onFormChange("licensePlate", e.target.value)}
              placeholder="ABC123"
            />
          </div>
          <div>
            <Label htmlFor="ownerName">Owner Name *</Label>
            <Input
              id="ownerName"
              value={entryForm.ownerName}
              onChange={(e) => onFormChange("ownerName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="room">Room (optional)</Label>
            <Input
              id="room"
              value={entryForm.room}
              onChange={(e) => onFormChange("room", e.target.value)}
              placeholder="205"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} className="flex-1">
              Register Entry
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
