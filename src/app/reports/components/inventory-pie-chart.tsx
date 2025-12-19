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
import { Package } from "lucide-react";

interface InventoryPieChartProps {
  categoryStats: Record<
    string,
    { count: number; value: number; lowStock: number }
  >;
}

const COLORS = [
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#10b981", // green
  "#8b5cf6", // purple
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ec4899", // pink
];

const CATEGORY_NAMES: Record<string, string> = {
  LINENS: "Linens",
  AMENITIES: "Amenities",
  CLEANING_SUPPLIES: "Cleaning Supplies",
  ELECTRONICS: "Electronics",
  FOOD_BEVERAGE: "Food & Beverage",
  FURNITURE: "Furniture",
  MAINTENANCE: "Maintenance",
  OTHER: "Other",
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  if (percent < 0.05) return null; // Don't show label if less than 5%

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: { name: string; value: number; count: number; lowStock: number };
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-sm mb-1">{data.name}</p>
        <p className="text-sm text-gray-600">
          Value:{" "}
          <span className="font-medium">${data.value.toLocaleString()}</span>
        </p>
        <p className="text-sm text-gray-600">
          Products: <span className="font-medium">{data.count}</span>
        </p>
        {data.lowStock > 0 && (
          <p className="text-sm text-orange-600">
            ⚠️ {data.lowStock} with low stock
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function InventoryPieChart({ categoryStats }: InventoryPieChartProps) {
  const chartData = Object.entries(categoryStats).map(([category, stats]) => ({
    name: CATEGORY_NAMES[category] || category.replace(/_/g, " "),
    value: stats.value,
    count: stats.count,
    lowStock: stats.lowStock,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Distribution by Category
          </CardTitle>
          <CardDescription>Inventory value by category</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <p className="text-muted-foreground">
            No inventory data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Distribution by Category
        </CardTitle>
        <CardDescription>Inventory value by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={
                renderCustomLabel as unknown as typeof Pie.prototype.props.label
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
