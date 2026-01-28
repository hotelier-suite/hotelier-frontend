"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Guest } from "@/lib/features/guests/types";
import { guestsService } from "@/lib/features/guests/service";
import type { UseFormReturn } from "react-hook-form";

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

interface GuestSearchSectionProps {
  form: UseFormReturn<ReservationFormData>;
  enabled?: boolean;
}

export function GuestSearchSection({
  form,
  enabled = true,
}: GuestSearchSectionProps) {
  const [guestSearch, setGuestSearch] = useState<string>("");
  const [guestOptions, setGuestOptions] = useState<Guest[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    (async () => {
      try {
        const list = await guestsService.search(guestSearch || "");
        if (active) setGuestOptions(list.slice(0, 20));
      } catch (e) {
        console.error("Error loading guests:", e);
      }
    })();
    return () => {
      active = false;
    };
  }, [guestSearch, enabled]);

  if (!enabled) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Search Guest</Label>
        <Input
          placeholder="Name, email, phone or document"
          value={guestSearch}
          onChange={(e) => setGuestSearch(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guestId">Select Guest (optional)</Label>
        <Select
          value={form.watch("guestId") || ""}
          onValueChange={(value) => form.setValue("guestId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Not assigned" />
          </SelectTrigger>
          <SelectContent>
            {guestOptions.map((g) => (
              <SelectItem key={g.id} value={g.id.toString()}>
                {g.name} ({g.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
