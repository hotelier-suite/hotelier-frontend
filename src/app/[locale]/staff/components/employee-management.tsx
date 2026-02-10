"use client";

import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
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

function createEmployeeSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t("validationNameMinLength")),
    lastName: z.string().min(2, t("validationLastNameMinLength")),
    document: z.string().min(5, t("validationDocumentMinLength")),
    position: z.string().min(1, t("validationPositionRequired")),
    phone: z.string().min(7, t("validationPhoneMinLength")),
    email: z.string().email(t("validationEmailInvalid")),
    salary: z.number().min(0, t("validationSalaryMin")),
  });
}

type EmployeeFormData = z.infer<ReturnType<typeof createEmployeeSchema>>;

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
  const t = useTranslations("EmployeeManagement");
  const employeeSchema = createEmployeeSchema(t);
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
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("statusActive")}
          </Badge>
        );
      case "on_leave":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {t("statusOnLeave")}
          </Badge>
        );
      case "sick_leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("statusSickLeave")}
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {t("statusInactive")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDepartmentBadge = (department: string) => {
    const normalizedDept = department.toUpperCase();
    const translatedDept = t(`departments.${normalizedDept}`);

    const colorMap: Record<string, string> = {
      HOUSEKEEPING: "bg-blue-100 text-blue-800",
      RECEPTION: "bg-green-100 text-green-800",
      MAINTENANCE: "bg-orange-100 text-orange-800",
      SECURITY: "bg-red-100 text-red-800",
      RESTAURANT: "bg-purple-100 text-purple-800",
      KITCHEN: "bg-yellow-100 text-yellow-800",
      BAR: "bg-indigo-100 text-indigo-800",
      MANAGEMENT: "bg-gray-100 text-gray-800",
    };

    const colorClass = colorMap[normalizedDept] || "bg-gray-100 text-gray-800";

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
              {t("newEmployee")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("newEmployee")}</DialogTitle>
              <DialogDescription>{t("registerNewEmployee")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={employeeForm.handleSubmit(handleAddEmployee)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">{t("name")}</Label>
                    <Input
                      id="employeeName"
                      {...employeeForm.register("name")}
                      placeholder={t("name")}
                    />
                    {employeeForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input
                      id="lastName"
                      {...employeeForm.register("lastName")}
                      placeholder={t("lastName")}
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
                    <Label htmlFor="document">{t("document")}</Label>
                    <Input
                      id="document"
                      {...employeeForm.register("document")}
                      placeholder={t("documentNumber")}
                    />
                    {employeeForm.formState.errors.document && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.document.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone")}</Label>
                    <Input
                      id="phone"
                      {...employeeForm.register("phone")}
                      placeholder={t("phonePlaceholder")}
                    />
                    {employeeForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...employeeForm.register("email")}
                    placeholder={t("emailPlaceholder")}
                  />
                  {employeeForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {employeeForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">{t("position")}</Label>
                    <Controller
                      name="position"
                      control={employeeForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectPosition")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Client">
                              {t("client")}
                            </SelectItem>
                            <SelectItem value="Administrator">
                              {t("administrator")}
                            </SelectItem>
                            <SelectItem value="Housekeeping Staff">
                              {t("housekeepingStaff")}
                            </SelectItem>
                            <SelectItem value="Maintenance Staff">
                              {t("maintenanceStaff")}
                            </SelectItem>
                            <SelectItem value="Restaurant Staff">
                              {t("restaurantStaff")}
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
                    <Label htmlFor="salary">{t("salary")}</Label>
                    <Input
                      id="salary"
                      type="number"
                      {...employeeForm.register("salary", {
                        valueAsNumber: true,
                      })}
                      placeholder={t("salaryPlaceholder")}
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
                    {t("cancel")}
                  </Button>
                  <Button type="submit">{t("createEmployee")}</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("employee")}</TableHead>
            <TableHead>{t("document")}</TableHead>
            <TableHead>{t("position")}</TableHead>
            <TableHead>{t("department")}</TableHead>
            <TableHead>{t("shift")}</TableHead>
            <TableHead>{t("salary")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
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
              <TableCell>{t(`positions.${employee.position}`)}</TableCell>
              <TableCell>{getDepartmentBadge(employee.department)}</TableCell>
              <TableCell>{t(`shifts.${employee.shift}`)}</TableCell>
              <TableCell>{formatCurrency(employee.salary)}</TableCell>
              <TableCell>{getEmployeeStatusBadge(employee.status)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  {t("edit")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
