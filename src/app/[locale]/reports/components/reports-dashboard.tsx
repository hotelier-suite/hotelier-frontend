"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { ReportsKPIs } from "./reports-kpis";
import { OccupancyCharts } from "./occupancy-charts";
import { OccupancyDetailsTable } from "./occupancy-details-table";
import { FinancialSummary } from "./financial-summary";
import { OperationalReportTable } from "./operational-report-table";
import { CustomerReportsTable } from "./customer-reports-table";

interface ReportsData {
  occupancyReports: Array<{
    roomType: string;
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    occupancyPercentage: number;
    averageRate: number;
  }>;
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
  customerReports: Array<{
    segment: string;
    quantity: number;
    averageRevenue: number;
    averageStay: number;
    satisfaction: number;
    loyalty: string;
    totalValue: number;
  }>;
  financialReports: Array<{
    category: string;
    january: number;
    december: number;
    variation: number;
    totalPercentage: number;
  }>;
  generalKpis: {
    averageOccupancy: number;
    revenuePerAvailableRoom: number;
    revenuePerOccupiedRoom: number;
    overallSatisfaction: number;
    averageStayTime: number;
    repeatRate: number;
    customerAcquisitionCost: number;
    customerLifetimeValue: number;
  };
}

interface ReportsDashboardProps {
  initialData: ReportsData;
}

export default function ReportsDashboard({
  initialData,
}: ReportsDashboardProps) {
  const t = useTranslations("ReportsDashboard");
  const [occupancyReports] = useState(initialData.occupancyReports);
  const [operationalReports] = useState(initialData.operationalReports);
  const [customerReports] = useState(initialData.customerReports);
  const [financialReports] = useState(initialData.financialReports);
  const [generalKpis] = useState(initialData.generalKpis);

  // Chart data
  const occupancyData = [
    { date: t("monthJan"), occupancy: 75, revenue: 45000 },
    { date: t("monthFeb"), occupancy: 82, revenue: 52000 },
    { date: t("monthMar"), occupancy: 78, revenue: 48000 },
    { date: t("monthApr"), occupancy: 85, revenue: 61000 },
    { date: t("monthMay"), occupancy: 80, revenue: 55000 },
    { date: t("monthJun"), occupancy: 88, revenue: 67000 },
    { date: t("monthJul"), occupancy: 92, revenue: 74000 },
  ];

  const guestTypeData = [
    { name: t("business"), value: 45, fill: "hsl(var(--chart-1))" },
    { name: t("tourism"), value: 35, fill: "hsl(var(--chart-2))" },
    { name: t("events"), value: 15, fill: "hsl(var(--chart-3))" },
    { name: t("other"), value: 5, fill: "hsl(var(--chart-4))" },
  ];

  const chartConfig = {
    occupancy: { label: t("occupancyPercent") },
    revenue: { label: t("revenue") },
    satisfaction: { label: t("satisfaction") },
    business: { label: t("business") },
    tourism: { label: t("tourism") },
    events: { label: t("events") },
    other: { label: t("other") },
  };

  const handleExportReport = (type: string) => {
    toast(t("exportStarted"), {
      description: t("generatingReport", { type }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleExportReport("general")}>
            <Download className="mr-2 h-4 w-4" />
            {t("exportData")}
          </Button>
        </div>
      </div>

      {/* Main KPIs */}
      <ReportsKPIs
        kpis={{
          averageOccupancy: generalKpis.averageOccupancy,
          revenuePerAvailableRoom: generalKpis.revenuePerAvailableRoom,
          overallSatisfaction: generalKpis.overallSatisfaction,
          averageStayTime: generalKpis.averageStayTime,
        }}
      />

      <Tabs defaultValue="occupancy" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="occupancy">{t("occupancy")}</TabsTrigger>
          <TabsTrigger value="financial">{t("financial")}</TabsTrigger>
          <TabsTrigger value="operational">{t("operational")}</TabsTrigger>
          <TabsTrigger value="customers">{t("customers")}</TabsTrigger>
        </TabsList>

        <TabsContent value="occupancy" className="space-y-4">
          <OccupancyCharts
            occupancyData={occupancyData}
            guestTypeData={guestTypeData}
            chartConfig={chartConfig}
          />
          <OccupancyDetailsTable occupancyReports={occupancyReports} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialSummary
            financialReports={financialReports}
            onExport={() => handleExportReport("financial")}
          />
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <OperationalReportTable
            operationalReports={operationalReports}
            onExport={() => handleExportReport("operational")}
          />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <CustomerReportsTable
            customerReports={customerReports}
            onExport={() => handleExportReport("customers")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
