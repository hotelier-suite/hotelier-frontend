"use client";

import { useEffect, useReducer, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  TrendingUp,
  Users,
  Shield,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { type AuditStatistics } from "@/lib/features/audit/types";
import { auditService } from "@/lib/features/audit/service";
import { format } from "date-fns";
import { getDateFnsLocale, getIntlLocale } from "@/lib/utils/locale";

export function AuditStatistics() {
  const t = useTranslations("AuditStatisticsComp");
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);
  const intlLocale = getIntlLocale(locale);
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(30);
  const [refreshKey, refresh] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await auditService.getStatistics(period);
        setStatistics(data);
      } catch (err: unknown) {
        console.error("Error loading audit statistics:", err);
        setError(t("errorLoadingStats"));
      } finally {
        setLoading(false);
      }
    };
    loadStatistics();
  }, [period, t, refreshKey]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("errorLoadingTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error || t("couldNotLoad")}</p>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7300",
    "#0040FF",
    "#FF0040",
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                {t("title")}
              </CardTitle>
              <CardDescription>{t("analysisDesc", { period })}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={period.toString()}
                onValueChange={(v) => setPeriod(parseInt(v))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">{t("days7")}</SelectItem>
                  <SelectItem value="30">{t("days30")}</SelectItem>
                  <SelectItem value="90">{t("days90")}</SelectItem>
                  <SelectItem value="365">{t("year1")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={refresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalRecords")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.totalLogs.toLocaleString(intlLocale)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("inLastDays", { period })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("activeUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.userStats.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("usersWithActivity")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dailyAverage")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(statistics.totalLogs / period).toLocaleString(
                intlLocale,
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("recordsPerDay")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("actionTypes")}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.actionStats.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("differentActions")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("dailyActivity")}
          </CardTitle>
          <CardDescription>{t("recordsPerDayChart")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statistics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    format(new Date(value), "dd/MM", { locale: dateFnsLocale })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    format(new Date(value), "PPP", { locale: dateFnsLocale })
                  }
                  formatter={(value) => [value, t("records")]}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: "#8884d8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Actions and Resources Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Actions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("mostFrequentActions")}</CardTitle>
            <CardDescription>{t("topActionsByRecords")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.actionStats.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="action"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resources Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("mostAccessedResources")}</CardTitle>
            <CardDescription>{t("accessDistribution")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics.resourceStats.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: { name?: string; percent?: number }) =>
                      `${props.name || ""} ${((props.percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statistics.resourceStats
                      .slice(0, 8)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("mostActiveUsers")}
          </CardTitle>
          <CardDescription>{t("topUsersByActions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statistics.userStats.slice(0, 10).map((user, index) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{user.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {user.userId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{user.count}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("actionsLabel")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
