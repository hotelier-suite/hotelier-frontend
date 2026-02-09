"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { MaintenanceStats } from "@/lib/features/maintenance/types";

interface MaintenanceStatsCardsProps {
  stats: MaintenanceStats;
}

export default function MaintenanceStatsCards({
  stats,
}: MaintenanceStatsCardsProps) {
  const t = useTranslations("MaintenanceStatsCards");
  const priorityColors = {
    critical: "text-red-600",
    urgent: "text-orange-600",
    high: "text-yellow-600",
    medium: "text-blue-600",
    low: "text-green-600",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("total")}</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {t("registeredRequests")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("scheduled")}
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.scheduled}</div>
          <p className="text-xs text-muted-foreground">{t("awaitingStart")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("inProgress")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgress}</div>
          <p className="text-xs text-muted-foreground">
            {t("currentlyExecuting")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("completed")}
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed}</div>
          <p className="text-xs text-muted-foreground">{t("finished")}</p>
        </CardContent>
      </Card>

      {stats.overdue > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              {t("overdue")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {stats.overdue}
            </div>
            <p className="text-xs text-red-600">{t("requireImmediate")}</p>
          </CardContent>
        </Card>
      )}

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t("byPriority")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className="text-center">
                <div
                  className={`text-lg font-bold ${priorityColors[priority as keyof typeof priorityColors]}`}
                >
                  {count}
                </div>
                <p className="text-xs text-muted-foreground capitalize">
                  {priority === "critical"
                    ? t("critical")
                    : priority === "urgent"
                      ? t("urgent")
                      : priority === "high"
                        ? t("high")
                        : priority === "medium"
                          ? t("medium")
                          : t("low")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
