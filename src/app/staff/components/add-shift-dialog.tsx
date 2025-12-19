import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const shiftSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  date: z.string().min(1, "Date is required"),
  type: z.string().min(1, "Please select a shift type"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type ShiftFormData = z.infer<typeof shiftSchema>;

interface Employee {
  id: string;
  name: string;
  lastName: string;
  position: string;
  department: string;
}

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onAddShift: (data: ShiftFormData) => void;
}

export function AddShiftDialog({
  open,
  onOpenChange,
  employees,
  onAddShift,
}: AddShiftDialogProps) {
  const shiftForm = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      employeeId: "",
      date: "",
      type: "",
      startTime: "",
      endTime: "",
    },
  });

  const handleSubmit = (data: ShiftFormData) => {
    onAddShift(data);
    shiftForm.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Shift</DialogTitle>
          <DialogDescription>
            Complete the details to schedule a new shift.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={shiftForm.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee</Label>
            <Controller
              name="employeeId"
              control={shiftForm.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} {emp.lastName} - {emp.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {shiftForm.formState.errors.employeeId && (
              <p className="text-sm text-red-500">
                {shiftForm.formState.errors.employeeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller
              name="date"
              control={shiftForm.control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            {shiftForm.formState.errors.date && (
              <p className="text-sm text-red-500">
                {shiftForm.formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Shift Type</Label>
            <Controller
              name="type"
              control={shiftForm.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING">Morning</SelectItem>
                    <SelectItem value="EVENING">Evening</SelectItem>
                    <SelectItem value="NIGHT">Night</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {shiftForm.formState.errors.type && (
              <p className="text-sm text-red-500">
                {shiftForm.formState.errors.type.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Controller
                name="startTime"
                control={shiftForm.control}
                render={({ field }) => <Input type="time" {...field} />}
              />
              {shiftForm.formState.errors.startTime && (
                <p className="text-sm text-red-500">
                  {shiftForm.formState.errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Controller
                name="endTime"
                control={shiftForm.control}
                render={({ field }) => <Input type="time" {...field} />}
              />
              {shiftForm.formState.errors.endTime && (
                <p className="text-sm text-red-500">
                  {shiftForm.formState.errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Shift</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
