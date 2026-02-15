"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ReservationBillingDetails } from "@/lib/features/reservations/types";

interface ReservationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  reservations: ReservationBillingDetails[];
  loading: boolean;
  roomNumber: string;
}

export function ReservationSelector({
  value,
  onChange,
  reservations,
  loading,
  roomNumber,
}: ReservationSelectorProps) {
  const t = useTranslations("ReservationSelector");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Select value={value} onValueChange={onChange} disabled={loading}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                loading ? t("loadingReservations") : t("selectReservation")
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-[400px]">
            {reservations.length === 0 && !loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t("noPendingPayments")}
              </div>
            ) : (
              reservations.map((billingData) => {
                const statusLabels: Record<string, string> = {
                  pending: t("statusPending"),
                  confirmed: t("statusConfirmed"),
                  checked_in: t("statusCheckIn"),
                  checked_out: t("statusCheckOut"),
                  cancelled: t("statusCancelled"),
                };
                const statusColors: Record<string, string> = {
                  pending: "text-yellow-600",
                  confirmed: "text-blue-600",
                  checked_in: "text-green-600",
                  checked_out: "text-orange-600",
                  cancelled: "text-red-600",
                };

                return (
                  <SelectItem
                    key={billingData.reservation.id}
                    value={billingData.reservation.id.toString()}
                  >
                    <div className="flex flex-col py-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {billingData.reservation.guestName}
                        </span>
                        <span
                          className={`text-xs ${statusColors[billingData.reservationStatus || ""] || "text-gray-600"}`}
                        >
                          (
                          {statusLabels[billingData.reservationStatus || ""] ||
                            t("notAvailable")}
                          )
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {t("room")} {billingData.reservation.room?.number} |
                        {billingData.reservation.nights || 0} {t("nights")} |{" "}
                        {t("total")}
                        {formatCurrency(billingData.grandTotal)}
                      </span>
                    </div>
                  </SelectItem>
                );
              })
            )}
            {reservations.length === 0 && !loading && (
              <SelectItem value="no-reservations" disabled>
                {t("noReservationsPendingBilling")}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Input id="room" value={roomNumber} placeholder={t("room")} disabled />
      </div>
    </div>
  );
}
