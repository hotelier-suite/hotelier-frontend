"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { type Reservation } from "@/lib/features/reservations/types";
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { formatCurrency } from "@/lib/utils/currency";

interface ReservationsTableProps {
  reservations: Reservation[];
  onViewReservation: (id: number) => void;
  onEditReservation: (id: number) => void;
  onDeleteReservation: (id: number) => void;
  currencyCode?: string;
  onUpdateStatus?: (id: number, status: Reservation["status"]) => void;
}

export function ReservationsTable({
  reservations,
  onViewReservation,
  onEditReservation,
  onDeleteReservation,
  currencyCode,
  onUpdateStatus,
}: ReservationsTableProps) {
  const t = useTranslations("ReservationsTable");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("confirmed")}
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("pending")}
          </Badge>
        );
      case "CHECKED_IN":
        return (
          <Badge className="bg-blue-100 text-blue-800">{t("checkedIn")}</Badge>
        );
      case "CHECKED_OUT":
        return (
          <Badge className="bg-gray-100 text-gray-800">{t("checkedOut")}</Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800">{t("cancelled")}</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelDisplayName = (channel: string) => {
    switch (channel) {
      case "DIRECT":
        return t("channelDirect");
      case "BOOKING_COM":
        return "Booking.com";
      case "EXPEDIA":
        return "Expedia";
      case "AIRBNB":
        return "Airbnb";
      case "AGENCY":
        return t("channelAgency");
      case "PHONE":
        return t("channelPhone");
      default:
        return channel;
    }
  };

  const getRoomTypeDisplayName = (type: string) => {
    switch (type) {
      case "INDIVIDUAL":
        return t("roomSingle");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("reservationsFound", { count: reservations.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id")}</TableHead>
              <TableHead>{t("guest")}</TableHead>
              <TableHead>{t("contact")}</TableHead>
              <TableHead>{t("room")}</TableHead>
              <TableHead>{t("dates")}</TableHead>
              <TableHead>{t("guests")}</TableHead>
              <TableHead>{t("discounts")}</TableHead>
              <TableHead>{t("total")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("channel")}</TableHead>
              <TableHead>{t("createdDate")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">#{reservation.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{reservation.guestName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{reservation.guestEmail}</div>
                    {reservation.guestPhone && (
                      <div className="text-muted-foreground">
                        {reservation.guestPhone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{reservation.room.number}</div>
                    <div className="text-sm text-muted-foreground">
                      {getRoomTypeDisplayName(reservation.room.type)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {new Date(reservation.checkInDate).toLocaleDateString(
                        intlLocale,
                      )}
                    </div>
                    <div>
                      {new Date(reservation.checkOutDate).toLocaleDateString(
                        intlLocale,
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {t("nightsCount", { count: reservation.nights ?? 0 })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {t("guestsCount", { count: reservation.guests })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {reservation.discountPercent ||
                    reservation.discountAmount ? (
                      <div>
                        {reservation.discountPercent && (
                          <div>
                            {t("percentDiscount", {
                              percent: reservation.discountPercent,
                            })}
                          </div>
                        )}
                        {reservation.discountAmount && (
                          <div>
                            {formatCurrency(
                              reservation.discountAmount,
                              currencyCode,
                            )}{" "}
                            {t("fixed")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        {t("noDiscounts")}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    Number(reservation.totalAmount),
                    currencyCode,
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell>
                  {getChannelDisplayName(reservation.channel)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {new Date(reservation.createdAt).toLocaleDateString(
                        intlLocale,
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(reservation.createdAt).toLocaleTimeString(
                        intlLocale,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-2">
                    {onUpdateStatus && (
                      <div className="flex flex-wrap gap-2">
                        {reservation.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateStatus(
                                  Number(reservation.id),
                                  "CONFIRMED",
                                )
                              }
                            >
                              {t("confirm")}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateStatus(
                                  Number(reservation.id),
                                  "CANCELLED",
                                )
                              }
                            >
                              {t("cancel")}
                            </Button>
                          </>
                        )}
                        {reservation.status === "CONFIRMED" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateStatus(
                                  Number(reservation.id),
                                  "CHECKED_IN",
                                )
                              }
                            >
                              {t("checkIn")}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateStatus(
                                  Number(reservation.id),
                                  "CANCELLED",
                                )
                              }
                            >
                              {t("cancel")}
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onViewReservation(Number(reservation.id))
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onEditReservation(Number(reservation.id))
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onDeleteReservation(Number(reservation.id))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
