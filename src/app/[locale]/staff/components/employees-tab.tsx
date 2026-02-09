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
import { type Employee } from "@/lib/features/employees/types";
import { employeesService } from "@/lib/features/employees/service";
import { UserPlus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const getDepartmentDisplayName = (
  department: string,
  t: (key: string) => string,
): string => {
  const departmentKeys: Record<string, string> = {
    FRONT_DESK: "departmentFrontDesk",
    HOUSEKEEPING: "departmentHousekeeping",
    MAINTENANCE: "departmentMaintenance",
    RESTAURANT: "departmentRestaurant",
    MANAGEMENT: "departmentManagement",
    SECURITY: "departmentSecurity",
    VALET: "departmentValet",
  };
  const key = departmentKeys[department];
  return key ? t(key) : department;
};

const getStatusBadge = (
  status: string | undefined,
  t: (key: string) => string,
) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="default" className="bg-green-500">
          {t("statusActive")}
        </Badge>
      );
    case "INACTIVE":
      return <Badge variant="secondary">{t("statusInactive")}</Badge>;
    case "ON_LEAVE":
      return <Badge variant="outline">{t("statusOnLeave")}</Badge>;
    default:
      return (
        <Badge variant="default" className="bg-green-500">
          {t("statusActive")}
        </Badge>
      );
  }
};

export function EmployeesTab() {
  const t = useTranslations("EmployeesTab");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    department: "FRONT_DESK",
    position: "",
    shift: "",
    status: "ACTIVE",
  });

  const [refreshKey, refresh] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await employeesService.getAll();
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error(t("errorLoadingEmployees"));
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [t, refreshKey]);

  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter(
        (emp) => emp.department === selectedDepartment,
      );
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDepartment, employees]);

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        employeeId: employee.employeeId,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        shift: employee.shift || "",
        status: employee.status || "ACTIVE",
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        employeeId: "",
        name: "",
        department: "FRONT_DESK",
        position: "",
        shift: "",
        status: "ACTIVE",
      });
    }
    setDialogOpen(true);
  };

  const handleSaveEmployee = async () => {
    try {
      if (editingEmployee) {
        const payload = {
          ...formData,
          department: formData.department as Employee["department"],
          status: formData.status as Employee["status"],
        };
        await employeesService.update(Number(editingEmployee.id), payload);
        toast.success(t("employeeUpdatedSuccess"));
      } else {
        const payload = {
          ...formData,
          department: formData.department as Employee["department"],
          status: formData.status as Employee["status"],
        };
        await employeesService.create(payload);
        toast.success(t("employeeCreatedSuccess"));
      }
      setDialogOpen(false);
      refresh();
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error(t("errorSavingEmployee"));
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;

    try {
      await employeesService.delete(Number(deletingEmployee.id));
      toast.success(t("employeeDeletedSuccess"));
      setDeleteDialogOpen(false);
      setDeletingEmployee(null);
      refresh();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(t("errorDeletingEmployee"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("employeeManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t("department")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allDepartments")}</SelectItem>
                <SelectItem value="FRONT_DESK">{t("frontDesk")}</SelectItem>
                <SelectItem value="HOUSEKEEPING">
                  {t("housekeeping")}
                </SelectItem>
                <SelectItem value="MAINTENANCE">{t("maintenance")}</SelectItem>
                <SelectItem value="RESTAURANT">{t("restaurant")}</SelectItem>
                <SelectItem value="MANAGEMENT">{t("management")}</SelectItem>
                <SelectItem value="SECURITY">{t("security")}</SelectItem>
                <SelectItem value="VALET">{t("valet")}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleOpenDialog()}>
              <UserPlus className="mr-2 h-4 w-4" />
              {t("newEmployee")}
            </Button>
          </div>

          {/* Employees Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("id")}</TableHead>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("department")}</TableHead>
                  <TableHead>{t("position")}</TableHead>
                  <TableHead>{t("shift")}</TableHead>
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
                ) : filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t("noEmployeesFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.employeeId}
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>
                        {getDepartmentDisplayName(employee.department, t)}
                      </TableCell>
                      <TableCell>
                        {t(`positions.${employee.position}`)}
                      </TableCell>
                      <TableCell>
                        {employee.shift ? t(`shifts.${employee.shift}`) : "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(employee.status, t)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingEmployee(employee);
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

      {/* Add/Edit Employee Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? t("editEmployee") : t("newEmployee")}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee
                ? t("updateEmployeeInfo")
                : t("completeNewEmployeeDetails")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employeeId">{t("employeeId")}</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                placeholder={t("placeholderEmployeeId")}
                disabled={!!editingEmployee}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t("placeholderFullName")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">{t("department")}</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FRONT_DESK">{t("frontDesk")}</SelectItem>
                  <SelectItem value="HOUSEKEEPING">
                    {t("housekeeping")}
                  </SelectItem>
                  <SelectItem value="MAINTENANCE">
                    {t("maintenance")}
                  </SelectItem>
                  <SelectItem value="RESTAURANT">{t("restaurant")}</SelectItem>
                  <SelectItem value="MANAGEMENT">{t("management")}</SelectItem>
                  <SelectItem value="SECURITY">{t("security")}</SelectItem>
                  <SelectItem value="VALET">{t("valet")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">{t("position")}</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder={t("placeholderPosition")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shift">{t("shift")}</Label>
              <Input
                id="shift"
                value={formData.shift}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
                placeholder={t("placeholderShift")}
              />
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
                  <SelectItem value="ACTIVE">{t("active")}</SelectItem>
                  <SelectItem value="INACTIVE">{t("inactive")}</SelectItem>
                  <SelectItem value="ON_LEAVE">{t("onLeave")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveEmployee}>
              {editingEmployee ? t("update") : t("create")}
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
              {t("confirmDeleteEmployee", {
                name: deletingEmployee?.name || "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteEmployee}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
