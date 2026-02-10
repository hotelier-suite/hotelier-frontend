"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { Room } from "@/lib/features/rooms/types";

interface ReservationFormData {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guests: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
  discountAmount?: string;
  guestId?: string;
}

interface DateSelectionSectionProps {
  form: UseFormReturn<ReservationFormData>;
  availableRooms: Room[];
  availabilityLoading?: boolean;
  currencyCode?: string;
  enabled?: boolean;
}

export function DateSelectionSection({
  form,
  availableRooms,
  availabilityLoading = false,
  currencyCode,
  enabled = true,
}: DateSelectionSectionProps) {
  const t = useTranslations("DateSelectionSection");

  if (!enabled) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="checkInDate">{t("checkInDate")}</Label>
        <Input id="checkInDate" type="date" {...form.register("checkInDate")} />
        {form.formState.errors.checkInDate && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.checkInDate.message)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkOutDate">{t("checkOutDate")}</Label>
        <Input
          id="checkOutDate"
          type="date"
          min={form.watch("checkInDate")}
          {...form.register("checkOutDate")}
        />
        {form.formState.errors.checkOutDate && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.checkOutDate.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomId">{t("room")}</Label>
        {availabilityLoading && (
          <div className="text-xs text-muted-foreground">
            {t("searchingAvailability")}
          </div>
        )}
        <Select
          value={form.watch("roomId")}
          onValueChange={(value) => form.setValue("roomId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("selectRoom")} />
          </SelectTrigger>
          <SelectContent>
            {availabilityLoading ? (
              <div className="p-2 text-center text-sm text-muted-foreground">
                {t("searchingAvailableRooms")}
              </div>
            ) : (
              (() => {
                const formValues = form.watch();

                // Only show rooms if we have selected dates and availability search has completed
                if (!formValues.checkInDate || !formValues.checkOutDate) {
                  return (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      {t("selectDatesToSeeRooms")}
                    </div>
                  );
                }

                // If we already have dates but no availability result, show search message
                if (availableRooms === null) {
                  return (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      {t("selectDatesToSeeAvailability")}
                    </div>
                  );
                }

                const roomsToShow = availableRooms;

                if (roomsToShow.length === 0) {
                  return (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      {t("noRoomsForDates")}
                    </div>
                  );
                }

                const getRoomTypeDisplayName = (type: string) => {
                  switch (type) {
                    case "INDIVIDUAL":
                      return t("roomIndividual");
                    case "DOBLE":
                      return t("roomDouble");
                    case "SUITE":
                      return t("roomSuite");
                    case "FAMILIAR":
                      return t("roomFamily");
                    default:
                      return type;
                  }
                };

                return roomsToShow.map((room) => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    {room.number} - {getRoomTypeDisplayName(room.type)} (
                    {formatCurrency(Number(room.price), currencyCode)}/{t("perNight")},{" "}
                    {t("capacityAbbr")} {room.capacity})
                  </SelectItem>
                ));
              })()
            )}
          </SelectContent>
        </Select>
        {form.formState.errors.roomId && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.roomId.message)}
          </p>
        )}
      </div>
    </div>
  );
}
