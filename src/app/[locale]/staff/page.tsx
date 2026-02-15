"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, Calendar, CheckCircle } from "lucide-react";
import { type Employee } from "@/lib/features/employees/types";
import { employeesService } from "@/lib/features/employees/service";
import { attendanceService } from "@/lib/features/attendance/service";
import { EmployeesTab } from "./components/employees-tab";
import { ShiftsTab } from "./components/shifts-tab";
import { AttendanceTab } from "./components/attendance-tab";

interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  status: string;
  hoursWorked?: number;
}

export default function StaffPage() {
  const t = useTranslations("StaffPage");
  const [staff, setStaff] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [staffData, attendanceData] = await Promise.all([
          employeesService.getAll(),
          attendanceService.getByDate(today),
        ]);

        setStaff(staffData);
        // Transform attendance data to match AttendanceRecord type
        const transformedAttendance = attendanceData.map((att) => ({
          ...att,
          hoursWorked:
            typeof att.hoursWorked === "string"
              ? parseFloat(att.hoursWorked)
              : att.hoursWorked,
        }));
        setAttendance(transformedAttendance);
      } catch (error) {
        console.error("Error fetching staff data:", error);
        setStaff([]);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  const totalStaff = staff.length;
  const activeStaff = staff.filter(
    (s) => s.status === "ACTIVE" || !s.status,
  ).length;
  const presentToday = attendance.filter((a) => a.status === "PRESENT").length;
  const attendanceRate =
    totalStaff > 0 ? Math.round((presentToday / totalStaff) * 100) : 0;

  return (
    <div className="container mx-auto p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalStaff")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              {t("registeredEmployees")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("activeStaff")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeStaff}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("activeEmployees")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("presentToday")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {presentToday}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("todaysAttendance")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("attendanceRate")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t("percentValue", { value: attendanceRate })}</div>
            <p className="text-xs text-muted-foreground">
              {t("averageAttendance")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="shifts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shifts">{t("shifts")}</TabsTrigger>
          <TabsTrigger value="employees">{t("employees")}</TabsTrigger>
          <TabsTrigger value="attendance">{t("attendance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="shifts" className="mt-6">
          <ShiftsTab />
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <EmployeesTab />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <AttendanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
