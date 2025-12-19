"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface OccupancyChartProps {
  data: Array<{
    date: string;
    occupancyPercentage: number;
    totalRevenue: number;
  }>;
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy by Date</CardTitle>
        <CardDescription>Hotel occupancy percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#888", fontSize: 12 }}
              tickLine={{ stroke: "#888" }}
            />
            <YAxis
              tick={{ fill: "#888" }}
              tickLine={{ stroke: "#888" }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              formatter={(value: number) => [
                `${value.toFixed(1)}%`,
                "Occupancy",
              ]}
            />
            <Area
              type="monotone"
              dataKey="occupancyPercentage"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorOccupancy)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
