"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface RevenueBreakdownChartProps {
  data: {
    room: number;
    restaurant: number;
    services: number;
    events: number;
  };
}

const COLORS = {
  room: "#3b82f6",
  restaurant: "#f59e0b",
  services: "#10b981",
  events: "#8b5cf6",
};

export function RevenueBreakdownChart({ data }: RevenueBreakdownChartProps) {
  const t = useTranslations("RevenueBreakdownChart");
  const chartData = [
    { name: t("rooms"), value: data.room, color: COLORS.room },
    {
      name: t("restaurant"),
      value: data.restaurant,
      color: COLORS.restaurant,
    },
    { name: t("services"), value: data.services, color: COLORS.services },
    { name: t("events"), value: data.events, color: COLORS.events },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: { name?: string; percent?: number }) =>
                `${props.name || ""}: ${t("percentValue", { value: ((props.percent || 0) * 100).toFixed(0) })}`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                formatCurrency(value),
                t("amount"),
              ]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
