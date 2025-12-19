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
import { UserCheck } from "lucide-react";

interface DepartmentStats {
  department: string;
  activeCount: number;
  totalCount: number;
}

interface EmployeesPieChartProps {
  departmentStats: DepartmentStats[];
}

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f97316", // orange
];

const DEPARTMENT_NAMES: Record<string, string> = {
  FRONT_DESK: "Front Desk",
  HOUSEKEEPING: "Housekeeping",
  MAINTENANCE: "Maintenance",
  RESTAURANT: "Restaurant",
  MANAGEMENT: "Management",
  SECURITY: "Security",
  VALET: "Valet",
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
  if (percent < 0.05) return null;

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
    payload: {
      name: string;
      value: number;
      activeCount: number;
      inactiveCount: number;
    };
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const activePercentage = ((data.activeCount / data.value) * 100).toFixed(0);
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-sm mb-1">{data.name}</p>
        <p className="text-sm text-gray-600">
          Total: <span className="font-medium">{data.value} employees</span>
        </p>
        <p className="text-sm text-green-600">
          ✓ {data.activeCount} active ({activePercentage}%)
        </p>
        {data.inactiveCount > 0 && (
          <p className="text-sm text-gray-500">
            ○ {data.inactiveCount} inactive
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function EmployeesPieChart({ departmentStats }: EmployeesPieChartProps) {
  const chartData = departmentStats
    .filter((dept) => dept.totalCount > 0)
    .map((dept) => ({
      name: DEPARTMENT_NAMES[dept.department] || dept.department,
      value: dept.totalCount,
      activeCount: dept.activeCount,
      inactiveCount: dept.totalCount - dept.activeCount,
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Staff Distribution by Department
          </CardTitle>
          <CardDescription>Number of employees by area</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <p className="text-muted-foreground">
            No employee data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Staff Distribution by Department
        </CardTitle>
        <CardDescription>Number of employees by area</CardDescription>
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
