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
  const t = useTranslations("FinancialSummary");
  const getVariationBadge = (variation: number) => {
    if (variation > 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <TrendingUp className="mr-1 h-3 w-3" />{t("percentIncrease", { value: variation })}
        </Badge>
      );
    } else if (variation < 0) {
      return (
        <Badge className="bg-red-100 text-red-800">
          <TrendingDown className="mr-1 h-3 w-3" />
          {t("percentValue", { value: variation })}
        </Badge>
      );
    } else {
      return <Badge variant="secondary">{t("percentValue", { value: 0 })}</Badge>;
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("monthlyRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(1847500)}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                {t("revenueChange")}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("operatingExpenses")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(1215800)}</div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600">
                {t("expensesChange")}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("profitMargin")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.2%</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                {t("marginChange")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("financialAnalysis")}</CardTitle>
              <CardDescription>{t("financialAnalysisDesc")}</CardDescription>
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
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("january")}</TableHead>
                <TableHead>{t("december")}</TableHead>
                <TableHead>{t("variation")}</TableHead>
                <TableHead>{t("percentOfTotal")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {t(`categories.${report.category}`)}
                  </TableCell>
                  <TableCell>{formatCurrency(report.january)}</TableCell>
                  <TableCell>{formatCurrency(report.december)}</TableCell>
                  <TableCell>{getVariationBadge(report.variation)}</TableCell>
                  <TableCell>{t("percentValue", { value: report.totalPercentage })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
