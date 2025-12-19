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

interface SalesTableProps {
  sales: Array<{
    date: string;
    roomService: number;
    diningRoom: number;
    bar: number;
    total: number;
    orders: number;
  }>;
}

export function SalesTable({ sales }: SalesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Report</CardTitle>
        <CardDescription>Sales analysis by area and period</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Room Service</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Bar</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Average</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{sale.date}</TableCell>
                <TableCell>${sale.roomService.toLocaleString()}</TableCell>
                <TableCell>${sale.diningRoom.toLocaleString()}</TableCell>
                <TableCell>${sale.bar.toLocaleString()}</TableCell>
                <TableCell className="font-bold">
                  ${sale.total.toLocaleString()}
                </TableCell>
                <TableCell>{sale.orders}</TableCell>
                <TableCell>
                  ${Math.round(sale.total / sale.orders).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
