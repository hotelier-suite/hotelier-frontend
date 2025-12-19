"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, Calendar, CheckCircle } from "lucide-react";
import { employeesApi, type Employee } from "@/lib/api/employees";
import { attendanceApi } from "@/lib/api/attendance";
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
  const [staff, setStaff] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [staffData, attendanceData] = await Promise.all([
          employeesApi.getAll(),
          attendanceApi.getByDate(today),
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
        <div>
          <h1 className="text-3xl font-bold">Staff</h1>
          <p className="text-muted-foreground">Loading staff data...</p>
        </div>
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Staff</h1>
        <p className="text-muted-foreground">
          Staff and attendance management
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Staff
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              Registered employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Staff
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeStaff}
            </div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {presentToday}
            </div>
            <p className="text-xs text-muted-foreground">Today&apos;s attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Average attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="shifts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
