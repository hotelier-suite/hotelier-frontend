"use client";

import { useState } from "react";
import { toast } from "sonner";
import { type Shift } from "@/lib/features/shifts/types";
import { shiftsService } from "@/lib/features/shifts/service";
import { type Employee } from "@/lib/features/employees/types";
import { ShiftFilters } from "./shift-filters";
import { CreateShiftDialog } from "./create-shift-dialog";
import { ShiftsList } from "./shifts-list";

interface ShiftsManagementProps {
  initialShifts: Shift[];
  employees: Employee[];
  shiftCounts: {
    total: number;
    today: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
}

export function ShiftsManagement({
  initialShifts,
  employees,
}: ShiftsManagementProps) {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handleShiftCreated = (newShift: Shift) => {
    setShifts((prev) => [newShift, ...prev]);
  };

  const handleUpdateShiftStatus = async (
    shiftId: number,
    status: Shift["status"],
  ) => {
    try {
      const updatedShift = await shiftsService.update(shiftId, { status });
      setShifts((prev) =>
        prev.map((shift) => (shift.id === shiftId ? updatedShift : shift)),
      );
      toast.success("Shift status updated");
    } catch (error) {
      console.error("Error updating shift status:", error);
      toast.error("Error updating status");
    }
  };

  const handleDeleteShift = async (shiftId: number) => {
    if (!confirm("Are you sure you want to delete this shift?")) return;

    try {
      await shiftsService.delete(shiftId);
      setShifts((prev) => prev.filter((shift) => shift.id !== shiftId));
      toast.success("Shift deleted successfully");
    } catch (error) {
      console.error("Error deleting shift:", error);
      toast.error("Error deleting shift");
    }
  };

  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      shift.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || shift.position === departmentFilter;
    const matchesDate = shift.date === selectedDate;

    return matchesSearch && matchesDepartment && matchesDate;
  });

  return (
    <>
      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <ShiftFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
        />

        <CreateShiftDialog
          employees={employees}
          onShiftCreated={handleShiftCreated}
        />
      </div>

      {/* Shifts List */}
      <ShiftsList
        shifts={filteredShifts}
        onUpdateShiftStatus={handleUpdateShiftStatus}
        onDeleteShift={handleDeleteShift}
      />
    </>
  );
}
