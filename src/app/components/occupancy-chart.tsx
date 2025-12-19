"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

interface OccupancyData {
  name: string;
  value: number;
  fill: string;
  [key: string]: string | number;
}

interface OccupancyChartProps {
  data: OccupancyData[];
  mounted: boolean;
  occupiedRooms: number;
  availableRooms: number;
}

const chartConfig = {
  occupied: {
    label: "Occupied",
  },
  available: {
    label: "Available",
  },
};

export function OccupancyChart({
  data,
  mounted,
  occupiedRooms,
  availableRooms,
}: OccupancyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Occupancy</CardTitle>
        <CardDescription>Current room distribution</CardDescription>
      </CardHeader>
      <CardContent>
        {mounted ? (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                <span className="text-sm">Occupied ({occupiedRooms})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                <span className="text-sm">Available ({availableRooms})</span>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto aspect-square max-h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
