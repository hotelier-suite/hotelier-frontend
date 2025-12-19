"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface OccupancyDetailsTableProps {
  occupancyReports: Array<{
    roomType: string;
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    occupancyPercentage: number;
    averageRate: number;
  }>;
}

export function OccupancyDetailsTable({
  occupancyReports,
}: OccupancyDetailsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Details by Room</CardTitle>
        <CardDescription>
          Detailed occupancy and reservations status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Occupied</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Occupancy %</TableHead>
              <TableHead>Average Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occupancyReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{report.roomType}</TableCell>
                <TableCell>{report.totalRooms}</TableCell>
                <TableCell>{report.occupiedRooms}</TableCell>
                <TableCell>{report.availableRooms}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={report.occupancyPercentage}
                      className="w-16 h-2"
                    />
                    <span>{report.occupancyPercentage}%</span>
                  </div>
                </TableCell>
                <TableCell>${report.averageRate.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
