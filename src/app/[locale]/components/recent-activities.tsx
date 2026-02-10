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

interface Activity {
  time: string;
  activity: string;
  type: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const t = useTranslations("RecentActivities");
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
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
                  ? t("checkIn")
                  : activity.type === "cleaning"
                    ? t("cleaning")
                    : activity.type === "service"
                      ? t("service")
                      : activity.type === "reservation"
                        ? t("reservation")
                        : t("checkOut")}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
