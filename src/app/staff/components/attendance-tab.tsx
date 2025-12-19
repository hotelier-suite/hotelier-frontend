"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { attendanceApi, type Attendance } from "@/lib/api/attendance";
import { employeesApi, type Employee } from "@/lib/api/employees";
import {
  Calendar,
  Clock,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PRESENT":
      return (
        <Badge variant="default" className="bg-green-500">
          Present
        </Badge>
      );
    case "ABSENT":
      return <Badge variant="destructive">Absent</Badge>;
    case "LATE":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-300"
        >
          Late
        </Badge>
      );
    case "EARLY_LEAVE":
      return <Badge variant="secondary">Early Leave</Badge>;
    case "SICK_LEAVE":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-300"
        >
          Sick Leave
        </Badge>
      );
    case "VACATION":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-300"
        >
          Vacation
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export function AttendanceTab() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(
    null,
  );
  const [deletingAttendance, setDeletingAttendance] =
    useState<Attendance | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [formData, setFormData] = useState({
    employeeId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    checkIn: "",
    checkOut: "",
    status: "PRESENT",
    notes: "",
    hoursWorked: 0,
    overtimeHours: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [attendanceData, employeesData] = await Promise.all([
        attendanceApi.getByDate(selectedDate),
        employeesApi.getAll(),
      ]);
      setAttendances(attendanceData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading attendance");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateHoursWorked = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;

    const [inHours, inMinutes] = checkIn.split(":").map(Number);
    const [outHours, outMinutes] = checkOut.split(":").map(Number);

    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;

    const diffMinutes = outTotalMinutes - inTotalMinutes;
    return Math.round((diffMinutes / 60) * 100) / 100;
  };

  const handleOpenDialog = (attendance?: Attendance) => {
    if (attendance) {
      setEditingAttendance(attendance);
      setFormData({
        employeeId: attendance.employeeId.toString(),
        date: attendance.date,
        checkIn: attendance.checkIn || "",
        checkOut: attendance.checkOut || "",
        status: attendance.status,
        notes: attendance.notes || "",
        hoursWorked:
          typeof attendance.hoursWorked === "number"
            ? attendance.hoursWorked
            : parseFloat(attendance.hoursWorked?.toString() || "0"),
        overtimeHours:
          typeof attendance.overtimeHours === "number"
            ? attendance.overtimeHours
            : parseFloat(attendance.overtimeHours?.toString() || "0"),
      });
    } else {
      setEditingAttendance(null);
      setFormData({
        employeeId: "",
        date: selectedDate,
        checkIn: "",
        checkOut: "",
        status: "PRESENT",
        notes: "",
        hoursWorked: 0,
        overtimeHours: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleTimeChange = (field: "checkIn" | "checkOut", value: string) => {
    const newFormData = { ...formData, [field]: value };
    if (newFormData.checkIn && newFormData.checkOut) {
      newFormData.hoursWorked = calculateHoursWorked(
        newFormData.checkIn,
        newFormData.checkOut,
      );
    }
    setFormData(newFormData);
  };

  const handleSaveAttendance = async () => {
    try {
      const data = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
      };

      if (editingAttendance) {
        const payload = {
          ...data,
          status: data.status as Attendance["status"],
        };
        await attendanceApi.update(editingAttendance.id, payload);
        toast.success("Attendance updated successfully");
      } else {
        const payload = {
          ...data,
          status: data.status as Attendance["status"],
        };
        await attendanceApi.create(payload);
        toast.success("Attendance registered successfully");
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Error saving attendance");
    }
  };

  const handleDeleteAttendance = async () => {
    if (!deletingAttendance) return;

    try {
      await attendanceApi.delete(deletingAttendance.id);
      toast.success("Attendance deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingAttendance(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting attendance:", error);
      toast.error("Error deleting attendance");
    }
  };

  const getEmployeeInfo = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    return {
      name: employee?.name || "Unknown",
      position: employee?.position || "-",
      department: employee?.department || "-",
    };
  };

  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
  const lateCount = attendances.filter((a) => a.status === "LATE").length;
  const totalHours = attendances.reduce((sum, a) => {
    const hours =
      typeof a.hoursWorked === "number"
        ? a.hoursWorked
        : parseFloat(a.hoursWorked?.toString() || "0");
    return sum + (isNaN(hours) ? 0 : hours);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {presentCount}
            </div>
            <p className="text-xs text-muted-foreground">Attended today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground">Did not attend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lateCount}
            </div>
            <p className="text-xs text-muted-foreground">Arrived late</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Hours worked</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Register Attendance
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : attendances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No attendance records for this date
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.map((attendance) => {
                    const info = getEmployeeInfo(attendance.employeeId);
                    return (
                      <TableRow key={attendance.id}>
                        <TableCell className="font-medium">
                          {info.name}
                        </TableCell>
                        <TableCell>{info.department}</TableCell>
                        <TableCell>{info.position}</TableCell>
                        <TableCell>{attendance.checkIn || "-"}</TableCell>
                        <TableCell>{attendance.checkOut || "-"}</TableCell>
                        <TableCell>
                          {typeof attendance.hoursWorked === "number"
                            ? attendance.hoursWorked.toFixed(1)
                            : parseFloat(
                              attendance.hoursWorked?.toString() || "0",
                            ).toFixed(1)}
                          h
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(attendance.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(attendance)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingAttendance(attendance);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Attendance Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAttendance ? "Edit Attendance" : "Register Attendance"}
            </DialogTitle>
            <DialogDescription>
              {editingAttendance
                ? "Update the attendance record"
                : "Complete the employee attendance details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, employeeId: value })
                }
                disabled={!!editingAttendance}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id.toString()}
                    >
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkIn">Check-in Time</Label>
                <Input
                  id="checkIn"
                  type="time"
                  value={formData.checkIn}
                  onChange={(e) => handleTimeChange("checkIn", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkOut">Check-out Time</Label>
                <Input
                  id="checkOut"
                  type="time"
                  value={formData.checkOut}
                  onChange={(e) => handleTimeChange("checkOut", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRESENT">Present</SelectItem>
                  <SelectItem value="ABSENT">Absent</SelectItem>
                  <SelectItem value="LATE">Late</SelectItem>
                  <SelectItem value="EARLY_LEAVE">Early Leave</SelectItem>
                  <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                  <SelectItem value="VACATION">Vacation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input
                id="hoursWorked"
                type="number"
                step="0.5"
                value={formData.hoursWorked}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hoursWorked: parseFloat(e.target.value),
                  })
                }
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAttendance}>
              {editingAttendance ? "Update" : "Register"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this attendance record?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAttendance}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
