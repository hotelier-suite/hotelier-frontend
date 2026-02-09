"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { toast } from "sonner";
import { type Attendance } from "@/lib/features/attendance/types";
import { attendanceService } from "@/lib/features/attendance/service";
import { type Employee } from "@/lib/features/employees/types";
import { employeesService } from "@/lib/features/employees/service";
import { AttendanceSummaryCards } from "./attendance-summary-cards";
import { AttendanceFilters } from "./attendance-filters";
import { calculateHours, calculateSummary } from "../utils/attendance-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AttendanceManagement() {
  const t = useTranslations("AttendanceManagementComp");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const getDepartmentLabel = (role: string) => {
    switch (role) {
      case "RECEPTION":
        return t("reception");
      case "HOUSEKEEPING":
        return t("housekeeping");
      case "MAINTENANCE":
        return t("maintenance");
      case "MANAGEMENT":
        return t("management");
      default:
        return role;
    }
  };

  const getStatusColor = (status: Attendance["status"]) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-500";
      case "ABSENT":
        return "bg-red-500";
      case "LATE":
        return "bg-yellow-500";
      case "EARLY_LEAVE":
        return "bg-orange-500";
      case "SICK_LEAVE":
        return "bg-purple-500";
      case "VACATION":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleClockOut = async (recordId: number) => {
    const currentTime = new Date().toTimeString().slice(0, 5);

    try {
      setLoading(true);

      const updatedRecord = await attendanceService.clockOut(
        recordId,
        currentTime,
      );

      setAttendanceRecords((prev) =>
        prev.map((record) => {
          if (record.id === recordId) {
            const hoursWorked = record.checkIn
              ? calculateHours(record.checkIn, currentTime)
              : 0;

            return {
              ...record,
              checkOut: currentTime,
              hoursWorked,
              status: updatedRecord.status,
            };
          }
          return record;
        }),
      );

      toast.success(t("clockOutRecorded"));
    } catch (error) {
      console.error("Error clocking out:", error);
      toast.error(t("errorClockOut"));
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesDepartment =
      departmentFilter === "all" ||
      record.employee?.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    const matchesDate = record.date === selectedDate;

    return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
  });

  const summary = calculateSummary(filteredRecords, employees.length);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load employees from API
        const employeesData = await employeesService.getAll();
        setEmployees(employeesData);

        // Load attendance records for selected date
        const attendanceData = await attendanceService.getByDate(selectedDate);

        // Enrich attendance records with employee data
        const enrichedRecords = attendanceData.map((record) => {
          const employee = employeesData.find(
            (e) => e.id === record.employeeId,
          );
          return {
            ...record,
            employee: employee
              ? {
                  id:
                    typeof employee.id === "string"
                      ? parseInt(employee.id)
                      : employee.id,
                  name: employee.name,
                  email: "", // Employee type doesn't have email
                  position: employee.position || "",
                  department: employee.department,
                }
              : undefined,
          };
        });

        setAttendanceRecords(enrichedRecords as Attendance[]);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error(t("errorLoadingData"));
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [selectedDate, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <AttendanceSummaryCards summary={summary} />

      {/* Filters */}
      <AttendanceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Attendance Records Table - Inline for now */}
      <Card>
        <CardHeader>
          <CardTitle>{t("attendanceRecords")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">
                      {t("employee")}
                    </th>
                    <th className="p-4 text-left font-medium">
                      {t("department")}
                    </th>
                    <th className="p-4 text-left font-medium">{t("date")}</th>
                    <th className="p-4 text-left font-medium">
                      {t("checkIn")}
                    </th>
                    <th className="p-4 text-left font-medium">
                      {t("checkOut")}
                    </th>
                    <th className="p-4 text-left font-medium">
                      {t("totalTimes")}
                    </th>
                    <th className="p-4 text-left font-medium">{t("status")}</th>
                    <th className="p-4 text-left font-medium">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-8 text-center text-muted-foreground"
                      >
                        {t("noRecords")}
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="p-4 font-medium">
                          {record.employee?.name || "-"}
                        </td>
                        <td className="p-4">
                          {getDepartmentLabel(
                            record.employee?.department || "",
                          )}
                        </td>
                        <td className="p-4">
                          {new Date(record.date).toLocaleDateString(intlLocale)}
                        </td>
                        <td className="p-4">{record.checkIn || "-"}</td>
                        <td className="p-4">{record.checkOut || "-"}</td>
                        <td className="p-4">
                          {typeof record.hoursWorked === "number"
                            ? record.hoursWorked.toFixed(2)
                            : "-"}{" "}
                          {t("hoursUnit")}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status === "PRESENT" && t("present")}
                            {record.status === "ABSENT" && t("absent")}
                            {record.status === "LATE" && t("late")}
                            {record.status === "EARLY_LEAVE" && t("earlyLeave")}
                            {record.status === "SICK_LEAVE" && t("sickLeave")}
                            {record.status === "VACATION" && t("vacation")}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {!record.checkOut && record.checkIn && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClockOut(record.id)}
                            >
                              {t("clockOut")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
