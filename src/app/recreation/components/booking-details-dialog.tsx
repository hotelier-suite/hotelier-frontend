"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Phone,
  Mail,
  Home,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  type RecreationalBooking,
  type RecreationalFacility,
  type BookingStatus,
} from "@/lib/api/recreational";

interface BookingDetailsDialogProps {
  booking: RecreationalBooking | null;
  facility: RecreationalFacility | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDialog({
  booking,
  facility,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  if (!booking) return null;

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

  const calculateActualDuration = () => {
    if (!booking.actualCheckIn || !booking.actualCheckOut) return null;

    const checkIn = new Date(booking.actualCheckIn);
    const checkOut = new Date(booking.actualCheckOut);
    const duration =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

    return Math.round(duration * 100) / 100;
  };

  const actualDuration = calculateActualDuration();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                Reserva #{booking.id}
              </DialogTitle>
              <DialogDescription className="flex items-center mt-1">
                <User className="h-4 w-4 mr-1" />
                {booking.guestName}
              </DialogDescription>
            </div>
            <div className="text-right space-y-1">
              {getStatusBadge(booking.status)}
              {getPriorityBadge(booking.priority)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <User className="h-4 w-4 mr-2" />
                Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">Name:</span>
                    <span className="ml-2">{booking.guestName}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{booking.guestEmail}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {booking.guestPhone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{booking.guestPhone}</span>
                    </div>
                  )}
                  {booking.roomNumber && (
                    <div className="flex items-center text-sm">
                      <Home className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="font-medium">Room:</span>
                      <span className="ml-2">{booking.roomNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {facility && (
                <div className="bg-muted p-3 rounded-md">
                  <div className="font-medium">{facility.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {facility.location}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">Schedule:</span>
                    <span className="ml-2">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">Duration:</span>
                    <span className="ml-2">{booking.duration} hours</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="font-medium">Participants:</span>
                    <span className="ml-2">{booking.participants}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timing Information */}
          {(booking.actualCheckIn || booking.actualCheckOut) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Actual Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {booking.actualCheckIn && (
                  <div className="flex justify-between text-sm">
                    <span>Actual check-in:</span>
                    <span className="font-medium">
                      {new Date(booking.actualCheckIn).toLocaleString()}
                    </span>
                  </div>
                )}
                {booking.actualCheckOut && (
                  <div className="flex justify-between text-sm">
                    <span>Actual check-out:</span>
                    <span className="font-medium">
                      {new Date(booking.actualCheckOut).toLocaleString()}
                    </span>
                  </div>
                )}
                {actualDuration && (
                  <div className="flex justify-between text-sm">
                    <span>Actual duration:</span>
                    <span className="font-medium">{actualDuration} hours</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Special Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {booking.specialRequests}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Staff Notes */}
          {booking.staffNotes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Staff Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">{booking.staffNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Booking ID:</span>
                <span>#{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{new Date(booking.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Last updated:</span>
                <span>{new Date(booking.updatedAt).toLocaleString()}</span>
              </div>
              {booking.createdByUserId && (
                <div className="flex justify-between">
                  <span>Created by user:</span>
                  <span>#{booking.createdByUserId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
