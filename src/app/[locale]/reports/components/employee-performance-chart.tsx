"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Award } from "lucide-react";
import { type Employee } from "@/lib/features/employees/types";

interface EmployeePerformanceChartProps {
  employees: Employee[];
}

const DEPARTMENT_KEYS: Record<string, string> = {
  FRONT_DESK: "departmentFrontDesk",
  HOUSEKEEPING: "departmentHousekeeping",
  MAINTENANCE: "departmentMaintenance",
  RESTAURANT: "departmentRestaurant",
  MANAGEMENT: "departmentManagement",
  SECURITY: "departmentSecurity",
  VALET: "departmentValet",
};

const getBarColor = (rate: number) => {
  if (rate >= 80) return "#10b981"; // green
  if (rate >= 60) return "#f59e0b"; // amber
  return "#ef4444"; // red
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      position: string;
      department: string;
      completionRate: number;
      completed: number;
      pending: number;
      assigned: number;
      efficiency: string;
      labelCompletionRate: string;
      labelCompleted: string;
      labelPending: string;
      labelTotalAssigned: string;
      labelPerformance: string;
    };
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-sm mb-1">{data.name}</p>
        <p className="text-xs text-gray-500 mb-2">
          {data.position} - {data.department}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            {data.labelCompletionRate}:{" "}
            <span
              className="font-bold"
              style={{ color: getBarColor(data.completionRate) }}
            >
              {data.completionRate}%
            </span>
          </p>
          <p className="text-sm text-green-600">
            ✓ {data.labelCompleted}:{" "}
            <span className="font-medium">{data.completed}</span>
          </p>
          <p className="text-sm text-orange-600">
            ⏳ {data.labelPending}:{" "}
            <span className="font-medium">{data.pending}</span>
          </p>
          <p className="text-sm text-gray-600">
            {data.labelTotalAssigned}:{" "}
            <span className="font-medium">{data.assigned}</span>
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
          {data.labelPerformance}:{" "}
          <span className="font-medium">{data.efficiency}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function EmployeePerformanceChart({
  employees,
}: EmployeePerformanceChartProps) {
  const t = useTranslations("EmployeePerformanceChart");
  // Filter employees with performance data (those who have assigned rooms)
  const performanceData = employees
    .filter((emp) => (emp.assignedRooms || 0) > 0)
    .map((emp) => {
      const assigned = emp.assignedRooms || 0;
      const completed = emp.completedRooms || 0;
      const completionRate = assigned > 0 ? (completed / assigned) * 100 : 0;

      return {
        name: emp.name,
        employeeId: emp.employeeId,
        department: DEPARTMENT_KEYS[emp.department]
          ? t(DEPARTMENT_KEYS[emp.department])
          : emp.department,
        position: t(`positions.${emp.position}`),
        assigned,
        completed,
        pending: assigned - completed,
        completionRate: Math.round(completionRate),
        efficiency:
          completionRate >= 80
            ? t("excellent")
            : completionRate >= 60
              ? t("good")
              : t("regular"),
        labelCompletionRate: t("tooltipCompletionRate"),
        labelCompleted: t("tooltipCompleted"),
        labelPending: t("tooltipPending"),
        labelTotalAssigned: t("tooltipTotalAssigned"),
        labelPerformance: t("tooltipPerformance"),
      };
    })
    .sort((a, b) => b.completionRate - a.completionRate);

  if (performanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <p className="text-muted-foreground">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average performance
  const avgPerformance =
    performanceData.length > 0
      ? Math.round(
          performanceData.reduce((acc, emp) => acc + emp.completionRate, 0) /
            performanceData.length,
        )
      : 0;

  const topPerformer = performanceData[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                {t("average")}: {t("percentValue", { value: avgPerformance })}
              </span>
            </div>
            {topPerformer && (
              <div className="text-xs text-muted-foreground">
                {t("top")}: {topPerformer.name} ({t("percentValue", { value: topPerformer.completionRate })})
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={performanceData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{
                value: t("completionRate"),
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 12 },
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="completionRate" radius={[0, 4, 4, 0]}>
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.completionRate)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Performance Legend */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">{t("excellentLabel")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-muted-foreground">{t("goodLabel")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-muted-foreground">{t("regularLabel")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
