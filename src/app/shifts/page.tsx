import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { shiftsService } from "@/lib/features/shifts/service";
import { employeesService } from "@/lib/features/employees/service";
import { ShiftsManagement } from "./components/shifts-management";

export const dynamic = "force-dynamic";

export default async function ShiftsPage() {
  // Fetch data server-side
  const [shifts, employees] = await Promise.all([
    shiftsService.getAll().catch(() => []),
    employeesService.getAll().catch(() => []),
  ]);

  // Calculate shift counts for summary cards
  const today = new Date().toISOString().split("T")[0];
  const todayShifts = shifts.filter((shift) => shift.date === today);
  const scheduledShifts = shifts.filter(
    (shift) => shift.status === "SCHEDULED",
  );
  const completedShifts = shifts.filter(
    (shift) => shift.status === "COMPLETED",
  );
  const cancelledShifts = shifts.filter(
    (shift) => shift.status === "CANCELLED",
  );

  const shiftCounts = {
    total: shifts.length,
    today: todayShifts.length,
    scheduled: scheduledShifts.length,
    completed: completedShifts.length,
    cancelled: cancelledShifts.length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shift Management</h1>
          <p className="text-gray-600 mt-1">
            Manage staff shifts and schedules
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shiftCounts.total}</div>
            <p className="text-xs text-muted-foreground">Registered shifts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shiftCounts.today}</div>
            <p className="text-xs text-muted-foreground">Today&apos;s shifts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shiftCounts.scheduled}</div>
            <p className="text-xs text-muted-foreground">Scheduled shifts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shiftCounts.completed}</div>
            <p className="text-xs text-muted-foreground">Completed shifts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shiftCounts.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled shifts</p>
          </CardContent>
        </Card>
      </div>

      {/* Shifts Management Component */}
      <ShiftsManagement
        initialShifts={shifts}
        employees={employees}
        shiftCounts={shiftCounts}
      />
    </div>
  );
}
