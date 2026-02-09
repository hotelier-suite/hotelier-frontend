"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface AttendanceManagementProps {
  attendance: Attendance[];
}

export default function AttendanceManagement({
  attendance,
}: AttendanceManagementProps) {
  const t = useTranslations("AttendanceManagement");
  const getAttendanceStatusBadge = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "PRESENT":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("statusPresent")}
          </Badge>
        );
      case "LATE":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("statusLate")}
          </Badge>
        );
      case "ABSENT":
        return (
          <Badge className="bg-red-100 text-red-800">{t("statusAbsent")}</Badge>
        );
      case "SICK_LEAVE":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {t("statusSickLeave")}
          </Badge>
        );
      case "VACATION":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            {t("statusVacation")}
          </Badge>
        );
      case "EARLY_LEAVE":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            {t("statusEarlyLeave")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{t("attendanceControl")}</h3>
        <p className="text-sm text-muted-foreground">{t("entryExitRecords")}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("employee")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("entry")}</TableHead>
            <TableHead>{t("exit")}</TableHead>
            <TableHead>{t("regularHours")}</TableHead>
            <TableHead>{t("overtime")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("notes")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.employee}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.entryTime}</TableCell>
              <TableCell>{record.exitTime}</TableCell>
              <TableCell>
                {record.regularHours}
                {t("hoursUnit")}
              </TableCell>
              <TableCell>
                {record.extraHours}
                {t("hoursUnit")}
              </TableCell>
              <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
              <TableCell>{record.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
