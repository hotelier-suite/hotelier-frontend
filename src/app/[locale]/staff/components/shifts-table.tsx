import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const getShiftTypeLabel = (type: string, t: (key: string) => string) => {
  const normalizedType = type.toUpperCase();
  switch (normalizedType) {
    case "MORNING":
      return t("morning");
    case "EVENING":
      return t("evening");
    case "NIGHT":
      return t("night");
    default:
      return type;
  }
};

const getShiftStatusBadge = (status: string, t: (key: string) => string) => {
  const normalizedStatus = status.toUpperCase();
  const translatedStatus = t(`shiftStatuses.${normalizedStatus}`);

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

const getDepartmentBadge = (department: string, t: (key: string) => string) => {
  const normalizedDept = department.toUpperCase();
  const translatedDept = t(`departments.${normalizedDept}`);

  switch (normalizedDept) {
    case "HOUSEKEEPING":
      return (
        <Badge className="bg-blue-100 text-blue-800">{translatedDept}</Badge>
      );
    case "FRONT_DESK":
      return (
        <Badge className="bg-green-100 text-green-800">{translatedDept}</Badge>
      );
    case "MAINTENANCE":
      return (
        <Badge className="bg-orange-100 text-orange-800">
          {translatedDept}
        </Badge>
      );
    case "SECURITY":
      return (
        <Badge className="bg-red-100 text-red-800">{translatedDept}</Badge>
      );
    case "RESTAURANT":
      return (
        <Badge className="bg-purple-100 text-purple-800">
          {translatedDept}
        </Badge>
      );
    case "MANAGEMENT":
      return (
        <Badge className="bg-gray-100 text-gray-800">{translatedDept}</Badge>
      );
    default:
      return <Badge variant="outline">{translatedDept}</Badge>;
  }
};

export function ShiftsTable({ shifts }: ShiftsTableProps) {
  const t = useTranslations("ShiftsTable");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("employee")}</TableHead>
            <TableHead>{t("department")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("shiftType")}</TableHead>
            <TableHead>{t("time")}</TableHead>
            <TableHead>{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                {t("noShiftsScheduled")}
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">
                  {shift.employee.name}
                  <div className="text-sm text-muted-foreground">
                    {t(`positions.${shift.employee.position}`)}
                  </div>
                </TableCell>
                <TableCell>
                  {getDepartmentBadge(shift.employee.department, t)}
                </TableCell>
                <TableCell>
                  {new Date(shift.date).toLocaleDateString(intlLocale)}
                </TableCell>
                <TableCell>{getShiftTypeLabel(shift.type, t)}</TableCell>
                <TableCell>
                  {shift.startTime} - {shift.endTime}
                </TableCell>
                <TableCell>{getShiftStatusBadge(shift.status, t)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
