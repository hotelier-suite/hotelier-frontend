"use client";

import { useEffect, useState } from "react";
import EventsDashboard from "./components/events-dashboard";
import { type EventBooking } from "@/lib/features/events/types";
import { eventsService } from "@/lib/features/events/service";
import { type Venue } from "@/lib/features/venues/types";
import { venuesService } from "@/lib/features/venues/service";

interface EventsData {
  events: EventBooking[];
  venues: Venue[];
}

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EventsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data from API
        const [events, venues] = await Promise.all([
          eventsService.getAll(),
          venuesService.getAll(),
        ]);

        console.log("Loaded data from API:", { events, venues });
        setData({ events, venues });
        setError(null);
      } catch (error) {
        console.error("Error fetching events data:", error);
        setError("Error loading events data from database");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <EventsDashboard
        initialEvents={data.events}
        initialVenues={data.venues}
      />
    </div>
  );
}
