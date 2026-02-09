import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface EmployeesTableProps {
  employees: Employee[];
}

const getEmployeeStatusBadge = (status: string, t: (key: string) => string) => {
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

const getDepartmentBadge = (department: string, t: (key: string) => string) => {
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

export function EmployeesTable({ employees }: EmployeesTableProps) {
  const t = useTranslations("EmployeesTable");
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("id")}</TableHead>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("document")}</TableHead>
            <TableHead>{t("position")}</TableHead>
            <TableHead>{t("department")}</TableHead>
            <TableHead>{t("phone")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("salary")}</TableHead>
            <TableHead>{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground"
              >
                {t("noEmployeesRegistered")}
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell>
                  {employee.name} {employee.lastName}
                </TableCell>
                <TableCell>{employee.document}</TableCell>
                <TableCell>{t(`positions.${employee.position}`)}</TableCell>
                <TableCell>
                  {getDepartmentBadge(employee.department, t)}
                </TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{formatCurrency(employee.salary)}</TableCell>
                <TableCell>
                  {getEmployeeStatusBadge(employee.status, t)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
