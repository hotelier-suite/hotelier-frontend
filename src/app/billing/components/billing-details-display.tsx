"use client";

import { Label } from "@/components/ui/label";
import { type ReservationBillingDetails } from "@/lib/features/reservations/types";
import { Calendar, UtensilsCrossed, PartyPopper } from "lucide-react";

interface BillingDetailsDisplayProps {
  billingData: ReservationBillingDetails;
}

export function BillingDetailsDisplay({
  billingData,
}: BillingDetailsDisplayProps) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
      <Label className="text-lg font-semibold">Related Charges</Label>
      <div className="space-y-2 text-sm">
        {/* Room Charges */}
        {billingData.roomCharges > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>
                Reservation (Room {billingData.reservation.room?.number}):
              </span>
            </div>
            <span className="font-medium">
              ${billingData.roomCharges.toLocaleString()}
            </span>
          </div>
        )}

        {/* Room Service Charges */}
        {billingData.roomServiceTotal > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-orange-500" />
                <span>Room Service:</span>
              </div>
              <span className="font-medium">
                ${billingData.roomServiceTotal.toLocaleString()}
              </span>
            </div>
            {billingData.roomServiceCharges.map((rs) => (
              <div
                key={rs.orderId}
                className="ml-6 text-xs text-muted-foreground flex justify-between"
              >
                <span>
                  • {rs.orderNumber} - {new Date(rs.orderDate).toLocaleString()}
                </span>
                <span>${rs.total.toLocaleString()}</span>
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
                <span>Corporate Events:</span>
              </div>
              <span className="font-medium">
                ${billingData.eventTotal.toLocaleString()}
              </span>
            </div>
            {billingData.eventCharges.map((evt) => (
              <div
                key={evt.bookingId}
                className="ml-6 text-xs text-muted-foreground flex justify-between"
              >
                <span>
                  • {evt.title} - {evt.attendees} people
                </span>
                <span>${evt.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total:</span>
          <span className="text-green-600">
            ${billingData.grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Charges have been automatically added to the invoice items
      </p>
    </div>
  );
}
