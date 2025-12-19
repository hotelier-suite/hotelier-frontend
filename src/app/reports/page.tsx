"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { reportsApi } from "@/lib/api/reports";
import { inventoryApi } from "@/lib/api/inventory";
import { employeesApi, DepartmentStats, Employee } from "@/lib/api/employees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Download,
  Package,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { RevenueChart } from "./components/revenue-chart";
import { OccupancyChart } from "./components/occupancy-chart";
import { RevenueBreakdownChart } from "./components/revenue-breakdown-chart";
import { InventoryPieChart } from "./components/inventory-pie-chart";
import { EmployeesPieChart } from "./components/employees-pie-chart";
import { InventoryStockLevelsChart } from "./components/inventory-stock-levels-chart";
import { EmployeePerformanceChart } from "./components/employee-performance-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface OccupancyData {
  date: string;
  occupancyPercentage: number;
  totalRevenue: number;
}

interface FinancialSummary {
  revenue: {
    room: number;
    restaurant: number;
    services: number;
    events: number;
    total: number;
  };
  expenses: number;
  grossProfit: number;
  profitMargin: number;
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoryStats: Record<
    string,
    { count: number; value: number; lowStock: number }
  >;
}

export default function ReportsPage() {
  const { user, isLoading: authLoading } = useAuthContext();
  const router = useRouter();

  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined,
  );
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    revenue: { room: 0, restaurant: 0, services: 0, events: 0, total: 0 },
    expenses: 0,
    grossProfit: 0,
    profitMargin: 0,
  });
  const [loading, setLoading] = useState(true);
  const [inventoryStats, setInventoryStats] = useState<InventoryStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    categoryStats: {},
  });
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || authLoading) {
        setLoading(false);
        return;
      }

      try {
        // Get monthly revenue comparison for the whole year
        const monthlyRevenueData =
          await reportsApi.getMonthlyRevenueComparison(selectedYear);
        setMonthlyData(monthlyRevenueData);

        // Get occupancy data for selected period
        const occupancy = await reportsApi.getOccupancyByMonthYear(
          selectedYear,
          selectedMonth,
        );
        setOccupancyData(occupancy);

        // Get financial summary for selected period
        const startDate = selectedMonth
          ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`
          : `${selectedYear}-01-01`;
        const endDate = selectedMonth
          ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${new Date(selectedYear, selectedMonth, 0).getDate()}`
          : `${selectedYear}-12-31`;

        const financial = await reportsApi.getFinancialSummary(
          startDate,
          endDate,
        );
        setFinancialSummary(financial);

        // Get inventory statistics
        const invStats = await inventoryApi.getInventoryStats();
        setInventoryStats(invStats);

        // Get employee department statistics
        const deptStats = await employeesApi.getDepartmentStats();
        setDepartmentStats(deptStats);

        // Get all employees for performance chart
        const allEmployees = await employeesApi.getAll();
        setEmployees(allEmployees);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, selectedYear, selectedMonth]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  const avgOccupancy =
    occupancyData.length > 0
      ? (
        occupancyData.reduce(
          (acc, item) => acc + item.occupancyPercentage,
          0,
        ) / occupancyData.length
      ).toFixed(1)
      : "0";

  const handleDownloadReport = async () => {
    try {
      toast("Generating PDF report...");
      await reportsApi.downloadFinancialReport(selectedYear, selectedMonth);
      toast("Report downloaded successfully");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast("Error downloading report");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Reports and analytics dashboard for the hotel
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedMonth?.toString() || "all"}
            onValueChange={(value) =>
              setSelectedMonth(value === "all" ? undefined : parseInt(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Whole year</SelectItem>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={String(currentYear)}>{currentYear}</SelectItem>
              <SelectItem value={String(currentYear - 1)}>
                {currentYear - 1}
              </SelectItem>
              <SelectItem value={String(currentYear - 2)}>
                {currentYear - 2}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleDownloadReport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialSummary.revenue.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {financialSummary.profitMargin > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">
                    {financialSummary.profitMargin.toFixed(1)}% margin
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">No profit</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gross Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialSummary.grossProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Expenses: ${financialSummary.expenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Occupancy
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOccupancy}%</div>
            <p className="text-xs text-muted-foreground">
              {selectedMonth ? `Selected month` : `${selectedYear}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Room Revenue
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialSummary.revenue.room.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (financialSummary.revenue.room /
                  financialSummary.revenue.total) *
                100 || 0
              ).toFixed(1)}
              % del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueBreakdownChart data={financialSummary.revenue} />

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rooms</span>
                <Badge variant="outline">
                  ${financialSummary.revenue.room.toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Restaurant</span>
                <Badge variant="outline">
                  ${financialSummary.revenue.restaurant.toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Additional Services
                </span>
                <Badge variant="outline">
                  ${financialSummary.revenue.services.toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Events</span>
                <Badge variant="outline">
                  ${financialSummary.revenue.events.toLocaleString()}
                </Badge>
              </div>
              <div className="border-t pt-2 flex items-center justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">
                  ${financialSummary.revenue.total.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-red-600">
                <span className="font-medium">Expenses</span>
                <span>-${financialSummary.expenses.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between text-green-600 font-bold text-lg">
                <span>Net Profit</span>
                <span>${financialSummary.grossProfit.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <RevenueChart data={monthlyData} />

      {/* Occupancy Chart */}
      {occupancyData.length > 0 && <OccupancyChart data={occupancyData} />}

      {/* Inventory and Employee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryStats.totalItems}
            </div>
            <p className="text-xs text-muted-foreground">
              ${inventoryStats.totalValue.toLocaleString()} in value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {inventoryStats.lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventoryStats.outOfStockCount} out of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departmentStats.reduce((acc, dept) => acc + dept.totalCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {departmentStats.reduce((acc, dept) => acc + dept.activeCount, 0)}{" "}
              active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departmentStats.filter((d) => d.totalCount > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">With active staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory and Employee Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryPieChart categoryStats={inventoryStats.categoryStats} />
        <EmployeesPieChart departmentStats={departmentStats} />
      </div>

      {/* Inventory Stock Levels Bar Chart */}
      <InventoryStockLevelsChart categoryStats={inventoryStats.categoryStats} />

      {/* Employee Performance Chart */}
      <EmployeePerformanceChart employees={employees} />
    </div>
  );
}
