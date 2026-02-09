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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface OperationalReportTableProps {
  operationalReports: Array<{
    department: string;
    checkInsCompleted?: number;
    checkOutsCompleted?: number;
    roomsCleaned?: number;
    roomsOutOfOrder?: number;
    customersServed?: number;
    requestsHandled?: number;
    pendingRequests?: number;
    averageCheckInTime?: string;
    averageCleaningTime?: string;
    averageServiceTime?: string;
    averageResponseTime?: string;
    customerSatisfaction: number;
    reportedIncidents: number;
    averageSalesPerTable?: number;
  }>;
  onExport: () => void;
}

export function OperationalReportTable({
  operationalReports,
  onExport,
}: OperationalReportTableProps) {
  const t = useTranslations("OperationalReportTable");

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 4.5) return "bg-green-600";
    if (satisfaction >= 4.0) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("department")}</TableHead>
              <TableHead>{t("mainActivity")}</TableHead>
              <TableHead>{t("averageTime")}</TableHead>
              <TableHead>{t("satisfaction")}</TableHead>
              <TableHead>{t("incidents")}</TableHead>
              <TableHead>{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operationalReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {t(`departments.${report.department}`)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {report.department === "Reception" && (
                      <div>
                        <div>
                          {t("checkIns")}: {report.checkInsCompleted}
                        </div>
                        <div>
                          {t("checkOuts")}: {report.checkOutsCompleted}
                        </div>
                      </div>
                    )}
                    {report.department === "Housekeeping" && (
                      <div>
                        <div>
                          {t("roomsCleaned")}: {report.roomsCleaned}
                        </div>
                        <div>
                          {t("outOfService")}: {report.roomsOutOfOrder}
                        </div>
                      </div>
                    )}
                    {report.department === "Restaurant" && (
                      <div>
                        <div>
                          {t("customers")}: {report.customersServed}
                        </div>
                        <div>
                          {t("avgSale")}:{" "}
                          {formatCurrency(report.averageSalesPerTable ?? 0)}
                        </div>
                      </div>
                    )}
                    {report.department === "Maintenance" && (
                      <div>
                        <div>
                          {t("handled")}: {report.requestsHandled}
                        </div>
                        <div>
                          {t("pending")}: {report.pendingRequests}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {report.department === "Reception" &&
                    report.averageCheckInTime}
                  {report.department === "Housekeeping" &&
                    report.averageCleaningTime}
                  {report.department === "Restaurant" &&
                    report.averageServiceTime}
                  {report.department === "Maintenance" &&
                    report.averageResponseTime}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getSatisfactionColor(
                          report.customerSatisfaction,
                        )}`}
                        style={{
                          width: `${(report.customerSatisfaction / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      {report.customerSatisfaction}
                      {t("ratingScale")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      report.reportedIncidents > 5 ? "destructive" : "secondary"
                    }
                  >
                    {report.reportedIncidents}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      report.customerSatisfaction >= 4.0 &&
                      report.reportedIncidents <= 5
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {report.customerSatisfaction >= 4.0 &&
                    report.reportedIncidents <= 5
                      ? t("optimal")
                      : t("needsImprovement")}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
