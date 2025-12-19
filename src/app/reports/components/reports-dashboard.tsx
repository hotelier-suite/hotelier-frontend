"use client";

import { useState } from "react";
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
  const [occupancyReports] = useState(initialData.occupancyReports);
  const [operationalReports] = useState(initialData.operationalReports);
  const [customerReports] = useState(initialData.customerReports);
  const [financialReports] = useState(initialData.financialReports);
  const [generalKpis] = useState(initialData.generalKpis);

  // Chart data
  const occupancyData = [
    { date: "Jan", occupancy: 75, revenue: 45000 },
    { date: "Feb", occupancy: 82, revenue: 52000 },
    { date: "Mar", occupancy: 78, revenue: 48000 },
    { date: "Apr", occupancy: 85, revenue: 61000 },
    { date: "May", occupancy: 80, revenue: 55000 },
    { date: "Jun", occupancy: 88, revenue: 67000 },
    { date: "Jul", occupancy: 92, revenue: 74000 },
  ];

  const guestTypeData = [
    { name: "Business", value: 45, fill: "hsl(var(--chart-1))" },
    { name: "Tourism", value: 35, fill: "hsl(var(--chart-2))" },
    { name: "Events", value: 15, fill: "hsl(var(--chart-3))" },
    { name: "Other", value: 5, fill: "hsl(var(--chart-4))" },
  ];

  const chartConfig = {
    occupancy: { label: "Occupancy %" },
    revenue: { label: "Revenue" },
    satisfaction: { label: "Satisfaction" },
    business: { label: "Business" },
    tourism: { label: "Tourism" },
    events: { label: "Events" },
    other: { label: "Other" },
  };

  const handleExportReport = (type: string) => {
    toast("Export started", {
      description: `Generating ${type} report...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports and Analysis</h1>
          <p className="text-muted-foreground">
            Executive dashboard and detailed reports
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleExportReport("general")}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
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
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
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
