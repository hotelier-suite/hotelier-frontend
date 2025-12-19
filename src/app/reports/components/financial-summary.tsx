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
import { Download, TrendingUp, TrendingDown } from "lucide-react";

interface FinancialSummaryProps {
  financialReports: Array<{
    category: string;
    january: number;
    december: number;
    variation: number;
    totalPercentage: number;
  }>;
  onExport: () => void;
}

export function FinancialSummary({
  financialReports,
  onExport,
}: FinancialSummaryProps) {
  const getVariationBadge = (variation: number) => {
    if (variation > 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <TrendingUp className="mr-1 h-3 w-3" />+{variation}%
        </Badge>
      );
    } else if (variation < 0) {
      return (
        <Badge className="bg-red-100 text-red-800">
          <TrendingDown className="mr-1 h-3 w-3" />
          {variation}%
        </Badge>
      );
    } else {
      return <Badge variant="secondary">0%</Badge>;
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,847,500</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                +12.5% vs previous month
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,215,800</div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600">
                +2.1% vs previous month
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.2%</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                +1.8% vs previous month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Financial Analysis by Category</CardTitle>
              <CardDescription>
                Revenue breakdown and monthly variations
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
                <TableHead>Category</TableHead>
                <TableHead>January</TableHead>
                <TableHead>December</TableHead>
                <TableHead>Variation</TableHead>
                <TableHead>% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {report.category}
                  </TableCell>
                  <TableCell>
                    ${(report.january / 1000000).toFixed(1)}M
                  </TableCell>
                  <TableCell>
                    ${(report.december / 1000000).toFixed(1)}M
                  </TableCell>
                  <TableCell>{getVariationBadge(report.variation)}</TableCell>
                  <TableCell>{report.totalPercentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
