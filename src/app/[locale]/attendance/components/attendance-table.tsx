"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, LogIn, LogOut } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  isActive: boolean;
}

interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  date: string;
  clockInTime?: string;
  clockOutTime?: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_OUT" | "OVERTIME";
  totalHours?: number;
  notes?: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  employees: Employee[];
  onClockIn: (employeeId: number) => void;
  onClockOut: (recordId: number) => void;
  getDepartmentLabel: (department: string) => string;
}

export function AttendanceTable({
  records,
  employees,
  onClockIn,
  onClockOut,
  getDepartmentLabel,
}: AttendanceTableProps) {
  const t = useTranslations("AttendanceTableComp");
  const getStatusColor = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-500";
      case "ABSENT":
        return "bg-red-500";
      case "LATE":
        return "bg-yellow-500";
      case "EARLY_OUT":
        return "bg-orange-500";
      case "OVERTIME":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "PRESENT":
        return t("present");
      case "ABSENT":
        return t("absent");
      case "LATE":
        return t("late");
      case "EARLY_OUT":
        return t("earlyOut");
      case "OVERTIME":
        return t("overtime");
      default:
        return status;
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t("attendanceRecords")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("employee")}</TableHead>
                <TableHead>{t("department")}</TableHead>
                <TableHead>{t("clockIn")}</TableHead>
                <TableHead>{t("clockOut")}</TableHead>
                <TableHead>{t("hours")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("notes")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.employeeName}
                  </TableCell>
                  <TableCell>{getDepartmentLabel(record.department)}</TableCell>
                  <TableCell>{record.clockInTime || "-"}</TableCell>
                  <TableCell>{record.clockOutTime || "-"}</TableCell>
                  <TableCell>
                    {record.totalHours
                      ? `${record.totalHours}${t("hoursUnit")}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-white ${getStatusColor(record.status)}`}
                    >
                      {getStatusLabel(record.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.notes || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {record.date === today && !record.clockInTime && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onClockIn(record.employeeId)}
                        >
                          <LogIn className="h-4 w-4 mr-1" />
                          {t("clockIn")}
                        </Button>
                      )}
                      {record.date === today &&
                        record.clockInTime &&
                        !record.clockOutTime && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onClockOut(record.id)}
                          >
                            <LogOut className="h-4 w-4 mr-1" />
                            {t("clockOut")}
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {/* Show employees who haven't been marked for today */}
              {employees
                .filter((emp) => emp.isActive)
                .filter(
                  (emp) =>
                    !records.some(
                      (r) => r.employeeId === emp.id && r.date === today,
                    ),
                )
                .map((emp) => (
                  <TableRow key={`missing-${emp.id}`}>
                    <TableCell className="font-medium text-muted-foreground">
                      {emp.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getDepartmentLabel(emp.department)}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-gray-400 text-white"
                      >
                        {t("noRecord")}
                      </Badge>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onClockIn(emp.id)}
                      >
                        <LogIn className="h-4 w-4 mr-1" />
                        {t("clockIn")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              {records.length === 0 &&
                employees.filter((e) => e.isActive).length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      {t("noRecordsToShow")}
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
