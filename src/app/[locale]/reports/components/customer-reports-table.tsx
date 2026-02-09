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
  const t = useTranslations("CustomerReportsTable");
  const getLoyaltyBadge = (loyalty: string) => {
    switch (loyalty) {
      case "Alta":
        return (
          <Badge className="bg-green-100 text-green-800">{t("high")}</Badge>
        );
      case "Media":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">{t("medium")}</Badge>
        );
      case "Baja":
        return <Badge className="bg-red-100 text-red-800">{t("low")}</Badge>;
      default:
        return <Badge variant="secondary">{loyalty}</Badge>;
    }
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
              <TableHead>{t("segment")}</TableHead>
              <TableHead>{t("quantity")}</TableHead>
              <TableHead>{t("averageRevenue")}</TableHead>
              <TableHead>{t("averageStay")}</TableHead>
              <TableHead>{t("satisfaction")}</TableHead>
              <TableHead>{t("loyalty")}</TableHead>
              <TableHead>{t("totalValue")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{t(`segments.${report.segment}`)}</TableCell>
                <TableCell>{report.quantity}</TableCell>
                <TableCell>{formatCurrency(report.averageRevenue)}</TableCell>
                <TableCell>
                  {report.averageStay} {t("days")}
                </TableCell>
                <TableCell>
                  {report.satisfaction}/{t("ratingScale")}
                </TableCell>
                <TableCell>{getLoyaltyBadge(report.loyalty)}</TableCell>
                <TableCell>{formatCurrency(report.totalValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
