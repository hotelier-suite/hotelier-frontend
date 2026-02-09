"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, DollarSign, Activity, Users } from "lucide-react";

interface ReportsKPIsProps {
  kpis: {
    averageOccupancy: number;
    revenuePerAvailableRoom: number;
    overallSatisfaction: number;
    averageStayTime: number;
  };
}

export function ReportsKPIs({ kpis }: ReportsKPIsProps) {
  const t = useTranslations("ReportsKPIs");
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("averageOccupancy")}
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{t("percentValue", { value: kpis.averageOccupancy })}</div>
          <p className="text-xs text-muted-foreground">
            {t("occupancyChange")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("revpar")}</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(kpis.revenuePerAvailableRoom)}
          </div>
          <p className="text-xs text-muted-foreground">{t("revparChange")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("overallSatisfaction")}
          </CardTitle>
          <Activity className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {kpis.overallSatisfaction}/{t("ratingScale")}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("satisfactionChange")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("averageStay")}
          </CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {kpis.averageStayTime} {t("days")}
          </div>
          <p className="text-xs text-muted-foreground">{t("stayChange")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
