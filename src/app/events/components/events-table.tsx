import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Edit, Trash, Check } from "lucide-react";
import { EditEventDialog } from "./edit-event-dialog";
import { DeleteEventDialog } from "./delete-event-dialog";

interface Event {
  id: number;
  title: string;
  client: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  services: {
    catering: boolean;
    audiovisual: boolean;
    decoration: boolean;
    accommodation: boolean;
  };
  budget: number;
  status: string;
}

interface EventsTableProps {
  events: Event[];
  venues?: string[];
  onEventUpdate?: (id: number, updates: Partial<Event>) => Promise<void>;
  onEventDelete?: (id: number) => Promise<void>;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    case "completed":
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const calculateTotalBudget = (event: Event) => {
  let total = event.budget;
  if (event.services.catering) total += event.budget * 0.3;
  if (event.services.audiovisual) total += event.budget * 0.15;
  if (event.services.decoration) total += event.budget * 0.1;
  if (event.services.accommodation) total += event.budget * 0.25;
  return total;
};

export function EventsTable({
  events,
  venues,
  onEventUpdate,
  onEventDelete,
}: EventsTableProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setDeletingEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleEventUpdate = async (id: number, updates: Partial<Event>) => {
    await onEventUpdate?.(id, updates);
    setEditDialogOpen(false);
    setEditingEvent(null);
  };

  const handleEventDelete = async (id: number) => {
    await onEventDelete?.(id);
    setDeleteDialogOpen(false);
    setDeletingEvent(null);
  };
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Scheduled Events</CardTitle>
          <CardDescription>
            Manage hotel events and reservations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.client}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {event.date}
                    </div>
                  </TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>{event.capacity} people</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {event.services.catering && (
                        <Badge variant="outline" className="text-xs">
                          Catering
                        </Badge>
                      )}
                      {event.services.audiovisual && (
                        <Badge variant="outline" className="text-xs">
                          A/V
                        </Badge>
                      )}
                      {event.services.decoration && (
                        <Badge variant="outline" className="text-xs">
                          Decoration
                        </Badge>
                      )}
                      {event.services.accommodation && (
                        <Badge variant="outline" className="text-xs">
                          Accommodation
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        ${calculateTotalBudget(event).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Base: ${event.budget.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {event.status !== "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() =>
                            onEventUpdate?.(event.id, { status: "confirmed" })
                          }
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Confirm
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleEditClick(event)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(event)}
                      >
                        <Trash className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditEventDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={editingEvent}
        onEventUpdate={handleEventUpdate}
        venues={venues}
      />

      <DeleteEventDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        event={deletingEvent}
        onEventDelete={handleEventDelete}
      />
    </>
  );
}
