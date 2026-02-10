import type { Attendance } from "@/lib/features/attendance/types";

export const calculateHours = (clockIn: string, clockOut: string) => {
  if (!clockIn || !clockOut) return 0;
  const start = new Date(`2000-01-01T${clockIn}:00`);
  const end = new Date(`2000-01-01T${clockOut}:00`);
  let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  if (diff < 0) diff += 24; // Handle overnight shifts
  return Math.round(diff * 100) / 100;
};

export interface AttendanceSummary {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageHours: number;
}

export const calculateSummary = (
  records: Attendance[],
  totalEmployees: number,
): AttendanceSummary => {
  return {
    totalEmployees,
    presentToday: records.filter((r) => r.status === "PRESENT").length,
    absentToday: records.filter((r) => r.status === "ABSENT").length,
    lateToday: records.filter((r) => r.status === "LATE").length,
    averageHours:
      records.reduce(
        (acc, r) =>
          acc + (typeof r.hoursWorked === "number" ? r.hoursWorked : 0),
        0,
      ) / Math.max(records.length, 1),
  };
};
