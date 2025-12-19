"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, CalendarDays, CheckCircle } from "lucide-react";
import EmployeeManagement from "./employee-management";
import ShiftManagement from "./shift-management";
import AttendanceManagement from "./attendance-management";
import PermissionManagement from "./permission-management";

interface Employee {
  id: string;
  name: string;
  lastName: string;
  document: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
  salary: number;
  shift: string;
  status: string;
  supervisor: string;
}

interface Shift {
  id: string;
  employeeId: string;
  employee: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  department: string;
  status: string;
}

interface Attendance {
  id: string;
  employeeId: string;
  employee: string;
  date: string;
  entryTime: string;
  exitTime: string;
  regularHours: number;
  extraHours: number;
  status: string;
  notes: string;
}

interface Permission {
  id: string;
  employeeId: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  approvedBy: string;
}

interface StaffManagementProps {
  initialEmployees: Employee[];
  initialShifts: Shift[];
  initialAttendance: Attendance[];
  initialPermissions: Permission[];
}

export default function StaffManagement({
  initialEmployees,
  initialShifts,
  initialAttendance,
  initialPermissions,
}: StaffManagementProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [shifts, setShifts] = useState(initialShifts);
  const [attendance] = useState(initialAttendance);
  const [permissions, setPermissions] = useState(initialPermissions);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Employee administration, shifts and attendance
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              {employees.filter((emp) => emp.status === "active").length}{" "}
              active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shifts Today</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                shifts.filter(
                  (shift) =>
                    shift.date === new Date().toISOString().split("T")[0],
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (attendance.filter(
                  (ast) =>
                    ast.date === new Date().toISOString().split("T")[0] &&
                    ast.status === "present",
                ).length /
                  attendance.filter(
                    (ast) =>
                      ast.date === new Date().toISOString().split("T")[0],
                  ).length) *
                100,
              ) || 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Employees present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Permissions
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                permissions.filter(
                  (permission) => permission.status === "pending",
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">To approve</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee List</CardTitle>
              <CardDescription>
                Employee information management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeManagement
                employees={employees}
                onEmployeesChange={setEmployees}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shift Scheduling</CardTitle>
              <CardDescription>
                Work schedule and shift management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShiftManagement
                shifts={
                  shifts as unknown as Parameters<
                    typeof ShiftManagement
                  >[0]["shifts"]
                }
                employees={employees}
                onShiftsChange={
                  setShifts as unknown as Parameters<
                    typeof ShiftManagement
                  >[0]["onShiftsChange"]
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Control</CardTitle>
              <CardDescription>
                Employee check-in and check-out registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceManagement attendance={attendance} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Requests</CardTitle>
              <CardDescription>
                Vacation and permission management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionManagement
                permissions={permissions}
                onPermissionsChange={setPermissions}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
