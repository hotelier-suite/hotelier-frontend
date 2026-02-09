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
  const t = useTranslations("ExitDialog");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("vehicle")}: {selectedSpace?.currentVehicle?.licensePlate} -{" "}
            {selectedSpace?.currentVehicle?.owner}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">{t("amountToCharge")}</Label>
            <Input
              id="amount"
              type="number"
              value={exitForm.amount}
              onChange={(e) => onFormChange("amount", e.target.value)}
              placeholder={t("amountPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              value={exitForm.notes}
              onChange={(e) => onFormChange("notes", e.target.value)}
              placeholder={t("notesPlaceholder")}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} className="flex-1">
              {t("registerExit")}
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
