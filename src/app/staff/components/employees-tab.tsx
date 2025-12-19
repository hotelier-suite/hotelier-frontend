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
import { employeesApi, type Employee } from "@/lib/api/employees";
import { UserPlus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const getDepartmentDisplayName = (department: string): string => {
  const departmentNames: Record<string, string> = {
    FRONT_DESK: "Front Desk",
    HOUSEKEEPING: "Housekeeping",
    MAINTENANCE: "Maintenance",
    RESTAURANT: "Restaurant",
    MANAGEMENT: "Management",
    SECURITY: "Security",
    VALET: "Valet",
  };
  return departmentNames[department] || department;
};

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="default" className="bg-green-500">
          Active
        </Badge>
      );
    case "INACTIVE":
      return <Badge variant="secondary">Inactive</Badge>;
    case "ON_LEAVE":
      return <Badge variant="outline">On Leave</Badge>;
    default:
      return (
        <Badge variant="default" className="bg-green-500">
          Active
        </Badge>
      );
  }
};

export function EmployeesTab() {
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

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await employeesApi.getAll();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error loading employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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
        await employeesApi.update(Number(editingEmployee.id), payload);
        toast.success("Employee updated successfully");
      } else {
        const payload = {
          ...formData,
          department: formData.department as Employee["department"],
          status: formData.status as Employee["status"],
        };
        await employeesApi.create(payload);
        toast.success("Employee created successfully");
      }
      setDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Error saving employee");
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;

    try {
      await employeesApi.delete(Number(deletingEmployee.id));
      toast.success("Employee deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID or position..."
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
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="FRONT_DESK">Front Desk</SelectItem>
                <SelectItem value="HOUSEKEEPING">Housekeeping</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                <SelectItem value="MANAGEMENT">Management</SelectItem>
                <SelectItem value="SECURITY">Security</SelectItem>
                <SelectItem value="VALET">Valet</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleOpenDialog()}>
              <UserPlus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          </div>

          {/* Employees Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No employees found
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
                        {getDepartmentDisplayName(employee.department)}
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.shift || "-"}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
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
              {editingEmployee ? "Edit Employee" : "New Employee"}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee
                ? "Update the employee information"
                : "Complete the new employee details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                placeholder="EMP001"
                disabled={!!editingEmployee}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
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
                  <SelectItem value="FRONT_DESK">Front Desk</SelectItem>
                  <SelectItem value="HOUSEKEEPING">Housekeeping</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                  <SelectItem value="MANAGEMENT">Management</SelectItem>
                  <SelectItem value="SECURITY">Security</SelectItem>
                  <SelectItem value="VALET">Valet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="Receptionist"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shift">Shift</Label>
              <Input
                id="shift"
                value={formData.shift}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
                placeholder="Morning"
              />
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
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmployee}>
              {editingEmployee ? "Update" : "Create"}
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
              Are you sure you want to delete{" "}
              <strong>{deletingEmployee?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEmployee}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
