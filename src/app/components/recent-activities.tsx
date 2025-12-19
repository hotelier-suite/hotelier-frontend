"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  time: string;
  activity: string;
  type: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest hotel activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground min-w-[50px]">
                {activity.time}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.activity}</p>
              </div>
              <Badge
                variant={
                  activity.type === "checkin"
                    ? "default"
                    : activity.type === "cleaning"
                      ? "secondary"
                      : activity.type === "service"
                        ? "outline"
                        : activity.type === "reservationtion"
                          ? "default"
                          : "destructive"
                }
              >
                {activity.type === "checkin"
                  ? "Check-in"
                  : activity.type === "cleaning"
                    ? "Cleaning"
                    : activity.type === "service"
                      ? "Service"
                      : activity.type === "reservation"
                        ? "Reservation"
                        : "Check-out"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
