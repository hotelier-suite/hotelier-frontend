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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("EntryDialog");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("spaceLabel")}: {selectedSpace?.number} ({selectedSpace?.zone})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="licensePlate">{t("licensePlate")}</Label>
            <Input
              id="licensePlate"
              value={entryForm.licensePlate}
              onChange={(e) => onFormChange("licensePlate", e.target.value)}
              placeholder={t("placeholderLicensePlate")}
            />
          </div>
          <div>
            <Label htmlFor="ownerName">{t("ownerName")}</Label>
            <Input
              id="ownerName"
              value={entryForm.ownerName}
              onChange={(e) => onFormChange("ownerName", e.target.value)}
              placeholder={t("placeholderOwnerName")}
            />
          </div>
          <div>
            <Label htmlFor="room">{t("roomOptional")}</Label>
            <Input
              id="room"
              value={entryForm.room}
              onChange={(e) => onFormChange("room", e.target.value)}
              placeholder={t("placeholderRoom")}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} className="flex-1">
              {t("registerEntry")}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
