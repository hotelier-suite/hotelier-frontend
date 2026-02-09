import {
  MoreHorizontal,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  RecreationalBooking,
  RecreationalFacility,
  BookingStatus,
} from "@/lib/features/recreational/types";
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";

interface BookingsTableProps {
  bookings: RecreationalBooking[];
  facilities: RecreationalFacility[];
  actioningId: string | number | null;
  onView: (booking: RecreationalBooking) => void;
  onEdit: (booking: RecreationalBooking) => void;
  onConfirm: (booking: RecreationalBooking) => void;
  onCancel: (booking: RecreationalBooking) => void;
  onCheckIn: (booking: RecreationalBooking) => void;
  onCheckOut: (booking: RecreationalBooking) => void;
}

const getStatusBadge = (status: BookingStatus, t: (key: string) => string) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-yellow-500">
          {t("statusPending")}
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge variant="default" className="bg-blue-500">
          {t("statusConfirmed")}
        </Badge>
      );
    case "CHECKED_IN":
      return (
        <Badge variant="default" className="bg-green-500">
          {t("statusInProgress")}
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="default" className="bg-gray-500">
          {t("statusCompleted")}
        </Badge>
      );
    case "CANCELLED":
      return <Badge variant="destructive">{t("statusCancelled")}</Badge>;
    case "NO_SHOW":
      return (
        <Badge variant="destructive" className="bg-orange-500">
          {t("statusNoShow")}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string, t: (key: string) => string) => {
  switch (priority) {
    case "VIP":
      return (
        <Badge variant="default" className="bg-purple-500">
          {t("priorityVip")}
        </Badge>
      );
    case "HIGH":
      return (
        <Badge variant="default" className="bg-orange-500">
          {t("priorityHigh")}
        </Badge>
      );
    case "NORMAL":
      return <Badge variant="outline">{t("priorityNormal")}</Badge>;
    case "MAINTENANCE":
      return <Badge variant="secondary">{t("priorityMaintenance")}</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export function BookingsTable({
  bookings,
  facilities,
  actioningId,
  onView,
  onEdit,
  onConfirm,
  onCancel,
  onCheckIn,
  onCheckOut,
}: BookingsTableProps) {
  const t = useTranslations("BookingsTable");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  const getFacilityName = (facilityId: number) => {
    return (
      facilities.find((f) => f.id === facilityId)?.name || t("facilityNotFound")
    );
  };

  const getBookingActions = (booking: RecreationalBooking) => {
    const actions = [];

    if (booking.status === "PENDING") {
      actions.push(
        <DropdownMenuItem key="confirm" onClick={() => onConfirm(booking)}>
          <CheckCircle className="mr-2 h-4 w-4" />
          {t("confirm")}
        </DropdownMenuItem>,
      );
    }

    if (booking.status === "CONFIRMED") {
      actions.push(
        <DropdownMenuItem key="checkin" onClick={() => onCheckIn(booking)}>
          <UserCheck className="mr-2 h-4 w-4" />
          {t("checkIn")}
        </DropdownMenuItem>,
      );
    }

    if (booking.status === "CHECKED_IN") {
      actions.push(
        <DropdownMenuItem key="checkout" onClick={() => onCheckOut(booking)}>
          <UserX className="mr-2 h-4 w-4" />
          {t("checkOut")}
        </DropdownMenuItem>,
      );
    }

    if (["PENDING", "CONFIRMED"].includes(booking.status)) {
      actions.push(
        <DropdownMenuItem
          key="cancel"
          onClick={() => onCancel(booking)}
          className="text-destructive"
        >
          <XCircle className="mr-2 h-4 w-4" />
          {t("cancel")}
        </DropdownMenuItem>,
      );
    }

    return actions;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("guest")}</TableHead>
            <TableHead>{t("facility")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("time")}</TableHead>
            <TableHead>{t("participants")}</TableHead>
            <TableHead>{t("statusHead")}</TableHead>
            <TableHead>{t("priorityHead")}</TableHead>
            <TableHead className="w-[70px]">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                {t("noBookings")}
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.guestName}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.roomNumber &&
                        `${t("room")} ${booking.roomNumber} • `}
                      {booking.guestEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {getFacilityName(booking.facilityId)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(booking.bookingDate).toLocaleDateString(
                      intlLocale,
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {booking.startTime} - {booking.endTime}
                    <div className="text-xs text-muted-foreground">
                      {booking.duration}
                      {t("hoursUnit")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{booking.participants}</TableCell>
                <TableCell>{getStatusBadge(booking.status, t)}</TableCell>
                <TableCell>{getPriorityBadge(booking.priority, t)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={actioningId === booking.id}
                      >
                        <span className="sr-only">{t("openMenu")}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(booking)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("viewDetails")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(booking)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("edit")}
                      </DropdownMenuItem>
                      {getBookingActions(booking).length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          {getBookingActions(booking)}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
