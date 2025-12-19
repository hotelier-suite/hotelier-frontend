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
} from "@/lib/api/recreational";

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

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-yellow-500">
          Pending
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge variant="default" className="bg-blue-500">
          Confirmed
        </Badge>
      );
    case "CHECKED_IN":
      return (
        <Badge variant="default" className="bg-green-500">
          In Progress
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="default" className="bg-gray-500">
          Completed
        </Badge>
      );
    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;
    case "NO_SHOW":
      return (
        <Badge variant="destructive" className="bg-orange-500">
          No Show
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "VIP":
      return (
        <Badge variant="default" className="bg-purple-500">
          VIP
        </Badge>
      );
    case "HIGH":
      return (
        <Badge variant="default" className="bg-orange-500">
          High
        </Badge>
      );
    case "NORMAL":
      return <Badge variant="outline">Normal</Badge>;
    case "MAINTENANCE":
      return <Badge variant="secondary">Maintenance</Badge>;
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
  const getFacilityName = (facilityId: number) => {
    return (
      facilities.find((f) => f.id === facilityId)?.name ||
      "Facility not found"
    );
  };

  const getBookingActions = (booking: RecreationalBooking) => {
    const actions = [];

    if (booking.status === "PENDING") {
      actions.push(
        <DropdownMenuItem key="confirm" onClick={() => onConfirm(booking)}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Confirm
        </DropdownMenuItem>,
      );
    }

    if (booking.status === "CONFIRMED") {
      actions.push(
        <DropdownMenuItem key="checkin" onClick={() => onCheckIn(booking)}>
          <UserCheck className="mr-2 h-4 w-4" />
          Check-in
        </DropdownMenuItem>,
      );
    }

    if (booking.status === "CHECKED_IN") {
      actions.push(
        <DropdownMenuItem key="checkout" onClick={() => onCheckOut(booking)}>
          <UserX className="mr-2 h-4 w-4" />
          Check-out
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
          Cancel
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
            <TableHead>Guest</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                No bookings found
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.guestName}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.roomNumber && `Room ${booking.roomNumber} • `}
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
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {booking.startTime} - {booking.endTime}
                    <div className="text-xs text-muted-foreground">
                      {booking.duration}h
                    </div>
                  </div>
                </TableCell>
                <TableCell>{booking.participants}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>{getPriorityBadge(booking.priority)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={actioningId === booking.id}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(booking)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(booking)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
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
