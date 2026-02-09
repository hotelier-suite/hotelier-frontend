"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
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
  const t = useTranslations("OccupancyDetailsTable");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("roomType")}</TableHead>
              <TableHead>{t("total")}</TableHead>
              <TableHead>{t("occupied")}</TableHead>
              <TableHead>{t("available")}</TableHead>
              <TableHead>{t("occupancyPercent")}</TableHead>
              <TableHead>{t("averageRate")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occupancyReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{t(`roomTypes.${report.roomType}`)}</TableCell>
                <TableCell>{report.totalRooms}</TableCell>
                <TableCell>{report.occupiedRooms}</TableCell>
                <TableCell>{report.availableRooms}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={report.occupancyPercentage}
                      className="w-16 h-2"
                    />
                    <span>{t("percentValue", { value: report.occupancyPercentage })}</span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(report.averageRate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
