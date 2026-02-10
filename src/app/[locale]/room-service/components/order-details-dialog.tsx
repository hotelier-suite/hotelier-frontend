"use client";

import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { RoomServiceOrder } from "@/lib/features/restaurant/types";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: RoomServiceOrder | null;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailsDialogProps) {
  const t = useTranslations("OrderDetailsDialogComp");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  const getStatusColor = (status: RoomServiceOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: RoomServiceOrder["status"]) => {
    switch (status) {
      case "pending":
        return t("pending");
      case "preparing":
        return t("preparing");
      case "ready":
        return t("ready");
      case "delivered":
        return t("delivered");
      default:
        return t("unknown");
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("orderDetails")} #{order.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>{t("room")}:</strong> {order.room}
            </div>
            <div>
              <strong>{t("guest")}:</strong> {order.guest}
            </div>
            <div>
              <strong>{t("status")}:</strong>
              <Badge className={`ml-2 ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
            <div>
              <strong>{t("total")}:</strong>{" "}
              {formatCurrency(order.total)}
            </div>
          </div>

          <div>
            <strong>{t("products")}:</strong>
            <div className="mt-2 space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 bg-muted rounded"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatCurrency(Number(item.price))}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <strong>{t("orderDate")}:</strong>{" "}
            {new Date(order.orderDate).toLocaleString(intlLocale)}
          </div>

          {order.estimatedTime && (
            <div>
              <strong>{t("estimatedTime")}:</strong> {order.estimatedTime}
            </div>
          )}

          {order.waiter && (
            <div>
              <strong>{t("assignedWaiter")}:</strong> {order.waiter}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
