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
import { type Shift } from "@/lib/features/shifts/types";
import { shiftsService } from "@/lib/features/shifts/service";
import { type Employee } from "@/lib/features/employees/types";
import { employeesService } from "@/lib/features/employees/service";
import { Clock, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const getStatusBadge = (status: string, t: (key: string) => string) => {
  switch (status) {
    case "SCHEDULED":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-300"
        >
          {t("statusScheduled")}
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="default" className="bg-green-500">
          {t("statusInProgress")}
        </Badge>
      );
    case "COMPLETED":
      return <Badge variant="secondary">{t("statusCompleted")}</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">{t("statusCancelled")}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getShiftTypeName = (type: string, t: (key: string) => string) => {
  const typeKeys: Record<string, string> = {
    MORNING: "shiftTypeMorning",
    AFTERNOON: "shiftTypeAfternoon",
    NIGHT: "shiftTypeNight",
    DOUBLE: "shiftTypeDouble",
  };
  const key = typeKeys[type];
  return key ? t(key) : type;
};

export function ShiftsTab() {
  const t = useTranslations("ShiftsTab");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [deletingShift, setDeletingShift] = useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [formData, setFormData] = useState({
    employeeId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "08:00",
    endTime: "16:00",
    type: "MORNING",
    status: "SCHEDULED",
    position: "",
    department: "",
    notes: "",
  });

  const [refreshKey, refresh] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [shiftsData, employeesData] = await Promise.all([
          shiftsService.getByDate(selectedDate),
          employeesService.getAll(),
        ]);
        setShifts(shiftsData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("errorLoadingShifts"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, t, refreshKey]);

  const handleOpenDialog = (shift?: Shift) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({
        employeeId: shift.employeeId.toString(),
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        type: shift.type,
        status: shift.status,
        position: shift.position,
        department: shift.department,
        notes: shift.notes || "",
      });
    } else {
      setEditingShift(null);
      setFormData({
        employeeId: "",
        date: selectedDate,
        startTime: "08:00",
        endTime: "16:00",
        type: "MORNING",
        status: "SCHEDULED",
        position: "",
        department: "",
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === parseInt(employeeId));
    if (employee) {
      setFormData({
        ...formData,
        employeeId,
        position: employee.position,
        department: employee.department,
      });
    }
  };

  const handleSaveShift = async () => {
    try {
      const data = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
      };

      if (editingShift) {
        const payload = {
          ...data,
          type: data.type as Shift["type"],
          status: data.status as Shift["status"],
          department: data.department as Shift["department"],
        };
        await shiftsService.update(editingShift.id, payload);
        toast.success(t("shiftUpdatedSuccess"));
      } else {
        const payload = {
          ...data,
          type: data.type as Shift["type"],
          status: data.status as Shift["status"],
          department: data.department as Shift["department"],
        };
        await shiftsService.create(payload);
        toast.success(t("shiftCreatedSuccess"));
      }
      setDialogOpen(false);
      refresh();
    } catch (error) {
      console.error("Error saving shift:", error);
      toast.error(t("errorSavingShift"));
    }
  };

  const handleDeleteShift = async () => {
    if (!deletingShift) return;

    try {
      await shiftsService.delete(deletingShift.id);
      toast.success(t("shiftDeletedSuccess"));
      setDeleteDialogOpen(false);
      setDeletingShift(null);
      refresh();
    } catch (error) {
      console.error("Error deleting shift:", error);
      toast.error(t("errorDeletingShift"));
    }
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee?.name || t("unknown");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("shiftManagement")}</CardTitle>
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
                {t("newShift")}
              </Button>
            </div>
          </div>

          {/* Shifts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("employee")}</TableHead>
                  <TableHead>{t("department")}</TableHead>
                  <TableHead>{t("position")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("schedule")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t("loading")}
                    </TableCell>
                  </TableRow>
                ) : shifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t("noShiftsForDate")}
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">
                        {getEmployeeName(shift.employeeId)}
                      </TableCell>
                      <TableCell>{shift.department}</TableCell>
                      <TableCell>{shift.position}</TableCell>
                      <TableCell>{getShiftTypeName(shift.type, t)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(shift.status, t)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(shift)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingShift(shift);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Shift Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingShift ? t("editShift") : t("newShift")}
            </DialogTitle>
            <DialogDescription>
              {editingShift
                ? t("updateShiftInfo")
                : t("completeNewShiftDetails")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">{t("employee")}</Label>
              <Select
                value={formData.employeeId}
                onValueChange={handleEmployeeChange}
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
                <Label htmlFor="startTime">{t("startTime")}</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">{t("endTime")}</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">{t("shiftType")}</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORNING">{t("morning")}</SelectItem>
                  <SelectItem value="AFTERNOON">{t("afternoon")}</SelectItem>
                  <SelectItem value="NIGHT">{t("night")}</SelectItem>
                  <SelectItem value="DOUBLE">{t("double")}</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="SCHEDULED">{t("scheduled")}</SelectItem>
                  <SelectItem value="IN_PROGRESS">{t("inProgress")}</SelectItem>
                  <SelectItem value="COMPLETED">{t("completed")}</SelectItem>
                  <SelectItem value="CANCELLED">{t("cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder={t("notesPlaceholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveShift}>
              {editingShift ? t("update") : t("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDeletion")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteShift")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteShift}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
