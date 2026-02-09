"use client";

import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { formatCurrency } from "@/lib/utils/currency";
import { Label } from "@/components/ui/label";
import { type ReservationBillingDetails } from "@/lib/features/reservations/types";
import { Calendar, UtensilsCrossed, PartyPopper } from "lucide-react";

interface BillingDetailsDisplayProps {
  billingData: ReservationBillingDetails;
}

export function BillingDetailsDisplay({
  billingData,
}: BillingDetailsDisplayProps) {
  const t = useTranslations("BillingDetailsDisplay");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
      <Label className="text-lg font-semibold">{t("relatedCharges")}</Label>
      <div className="space-y-2 text-sm">
        {/* Room Charges */}
        {billingData.roomCharges > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>
                {t("reservationRoom", {
                  room: billingData.reservation.room?.number ?? "",
                })}
                :
              </span>
            </div>
            <span className="font-medium">
              {formatCurrency(billingData.roomCharges)}
            </span>
          </div>
        )}

        {/* Room Service Charges */}
        {billingData.roomServiceTotal > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-orange-500" />
                <span>{t("roomService")}:</span>
              </div>
              <span className="font-medium">
                {formatCurrency(billingData.roomServiceTotal)}
              </span>
            </div>
            {billingData.roomServiceCharges.map((rs) => (
              <div
                key={rs.orderId}
                className="ml-6 text-xs text-muted-foreground flex justify-between"
              >
                <span>
                  • {rs.orderNumber} -{" "}
                  {new Date(rs.orderDate).toLocaleString(intlLocale)}
                </span>
                <span>{formatCurrency(rs.total)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Event Charges */}
        {billingData.eventTotal > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PartyPopper className="h-4 w-4 text-purple-500" />
                <span>{t("corporateEvents")}:</span>
              </div>
              <span className="font-medium">
                {formatCurrency(billingData.eventTotal)}
              </span>
            </div>
            {billingData.eventCharges.map((evt) => (
              <div
                key={evt.bookingId}
                className="ml-6 text-xs text-muted-foreground flex justify-between"
              >
                <span>
                  • {evt.title} -{" "}
                  {t("attendeesCount", { count: evt.attendees })}
                </span>
                <span>{formatCurrency(evt.total)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-2 flex justify-between font-bold">
          <span>{t("total")}:</span>
          <span className="text-green-600">
            {formatCurrency(billingData.grandTotal)}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {t("chargesAutoAdded")}
      </p>
    </div>
  );
}
