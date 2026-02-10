"use client";

import { useState, useEffect, useReducer } from "react";
import { useTranslations } from "next-intl";
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
import { type Attendance } from "@/lib/features/attendance/types";
import { attendanceService } from "@/lib/features/attendance/service";
import { type Employee } from "@/lib/features/employees/types";
import { employeesService } from "@/lib/features/employees/service";
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

const getStatusBadge = (status: string, t: (key: string) => string) => {
  switch (status) {
    case "PRESENT":
      return (
        <Badge variant="default" className="bg-green-500">
          {t("statusPresent")}
        </Badge>
      );
    case "ABSENT":
      return <Badge variant="destructive">{t("statusAbsent")}</Badge>;
    case "LATE":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-300"
        >
          {t("statusLate")}
        </Badge>
      );
    case "EARLY_LEAVE":
      return <Badge variant="secondary">{t("statusEarlyLeave")}</Badge>;
    case "SICK_LEAVE":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-300"
        >
          {t("statusSickLeave")}
        </Badge>
      );
    case "VACATION":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-300"
        >
          {t("statusVacation")}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export function AttendanceTab() {
  const t = useTranslations("AttendanceTab");
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

  const [refreshKey, refresh] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attendanceData, employeesData] = await Promise.all([
          attendanceService.getByDate(selectedDate),
          employeesService.getAll(),
        ]);
        setAttendances(attendanceData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("errorLoadingAttendance"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, t, refreshKey]);

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
        await attendanceService.update(editingAttendance.id, payload);
        toast.success(t("attendanceUpdatedSuccess"));
      } else {
        const payload = {
          ...data,
          status: data.status as Attendance["status"],
        };
        await attendanceService.create(payload);
        toast.success(t("attendanceRegisteredSuccess"));
      }
      setDialogOpen(false);
      refresh();
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error(t("errorSavingAttendance"));
    }
  };

  const handleDeleteAttendance = async () => {
    if (!deletingAttendance) return;

    try {
      await attendanceService.delete(deletingAttendance.id);
      toast.success(t("attendanceDeletedSuccess"));
      setDeleteDialogOpen(false);
      setDeletingAttendance(null);
      refresh();
    } catch (error) {
      console.error("Error deleting attendance:", error);
      toast.error(t("errorDeletingAttendance"));
    }
  };

  const getEmployeeInfo = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    return {
      name: employee?.name || t("unknown"),
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
            <CardTitle className="text-sm font-medium">
              {t("present")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {presentCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("attendedToday")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("absent")}</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground">{t("didNotAttend")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("lateArrivals")}
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lateCount}
            </div>
            <p className="text-xs text-muted-foreground">{t("arrivedLate")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalHours")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">{t("hoursWorked")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("attendanceRegistration")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="date">{t("date")}</Label>
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
                {t("registerAttendance")}
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("employee")}</TableHead>
                  <TableHead>{t("department")}</TableHead>
                  <TableHead>{t("position")}</TableHead>
                  <TableHead>{t("checkIn")}</TableHead>
                  <TableHead>{t("checkOut")}</TableHead>
                  <TableHead>{t("hours")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      {t("loading")}
                    </TableCell>
                  </TableRow>
                ) : attendances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      {t("noRecordsForDate")}
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
                          {t("hoursUnit")}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(attendance.status, t)}
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
              {editingAttendance
                ? t("editAttendance")
                : t("registerAttendance")}
            </DialogTitle>
            <DialogDescription>
              {editingAttendance
                ? t("updateAttendanceRecord")
                : t("completeAttendanceDetails")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">{t("employee")}</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, employeeId: value })
                }
                disabled={!!editingAttendance}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectEmployee")} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id.toString()}
                    >
                      {employee.name} - {t(`positions.${employee.position}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">{t("date")}</Label>
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
                <Label htmlFor="checkIn">{t("checkInTime")}</Label>
                <Input
                  id="checkIn"
                  type="time"
                  value={formData.checkIn}
                  onChange={(e) => handleTimeChange("checkIn", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkOut">{t("checkOutTime")}</Label>
                <Input
                  id="checkOut"
                  type="time"
                  value={formData.checkOut}
                  onChange={(e) => handleTimeChange("checkOut", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t("status")}</Label>
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
                  <SelectItem value="PRESENT">{t("present")}</SelectItem>
                  <SelectItem value="ABSENT">{t("absent")}</SelectItem>
                  <SelectItem value="LATE">{t("late")}</SelectItem>
                  <SelectItem value="EARLY_LEAVE">{t("earlyLeave")}</SelectItem>
                  <SelectItem value="SICK_LEAVE">{t("sickLeave")}</SelectItem>
                  <SelectItem value="VACATION">{t("vacation")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hoursWorked">{t("hoursWorked")}</Label>
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
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder={t("notesPlaceholder")}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveAttendance}>
              {editingAttendance ? t("update") : t("register")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDeletion")}</DialogTitle>
            <DialogDescription>
              {t("confirmDeleteAttendance")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAttendance}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
