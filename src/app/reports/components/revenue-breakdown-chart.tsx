"use client";

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

const NAMES = {
  room: "Rooms",
  restaurant: "Restaurant",
  services: "Services",
  events: "Events",
};

export function RevenueBreakdownChart({ data }: RevenueBreakdownChartProps) {
  const chartData = [
    { name: NAMES.room, value: data.room, color: COLORS.room },
    {
      name: NAMES.restaurant,
      value: data.restaurant,
      color: COLORS.restaurant,
    },
    { name: NAMES.services, value: data.services, color: COLORS.services },
    { name: NAMES.events, value: data.events, color: COLORS.events },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Distribution</CardTitle>
        <CardDescription>Revenue breakdown by category</CardDescription>
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
                `${props.name || ""}: ${((props.percent || 0) * 100).toFixed(0)}%`
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
                `$${value.toLocaleString()}`,
                "Amount",
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
