// Shift types
export type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT" | "DOUBLE";
export type ShiftStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Shift {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
  status: ShiftStatus;
  position: string;
  department: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: number;
    name: string;
    role: string;
  };
}

export type CreateShiftDto = Omit<
  Shift,
  "id" | "createdAt" | "updatedAt" | "employee"
>;
export type UpdateShiftDto = Partial<CreateShiftDto>;
