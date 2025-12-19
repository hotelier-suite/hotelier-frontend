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
import { Textarea } from "@/components/ui/textarea";

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

interface ExitForm {
  amount: string;
  notes: string;
}

interface ExitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSpace: ParkingSpace | null;
  exitForm: ExitForm;
  onFormChange: (field: keyof ExitForm, value: string) => void;
  onSubmit: () => void;
}

export function ExitDialog({
  open,
  onOpenChange,
  selectedSpace,
  exitForm,
  onFormChange,
  onSubmit,
}: ExitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Exit</DialogTitle>
          <DialogDescription>
            Vehicle: {selectedSpace?.currentVehicle?.licensePlate} -{" "}
            {selectedSpace?.currentVehicle?.owner}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount to Charge (optional)</Label>
            <Input
              id="amount"
              type="number"
              value={exitForm.amount}
              onChange={(e) => onFormChange("amount", e.target.value)}
              placeholder="15000"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={exitForm.notes}
              onChange={(e) => onFormChange("notes", e.target.value)}
              placeholder="Additional notes..."
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} className="flex-1">
              Register Exit
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
