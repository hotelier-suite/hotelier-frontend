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
  positionTranslations,
  departmentTranslations,
} from "@/lib/translations/staff";

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

export function EmployeesTable({ employees }: EmployeesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground"
              >
                No employees registered
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
                <TableCell>
                  {positionTranslations[
                    employee.position.toUpperCase() as keyof typeof positionTranslations
                  ] || employee.position}
                </TableCell>
                <TableCell>{getDepartmentBadge(employee.department)}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>${employee.salary.toLocaleString()}</TableCell>
                <TableCell>{getEmployeeStatusBadge(employee.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
