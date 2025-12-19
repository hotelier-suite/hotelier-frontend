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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CustomerReportsTableProps {
  customerReports: Array<{
    segment: string;
    quantity: number;
    averageRevenue: number;
    averageStay: number;
    satisfaction: number;
    loyalty: string;
    totalValue: number;
  }>;
  onExport: () => void;
}

export function CustomerReportsTable({
  customerReports,
  onExport,
}: CustomerReportsTableProps) {
  const getLoyaltyBadge = (loyalty: string) => {
    switch (loyalty) {
      case "Alta":
        return <Badge className="bg-green-100 text-green-800">High</Badge>;
      case "Media":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "Baja":
        return <Badge className="bg-red-100 text-red-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{loyalty}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Customer Segment Analysis</CardTitle>
            <CardDescription>
              Behavior and value by segment
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segment</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Average Revenue</TableHead>
              <TableHead>Average Stay</TableHead>
              <TableHead>Satisfaction</TableHead>
              <TableHead>Loyalty</TableHead>
              <TableHead>Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{report.segment}</TableCell>
                <TableCell>{report.quantity}</TableCell>
                <TableCell>${report.averageRevenue.toLocaleString()}</TableCell>
                <TableCell>{report.averageStay} days</TableCell>
                <TableCell>{report.satisfaction}/5.0</TableCell>
                <TableCell>{getLoyaltyBadge(report.loyalty)}</TableCell>
                <TableCell>${report.totalValue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
