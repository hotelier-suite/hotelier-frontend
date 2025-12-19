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
  shiftStatusTranslations,
  departmentTranslations,
} from "@/lib/translations/staff";

interface Shift {
  id: string;
  employeeId: string;
  employee: {
    id: number;
    employeeId: string;
    name: string;
    department: string;
    position: string;
    shift: string;
    status: string;
  };
  date: string;
  type: string;
  startTime: string;
  endTime: string;
  department: string;
  status: string;
}

interface ShiftsTableProps {
  shifts: Shift[];
}

const getShiftTypeLabel = (type: string) => {
  const normalizedType = type.toUpperCase();
  switch (normalizedType) {
    case "MORNING":
      return "Morning";
    case "EVENING":
      return "Evening";
    case "NIGHT":
      return "Night";
    default:
      return type;
  }
};

const getShiftStatusBadge = (status: string) => {
  const normalizedStatus = status.toUpperCase();
  const translatedStatus =
    shiftStatusTranslations[
    normalizedStatus as keyof typeof shiftStatusTranslations
    ] || status;

  switch (normalizedStatus) {
    case "SCHEDULED":
      return (
        <Badge className="bg-blue-100 text-blue-800">{translatedStatus}</Badge>
      );
    case "ACTIVE":
      return (
        <Badge className="bg-green-100 text-green-800">
          {translatedStatus}
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="bg-emerald-100 text-emerald-800">
          {translatedStatus}
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="bg-red-100 text-red-800">{translatedStatus}</Badge>
      );
    case "NO_SHOW":
      return (
        <Badge className="bg-orange-100 text-orange-800">
          {translatedStatus}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{translatedStatus}</Badge>;
  }
};

const getDepartmentBadge = (department: string) => {
  const normalizedDept = department.toUpperCase();
  const translatedDept =
    departmentTranslations[
    normalizedDept as keyof typeof departmentTranslations
    ] || department;

  switch (department.toLowerCase()) {
    case "housekeeping":
      return (
        <Badge className="bg-blue-100 text-blue-800">{translatedDept}</Badge>
      );
    case "front_desk":
      return (
        <Badge className="bg-green-100 text-green-800">{translatedDept}</Badge>
      );
    case "maintenance":
      return (
        <Badge className="bg-orange-100 text-orange-800">
          {translatedDept}
        </Badge>
      );
    case "security":
      return (
        <Badge className="bg-red-100 text-red-800">{translatedDept}</Badge>
      );
    case "restaurant":
      return (
        <Badge className="bg-purple-100 text-purple-800">
          {translatedDept}
        </Badge>
      );
    case "management":
      return (
        <Badge className="bg-gray-100 text-gray-800">{translatedDept}</Badge>
      );
    default:
      return <Badge variant="outline">{translatedDept}</Badge>;
  }
};

export function ShiftsTable({ shifts }: ShiftsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Shift Type</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No shifts scheduled
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">
                  {shift.employee.name}
                  <div className="text-sm text-muted-foreground">
                    {shift.employee.position}
                  </div>
                </TableCell>
                <TableCell>
                  {getDepartmentBadge(shift.employee.department)}
                </TableCell>
                <TableCell>
                  {new Date(shift.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{getShiftTypeLabel(shift.type)}</TableCell>
                <TableCell>
                  {shift.startTime} - {shift.endTime}
                </TableCell>
                <TableCell>{getShiftStatusBadge(shift.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
