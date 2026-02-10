// Attendance types
export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EARLY_LEAVE"
  | "SICK_LEAVE"
  | "VACATION";

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  notes?: string;
  hoursWorked?: number | string;
  overtimeHours?: number | string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: number;
    name: string;
    email: string;
    position: string;
    department: string;
  };
}

export interface ClockInData {
  employeeId: number;
  date: string;
  checkIn: string;
  notes?: string;
}
