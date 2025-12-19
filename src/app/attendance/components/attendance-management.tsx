"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { attendanceApi, type Attendance } from "@/lib/api/attendance";
import { employeesApi, type Employee } from "@/lib/api/employees";
import { AttendanceSummaryCards } from "./attendance-summary-cards";
import { AttendanceFilters } from "./attendance-filters";
import { calculateHours, calculateSummary } from "../utils/attendance-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AttendanceManagement() {
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
        return "Reception";
      case "HOUSEKEEPING":
        return "Housekeeping";
      case "MAINTENANCE":
        return "Maintenance";
      case "MANAGEMENT":
        return "Management";
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

      const updatedRecord = await attendanceApi.clockOut(recordId, currentTime);

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

      toast.success("Clock-out recorded");
    } catch (error) {
      console.error("Error clocking out:", error);
      toast.error("Error recording clock-out");
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
        const employeesData = await employeesApi.getAll();
        setEmployees(employeesData);

        // Load attendance records for selected date
        const attendanceData = await attendanceApi.getByDate(selectedDate);

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
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Control</h1>
          <p className="text-muted-foreground">
            Staff attendance management and tracking
          </p>
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
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Employee</th>
                    <th className="p-4 text-left font-medium">Department</th>
                    <th className="p-4 text-left font-medium">Date</th>
                    <th className="p-4 text-left font-medium">Check-in</th>
                    <th className="p-4 text-left font-medium">Check-out</th>
                    <th className="p-4 text-left font-medium">Total Times</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No records found
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
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">{record.checkIn || "-"}</td>
                        <td className="p-4">{record.checkOut || "-"}</td>
                        <td className="p-4">
                          {typeof record.hoursWorked === "number"
                            ? record.hoursWorked.toFixed(2)
                            : "-"}{" "}
                          hrs
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status === "PRESENT" && "Present"}
                            {record.status === "ABSENT" && "Absent"}
                            {record.status === "LATE" && "Late"}
                            {record.status === "EARLY_LEAVE" &&
                              "Early Leave"}
                            {record.status === "SICK_LEAVE" &&
                              "Sick Leave"}
                            {record.status === "VACATION" && "Vacation"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {!record.checkOut && record.checkIn && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClockOut(record.id)}
                            >
                              Clock Out
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
