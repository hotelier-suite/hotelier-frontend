"use client";

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
} from "recharts";
import { TrendingUp } from "lucide-react";

interface InventoryStockLevelsChartProps {
  categoryStats: Record<
    string,
    { count: number; value: number; lowStock: number }
  >;
}

const CATEGORY_NAMES: Record<string, string> = {
  LINENS: "Linens",
  AMENITIES: "Amenities",
  CLEANING_SUPPLIES: "Supplies",
  ELECTRONICS: "Electronics",
  FOOD_BEVERAGE: "Food",
  FURNITURE: "Furniture",
  MAINTENANCE: "Maintenance",
  OTHER: "Other",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, item) => sum + item.value, 0);
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-sm mb-2">{label}</p>
        <p className="text-xs text-gray-600 mb-2">Total: {total} products</p>
        {payload.map((item, index: number) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.name}: <span className="font-medium">{item.value}</span> (
            {((item.value / total) * 100).toFixed(0)}%)
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function InventoryStockLevelsChart({
  categoryStats,
}: InventoryStockLevelsChartProps) {
  // Calculate stock levels for each category
  const chartData = Object.entries(categoryStats).map(([category, stats]) => {
    const lowStock = stats.lowStock;
    const normalStock = Math.floor((stats.count - stats.lowStock) * 0.6); // 60% of remaining is normal
    const sufficientStock = stats.count - stats.lowStock - normalStock; // rest is sufficient

    return {
      category: CATEGORY_NAMES[category] || category.replace(/_/g, " "),
      "Low Stock": lowStock,
      "Normal Stock": normalStock,
      "Sufficient Stock": sufficientStock,
      total: stats.count,
    };
  });

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Stock Levels by Category
          </CardTitle>
          <CardDescription>
            Product distribution by stock level
          </CardDescription>
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
          <TrendingUp className="h-5 w-5" />
          Stock Levels by Category
        </CardTitle>
        <CardDescription>
          Product distribution by stock level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: "Product Quantity",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12 },
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="Low Stock"
              stackId="a"
              fill="#ef4444"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Normal Stock"
              stackId="a"
              fill="#f59e0b"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Sufficient Stock"
              stackId="a"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-muted-foreground">Low Stock (critical)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-muted-foreground">Normal Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Sufficient Stock</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
