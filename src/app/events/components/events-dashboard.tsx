"use client";

import { useState } from "react";
import { toast } from "sonner";
import { type EventBooking as ApiEventBooking } from "@/lib/features/events/types";
import { eventsService } from "@/lib/features/events/service";
import { type Venue as ApiVenue } from "@/lib/features/venues/types";
import { venuesService } from "@/lib/features/venues/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, MapPin, DollarSign, Users } from "lucide-react";
import EventManagement from "./event-management";
import VenueManagement from "./venue-management";
import EventsCalendar from "./events-calendar";

// Use API types
interface EventsDashboardProps {
  initialEvents: ApiEventBooking[];
  initialVenues: ApiVenue[];
}

export default function EventsDashboard({
  initialEvents,
  initialVenues,
}: EventsDashboardProps) {
  const [events, setEvents] = useState(initialEvents);
  const [venues, setVenues] = useState(initialVenues);

  const handleEventAdd = async (eventData: ApiEventBooking) => {
    try {
      // Create the event via API
      const newEvent = await eventsService.create({
        title: eventData.title,
        eventDate: eventData.eventDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        attendees: eventData.attendees,
        totalCost: eventData.totalCost,
        status: eventData.status,
        clientName: eventData.clientName,
        clientEmail: eventData.clientEmail,
        clientPhone: eventData.clientPhone,
        notes: eventData.notes,
        venueId: eventData.venueId,
      });

      // Update local state with the new event from server
      setEvents([...events, newEvent]);
      toast.success("Event created successfully");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event. Please try again.");
    }
  };

  const handleEventUpdate = async (
    eventId: number,
    updates: Partial<ApiEventBooking>,
  ) => {
    try {
      console.log(
        "Dashboard: Updating event with ID:",
        eventId,
        "Updates:",
        updates,
      );
      console.log("Dashboard: Updates keys:", Object.keys(updates));
      console.log(
        "Dashboard: totalCost in updates:",
        "totalCost" in updates,
        updates.totalCost,
      );

      // Update the event via API
      const updatedEvent = await eventsService.update(eventId, updates);

      console.log("Dashboard: Event updated successfully:", updatedEvent);

      // Update local state
      setEvents((prevEvents) => {
        const newEvents = prevEvents.map((event) =>
          event.id === eventId ? updatedEvent : event,
        );
        console.log("Dashboard: Updated events state:", newEvents);
        return newEvents;
      });

      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Dashboard: Error updating event:", error);
      // Show more detailed error information
      if (error instanceof Error) {
        toast.error(`Error updating event: ${error.message}`);
      } else {
        toast.error("Error updating event. Please try again.");
      }
    }
  };

  const handleEventDelete = async (eventId: number) => {
    try {
      // Delete the event via API
      await eventsService.delete(eventId);

      // Update local state
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event. Please try again.");
    }
  };

  const handleVenueAdd = (venue: ApiVenue) => {
    setVenues([...venues, venue]);
  };

  const handleVenueUpdate = async (id: number, updates: Partial<ApiVenue>) => {
    try {
      const updatedVenue = await venuesService.update(id, updates);
      setVenues(
        venues.map((venue) =>
          (typeof venue.id === "string" ? parseInt(venue.id) : venue.id) === id
            ? updatedVenue
            : venue,
        ),
      );
      toast.success("Venue updated successfully");
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.error("Error updating venue. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events and Venues Management</h1>
          <p className="text-muted-foreground">
            Manage events, venues and services
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Events This Month
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter((e) => e.status === "CONFIRMED").length} confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Venues
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {venues.filter((s) => s.available).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Of {venues.length} venues
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${events.reduce((total) => total + 0, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attendees
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce(
                (total, eventItem) => total + eventItem.attendees,
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">People</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="salones">Venues</TabsTrigger>
          <TabsTrigger value="calendario">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <EventManagement
            events={events}
            venues={venues}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
          />
        </TabsContent>

        <TabsContent value="salones" className="space-y-4">
          <VenueManagement
            venues={venues}
            onVenueAdd={handleVenueAdd}
            onVenueUpdate={handleVenueUpdate}
          />
        </TabsContent>

        <TabsContent value="calendario" className="space-y-4">
          <EventsCalendar events={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
