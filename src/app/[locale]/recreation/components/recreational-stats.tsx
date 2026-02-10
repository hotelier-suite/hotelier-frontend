"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Clock, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recreationalService } from "@/lib/features/recreational/service";
import type { BookingStatistics } from "@/lib/features/recreational/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function RecreationalStats() {
  const t = useTranslations("RecreationalStats");
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>("30"); // Last 30 days

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const data = await recreationalService.getStatistics(
          startDate.toISOString().split("T")[0],
          endDate,
        );

        setStats(data);
      } catch (error) {
        console.error("Error loading statistics:", error);
        toast.error(t("errorLoading"));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period, t]);

  const formatPercentage = (value: number) => {
    return t("percentValue", { value: Math.round(value * 100) / 100 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "CONFIRMED":
        return "bg-blue-500";
      case "PENDING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      case "CHECKED_IN":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      COMPLETED: t("statusCompleted"),
      CONFIRMED: t("statusConfirmed"),
      PENDING: t("statusPending"),
      CANCELLED: t("statusCancelled"),
      CHECKED_IN: t("statusInProgress"),
      NO_SHOW: t("statusNoShow"),
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{t("title")}</h3>
          <Select disabled>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("loading")} />
            </SelectTrigger>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">{t("noData")}</CardTitle>
            <CardDescription className="text-center">
              {t("noDataDescription")}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{t("last7Days")}</SelectItem>
            <SelectItem value="30">{t("last30Days")}</SelectItem>
            <SelectItem value="90">{t("last90Days")}</SelectItem>
            <SelectItem value="365">{t("lastYear")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalBookings")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {t("days", { count: period })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("popularFacility")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {t(`facilityTypes.${stats.mostPopularFacilityType}`)}
            </div>
            <p className="text-xs text-muted-foreground">{t("mostBooked")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("peakHour")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.peakHour}:00</div>
            <p className="text-xs text-muted-foreground">
              {t("highestActivity")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="facilities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="facilities">{t("byFacility")}</TabsTrigger>
          <TabsTrigger value="status">{t("byStatus")}</TabsTrigger>
          <TabsTrigger value="performance">{t("performance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("usageByFacility")}</CardTitle>
              <CardDescription>
                {t("usageByFacilityDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.facilitiesUsage.map((facility) => (
                  <div key={facility.facilityName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {facility.facilityName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {facility.totalBookings} {t("bookings")} •{" "}
                          {facility.totalHoursBooked}
                          {t("hoursUnit")} {t("totalLabel")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatPercentage(facility.utilizationRate)}{" "}
                          {t("utilization")}
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={facility.utilizationRate}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("bookingStatus")}</CardTitle>
                <CardDescription>{t("distributionByStatus")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.statusBreakdown).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}
                          />
                          <span className="text-sm font-medium">
                            {getStatusLabel(status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{count}</span>
                          <Badge variant="outline" className="text-xs">
                            {formatPercentage(
                              (count / stats.totalBookings) * 100,
                            )}
                          </Badge>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("performanceMetrics")}</CardTitle>
                <CardDescription>{t("keyIndicators")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("confirmationRate")}</span>
                    <span className="font-medium">
                      {formatPercentage(
                        (((stats.statusBreakdown.confirmed || 0) +
                          (stats.statusBreakdown.completed || 0)) /
                          stats.totalBookings) *
                          100,
                      )}
                    </span>
                  </div>
                  <Progress
                    value={
                      (((stats.statusBreakdown.confirmed || 0) +
                        (stats.statusBreakdown.completed || 0)) /
                        stats.totalBookings) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("cancellationRate")}</span>
                    <span className="font-medium">
                      {formatPercentage(
                        (((stats.statusBreakdown.cancelled || 0) +
                          (stats.statusBreakdown.noShow || 0)) /
                          stats.totalBookings) *
                          100,
                      )}
                    </span>
                  </div>
                  <Progress
                    value={
                      (((stats.statusBreakdown.cancelled || 0) +
                        (stats.statusBreakdown.noShow || 0)) /
                        stats.totalBookings) *
                      100
                    }
                    className="h-2 [&>div]:bg-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("completedBookings")}</span>
                    <span className="font-medium">
                      {formatPercentage(
                        ((stats.statusBreakdown.completed || 0) /
                          stats.totalBookings) *
                          100,
                      )}
                    </span>
                  </div>
                  <Progress
                    value={
                      ((stats.statusBreakdown.completed || 0) /
                        stats.totalBookings) *
                      100
                    }
                    className="h-2 [&>div]:bg-green-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("facilityRanking")}</CardTitle>
              <CardDescription>{t("sortedByUtilization")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("rank")}</TableHead>
                    <TableHead>{t("facilityHead")}</TableHead>
                    <TableHead>{t("bookingsHead")}</TableHead>
                    <TableHead>{t("hoursHead")}</TableHead>
                    <TableHead>{t("utilizationHead")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.facilitiesUsage
                    .sort((a, b) => b.utilizationRate - a.utilizationRate)
                    .map((facility, index) => (
                      <TableRow key={facility.facilityName}>
                        <TableCell>
                          <div className="flex items-center">
                            <Badge
                              variant={index < 3 ? "default" : "outline"}
                              className={
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                      ? "bg-orange-600"
                                      : ""
                              }
                            >
                              #{index + 1}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {facility.facilityName}
                        </TableCell>
                        <TableCell>{facility.totalBookings}</TableCell>
                        <TableCell>
                          {facility.totalHoursBooked}
                          {t("hoursUnit")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={facility.utilizationRate}
                              className="w-20 h-2"
                            />
                            <span className="text-xs">
                              {formatPercentage(facility.utilizationRate)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
