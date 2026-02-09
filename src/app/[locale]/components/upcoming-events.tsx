"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface Event {
  event: string;
  date: string;
  attendees?: number;
}

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const t = useTranslations("UpcomingEvents");
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm font-medium">{event.event}</div>
              <div className="text-xs text-muted-foreground">{event.date}</div>
              <div className="text-xs">
                <Badge variant="outline">
                  {event.attendees ?? 0} {t("attendees")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
