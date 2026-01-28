"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventCreationDialog } from "./event-creation-dialog";
import { EventsTable } from "./events-table";
import { EventBooking as ApiEventBooking } from "@/lib/api/events";
import { Venue as ApiVenue } from "@/lib/api/venues";

// Use API types
type EventBooking = ApiEventBooking;

// Type for data coming from the creation dialog
interface EventBookingData {
  name: string;
  client: string;
  clientEmail: string;
  clientPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  venueId: number;
  capacity: number;
  description?: string;
  totalPrice: number;
}

interface EventManagementProps {
  events: ApiEventBooking[];
  venues: ApiVenue[];
  onEventAdd: (event: ApiEventBooking) => void;
  onEventUpdate: (
    eventId: number,
    updates: Partial<ApiEventBooking>,
  ) => Promise<void>;
  onEventDelete?: (eventId: number) => Promise<void>;
}

export default function EventManagement({
  events,
  venues,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}: EventManagementProps) {
  const [open, setOpen] = useState(false);

  // Transform EventBookingData from dialog to EventBooking for API
  const handleEventAdd = async (eventData: EventBookingData) => {
    try {
      const transformedEvent: Partial<ApiEventBooking> = {
        title: eventData.name,
        description: eventData.description,
        eventDate: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        attendees: eventData.capacity,
        totalCost: eventData.totalPrice,
        status: "PLANNED" as const,
        clientName: eventData.client,
        clientEmail: eventData.clientEmail,
        clientPhone: eventData.clientPhone,
        venueId: eventData.venueId,
      };

      onEventAdd(transformedEvent as ApiEventBooking);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleEventDelete = async (eventId: number) => {
    try {
      if (onEventDelete) {
        await onEventDelete(eventId);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Transform EventBooking to match Event interface for the table
  const transformedEvents = events.map((event) => ({
    id: typeof event.id === "string" ? parseInt(event.id) : event.id,
    title: event.title,
    client: event.clientName || "",
    date: event.eventDate,
    time: `${event.startTime} - ${event.endTime}`,
    venue: event.venue?.name || "",
    capacity: event.attendees,
    services: {
      catering: false,
      audiovisual: false,
      decoration: false,
      accommodation: false,
    },
    budget: event.totalCost || 0,
    status:
      event.status === "CONFIRMED"
        ? "confirmed"
        : event.status === "CANCELLED"
          ? "cancelled"
          : event.status === "COMPLETED"
            ? "completed"
            : "pending",
  }));

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <EventCreationDialog
        open={open}
        onOpenChange={setOpen}
        onEventAdd={handleEventAdd}
        venues={venues.map((v) => ({
          ...v,
          id: typeof v.id === "string" ? parseInt(v.id) : v.id,
          basePrice: v.hourlyRate, // Map hourlyRate to basePrice for compatibility
          description: v.description || "",
        }))}
      />

      <EventsTable
        events={transformedEvents}
        venues={venues.map((v) => v.name)}
        onNewEvent={() => setOpen(true)}
        onEventUpdate={async (id, updates) => {
          console.log("EventManagement: Received updates from table:", updates);

          // Map table format back to EventBooking format
          const mappedUpdates: Partial<EventBooking> = {};

          if (updates.title) {
            mappedUpdates.title = updates.title;
          }

          if (updates.client) {
            mappedUpdates.clientName = updates.client;
          }

          if (updates.date) {
            mappedUpdates.eventDate = updates.date;
          }

          if (updates.time) {
            // Split "HH:MM - HH:MM" format back to startTime and endTime
            const timeParts = updates.time.split(" - ");
            if (timeParts.length === 2) {
              mappedUpdates.startTime = timeParts[0];
              mappedUpdates.endTime = timeParts[1];
            }
          }

          if (updates.venue) {
            // Find venue ID by name
            const venue = venues.find((v) => v.name === updates.venue);
            if (venue) {
              mappedUpdates.venueId =
                typeof venue.id === "string" ? parseInt(venue.id) : venue.id;
            }
          }

          if (updates.capacity !== undefined) {
            mappedUpdates.attendees = updates.capacity;
          }

          if (updates.budget !== undefined) {
            console.log(
              "EventManagement: Mapping budget from",
              updates.budget,
              "to totalCost",
            );
            mappedUpdates.totalCost = parseFloat(updates.budget.toString());
          }

          if (updates.status) {
            mappedUpdates.status =
              updates.status === "confirmed"
                ? "CONFIRMED"
                : updates.status === "cancelled"
                  ? "CANCELLED"
                  : updates.status === "completed"
                    ? "COMPLETED"
                    : "PLANNED";
          }

          console.log(
            "EventManagement: Mapped updates for API:",
            mappedUpdates,
          );
          await onEventUpdate(id, mappedUpdates);
        }}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
}
