"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { getDateFnsLocale } from "@/lib/utils/locale";
import { formatCurrency } from "@/lib/utils/currency";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { type EventBooking } from "@/lib/features/events/types";

interface EventsCalendarProps {
  events: EventBooking[];
}

const statusColors = {
  PLANNED: "bg-blue-100 text-blue-800 border-blue-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
  COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export default function EventsCalendar({ events }: EventsCalendarProps) {
  const t = useTranslations("EventsCalendar");
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);

  const statusLabels: Record<string, string> = {
    PLANNED: t("statusPlanned"),
    CONFIRMED: t("statusConfirmed"),
    IN_PROGRESS: t("statusInProgress"),
    COMPLETED: t("statusCompleted"),
    CANCELLED: t("statusCancelled"),
  };
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Group events by date
  const eventsByDate = (() => {
    const grouped: { [key: string]: EventBooking[] } = {};

    events.forEach((event) => {
      const dateKey = format(parseISO(event.eventDate), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  })();

  // Get events for the selected date
  const selectedDateEvents = (() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return eventsByDate[dateKey] || [];
  })();

  // Function to customize the rendering of days with events
  const eventDates = Object.keys(eventsByDate).map((dateStr) =>
    parseISO(dateStr),
  );
  const modifiers = {
    hasEvents: eventDates,
  };

  const modifiersStyles = {
    hasEvents: {
      backgroundColor: "rgb(59 130 246 / 0.1)",
      border: "1px solid rgb(59 130 246 / 0.2)",
      borderRadius: "6px",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Calendar */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 flex items-center justify-center p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={dateFnsLocale}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-lg border shadow-sm"
                formatters={{
                  formatCaption: (date) =>
                    format(date, "MMMM yyyy", { locale: dateFnsLocale }),
                  formatWeekdayName: (date) =>
                    format(date, "EEEEEE", { locale: dateFnsLocale }),
                }}
              />
            </div>

            {/* Legend */}
            <div className="flex-shrink-0 mt-auto p-6 pt-0">
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">{t("legend")}:</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                  <span>{t("legendDescription")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List of events for selected day */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex-shrink-0">
            <CardTitle>
              {t("eventsFor")}{" "}
              {selectedDate
                ? format(selectedDate, "MMMM d, yyyy", {
                    locale: dateFnsLocale,
                  })
                : t("selectDate")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-6">
            {selectedDateEvents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">{t("noEvents")}</p>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  {t("selectDateWithEvents")}
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="font-semibold text-base truncate">
                          {event.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {event.clientName}
                        </p>
                      </div>
                      <Badge className={statusColors[event.status]}>
                        {statusLabels[event.status]}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">
                          {event.attendees} {t("attendees")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{event.venue.name}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-medium text-green-600">
                        {formatCurrency(event.totalCost)}
                      </span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="px-3">
                            {t("viewDetails")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-base">
                              {event.title}
                            </h4>
                            <div className="text-sm space-y-2">
                              <div>
                                <strong>{t("client")}:</strong>{" "}
                                {event.clientName}
                              </div>
                              <div>
                                <strong>{t("venue")}:</strong>{" "}
                                {event.venue.name}
                              </div>
                              <div>
                                <strong>{t("location")}:</strong>{" "}
                                {event.venue.location}
                              </div>
                              <div>
                                <strong>{t("schedule")}:</strong>{" "}
                                {event.startTime} - {event.endTime}
                              </div>
                              <div>
                                <strong>{t("attendeesLabel")}:</strong>{" "}
                                {event.attendees}
                              </div>
                              <div>
                                <strong>{t("totalCost")}:</strong>{" "}
                                <span className="text-green-600 font-medium">
                                  {formatCurrency(event.totalCost)}
                                </span>
                              </div>
                              {event.notes && (
                                <div>
                                  <strong>{t("notes")}:</strong> {event.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
