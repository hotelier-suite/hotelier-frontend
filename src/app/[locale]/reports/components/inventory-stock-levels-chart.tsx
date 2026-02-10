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
} from "recharts";
import { TrendingUp } from "lucide-react";

interface InventoryStockLevelsChartProps {
  categoryStats: Record<
    string,
    { count: number; value: number; lowStock: number }
  >;
}

const CATEGORY_KEYS: Record<string, string> = {
  LINENS: "linens",
  AMENITIES: "amenities",
  CLEANING_SUPPLIES: "supplies",
  ELECTRONICS: "electronics",
  FOOD_BEVERAGE: "food",
  FURNITURE: "furniture",
  MAINTENANCE: "maintenance",
  OTHER: "other",
};

function CustomTooltip({
  active,
  payload,
  label,
  t,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  t: (key: string, values?: Record<string, string | number | Date>) => string;
}) {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, item) => sum + item.value, 0);
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-sm mb-2">{label}</p>
        <p className="text-xs text-gray-600 mb-2">
          {t("totalProducts", { total })}
        </p>
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
}

export function InventoryStockLevelsChart({
  categoryStats,
}: InventoryStockLevelsChartProps) {
  const t = useTranslations("InventoryStockLevelsChart");

  // Calculate stock levels for each category
  const chartData = Object.entries(categoryStats).map(([category, stats]) => {
    const lowStock = stats.lowStock;
    const normalStock = Math.floor((stats.count - stats.lowStock) * 0.6); // 60% of remaining is normal
    const sufficientStock = stats.count - stats.lowStock - normalStock; // rest is sufficient

    return {
      category: t(CATEGORY_KEYS[category] || "other"),
      [t("lowStock")]: lowStock,
      [t("normalStock")]: normalStock,
      [t("sufficientStock")]: sufficientStock,
      total: stats.count,
    };
  });

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
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
                value: t("productQuantity"),
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12 },
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip t={t} />} />
            <Bar
              dataKey={t("lowStock")}
              stackId="a"
              fill="#ef4444"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey={t("normalStock")}
              stackId="a"
              fill="#f59e0b"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey={t("sufficientStock")}
              stackId="a"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-muted-foreground">{t("lowStockLabel")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-muted-foreground">
              {t("normalStockLabel")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">
              {t("sufficientStockLabel")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
