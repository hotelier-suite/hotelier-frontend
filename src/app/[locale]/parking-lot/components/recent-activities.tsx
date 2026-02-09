"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { formatCurrency } from "@/lib/utils/currency";

interface ParkingActivity {
  id: string;
  action: "entry" | "exit";
  licensePlate: string;
  ownerName: string;
  room?: string;
  spaceNumber: string;
  timestamp: string;
  duration?: string;
  amount?: number;
}

interface ParkingRecentActivitiesProps {
  activities: ParkingActivity[];
}

export function ParkingRecentActivities({
  activities,
}: ParkingRecentActivitiesProps) {
  const t = useTranslations("ParkingRecentActivities");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant={activity.action === "entry" ? "default" : "outline"}
                >
                  {activity.action === "entry" ? t("entry") : t("exit")}
                </Badge>
                <div>
                  <p className="font-medium">
                    {activity.licensePlate} - {activity.ownerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("space")} {activity.spaceNumber}
                    {activity.room && ` • ${t("room")} ${activity.room}`}
                    {activity.duration && ` • ${activity.duration}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {new Date(activity.timestamp).toLocaleString(intlLocale)}
                </p>
                {activity.amount && (
                  <p className="text-sm font-medium">
                    {formatCurrency(activity.amount)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
