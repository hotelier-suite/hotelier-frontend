"use client";

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
  const getAttendanceStatusBadge = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "PRESENT":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "LATE":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case "ABSENT":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case "SICK_LEAVE":
        return <Badge className="bg-blue-100 text-blue-800">Sick Leave</Badge>;
      case "VACATION":
        return (
          <Badge className="bg-purple-100 text-purple-800">Vacation</Badge>
        );
      case "EARLY_LEAVE":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            Early Leave
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Attendance Control</h3>
        <p className="text-sm text-muted-foreground">
          Employee entry and exit records
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead>Regular Hours</TableHead>
            <TableHead>Overtime</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.employee}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.entryTime}</TableCell>
              <TableCell>{record.exitTime}</TableCell>
              <TableCell>{record.regularHours}h</TableCell>
              <TableCell>{record.extraHours}h</TableCell>
              <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
              <TableCell>{record.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
