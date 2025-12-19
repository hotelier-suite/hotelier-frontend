"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import {
  positionTranslations,
  departmentTranslations,
  shiftTranslations,
} from "@/lib/translations/staff";

const employeeSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  lastName: z.string().min(2, "Last name must have at least 2 characters"),
  document: z.string().min(5, "Document must have at least 5 characters"),
  position: z.string().min(1, "You must select a position"),
  phone: z.string().min(7, "Phone must have at least 7 characters"),
  email: z.string().email("You must enter a valid email"),
  salary: z.number().min(0, "Salary must be greater than or equal to 0"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface Employee {
  id: string;
  name: string;
  lastName: string;
  document: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
  salary: number;
  shift: string;
  status: string;
  supervisor: string;
}

interface EmployeeManagementProps {
  employees: Employee[];
  onEmployeesChange: (employees: Employee[]) => void;
}

export default function EmployeeManagement({
  employees,
  onEmployeesChange,
}: EmployeeManagementProps) {
  const employeeForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      lastName: "",
      document: "",
      position: "",
      phone: "",
      email: "",
      salary: 0,
    },
  });

  const getEmployeeStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "on_leave":
        return <Badge className="bg-blue-100 text-blue-800">On Leave</Badge>;
      case "sick_leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Sick Leave</Badge>
        );
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDepartmentBadge = (department: string) => {
    const translatedDept =
      departmentTranslations[
      department.toUpperCase() as keyof typeof departmentTranslations
      ] || department;

    const colorMap: Record<string, string> = {
      Housekeeping: "bg-blue-100 text-blue-800",
      Reception: "bg-green-100 text-green-800",
      Maintenance: "bg-orange-100 text-orange-800",
      Security: "bg-red-100 text-red-800",
      Restaurant: "bg-purple-100 text-purple-800",
      Kitchen: "bg-yellow-100 text-yellow-800",
      Bar: "bg-indigo-100 text-indigo-800",
      Management: "bg-gray-100 text-gray-800",
    };

    const colorClass = colorMap[translatedDept] || "bg-gray-100 text-gray-800";

    return <Badge className={colorClass}>{translatedDept}</Badge>;
  };

  const handleAddEmployee = (data: EmployeeFormData) => {
    const employee = {
      id: `EMP${String(employees.length + 1).padStart(3, "0")}`,
      name: data.name,
      lastName: data.lastName,
      document: data.document,
      position: data.position,
      department: "",
      phone: data.phone,
      email: data.email,
      hireDate: new Date().toISOString().split("T")[0],
      salary: data.salary,
      shift: "",
      status: "active",
      supervisor: "",
    };
    onEmployeesChange([...employees, employee]);
    employeeForm.reset();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Employee</DialogTitle>
              <DialogDescription>
                Register a new employee in the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={employeeForm.handleSubmit(handleAddEmployee)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Name</Label>
                    <Input
                      id="employeeName"
                      {...employeeForm.register("name")}
                      placeholder="Name"
                    />
                    {employeeForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...employeeForm.register("lastName")}
                      placeholder="Last Name"
                    />
                    {employeeForm.formState.errors.lastName && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="document">Document</Label>
                    <Input
                      id="document"
                      {...employeeForm.register("document")}
                      placeholder="Document number"
                    />
                    {employeeForm.formState.errors.document && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.document.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...employeeForm.register("phone")}
                      placeholder="+57 300 123 4567"
                    />
                    {employeeForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...employeeForm.register("email")}
                    placeholder="email@hotel.com"
                  />
                  {employeeForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {employeeForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Controller
                      name="position"
                      control={employeeForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Client">Client</SelectItem>
                            <SelectItem value="Administrator">
                              Administrator
                            </SelectItem>
                            <SelectItem value="Housekeeping Staff">
                              Housekeeping Staff
                            </SelectItem>
                            <SelectItem value="Maintenance Staff">
                              Maintenance Staff
                            </SelectItem>
                            <SelectItem value="Restaurant Staff">
                              Restaurant Staff
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {employeeForm.formState.errors.position && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.position.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      {...employeeForm.register("salary", {
                        valueAsNumber: true,
                      })}
                      placeholder="2500000"
                    />
                    {employeeForm.formState.errors.salary && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.salary.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Create Employee</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {employee.name} {employee.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {employee.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.document}</TableCell>
              <TableCell>
                {positionTranslations[
                  employee.position as keyof typeof positionTranslations
                ] || employee.position}
              </TableCell>
              <TableCell>{getDepartmentBadge(employee.department)}</TableCell>
              <TableCell>
                {shiftTranslations[
                  employee.shift as keyof typeof shiftTranslations
                ] || employee.shift}
              </TableCell>
              <TableCell>${employee.salary.toLocaleString()}</TableCell>
              <TableCell>{getEmployeeStatusBadge(employee.status)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
