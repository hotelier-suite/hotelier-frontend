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
import { type Reservation } from "@/lib/api/reservations";

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
  const formatCurrency = (val: number) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode || "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    } catch {
      return `$${val.toLocaleString()}`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        );
      case "CHECKED_IN":
        return <Badge className="bg-blue-100 text-blue-800">Checked In</Badge>;
      case "CHECKED_OUT":
        return <Badge className="bg-gray-100 text-gray-800">Checked Out</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelDisplayName = (channel: string) => {
    switch (channel) {
      case "DIRECT":
        return "Direct";
      case "BOOKING_COM":
        return "Booking.com";
      case "EXPEDIA":
        return "Expedia";
      case "AIRBNB":
        return "Airbnb";
      case "AGENCY":
        return "Agency";
      case "PHONE":
        return "Phone";
      default:
        return channel;
    }
  };

  const getRoomTypeDisplayName = (type: string) => {
    switch (type) {
      case "INDIVIDUAL":
        return "Single";
      case "DOBLE":
        return "Double";
      case "SUITE":
        return "Suite";
      case "FAMILIAR":
        return "Family";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservations List</CardTitle>
        <CardDescription>
          {reservations.length} reservations found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Discounts</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
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
                      {new Date(reservation.checkInDate).toLocaleDateString()}
                    </div>
                    <div>
                      {new Date(reservation.checkOutDate).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground">
                      {reservation.nights} nights
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {reservation.guests} guests
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {reservation.discountPercent ||
                      reservation.discountAmount ? (
                      <div>
                        {reservation.discountPercent && (
                          <div>{reservation.discountPercent}% discount</div>
                        )}
                        {reservation.discountAmount && (
                          <div>
                            {formatCurrency(reservation.discountAmount)} fixed
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        No discounts
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(reservation.totalAmount))}
                </TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell>
                  {getChannelDisplayName(reservation.channel)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {new Date(reservation.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(reservation.createdAt).toLocaleTimeString(
                        "en-US",
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
                              Confirm
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
                              Cancel
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
                              Check-in
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
                              Cancel
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
