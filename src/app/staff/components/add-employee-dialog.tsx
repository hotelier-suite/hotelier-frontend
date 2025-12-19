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

const employeeSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  lastName: z.string().min(2, "Last name must have at least 2 characters"),
  document: z.string().min(5, "Document must have at least 5 characters"),
  position: z.string().min(1, "Please select a position"),
  phone: z.string().min(7, "Phone must have at least 7 characters"),
  email: z.string().email("Please enter a valid email"),
  salary: z.number().min(0, "Salary must be greater than or equal to 0"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (data: EmployeeFormData) => void;
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
  onAddEmployee,
}: AddEmployeeDialogProps) {
  const employeeForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      lastName: "",
      document: "",
      position: "",
      phone: "",
      email: "",
      salary: 0,
    },
  });

  const handleSubmit = (data: EmployeeFormData) => {
    onAddEmployee(data);
    employeeForm.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Complete the new employee details.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={employeeForm.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...employeeForm.register("name")}
                placeholder="Juan"
              />
              {employeeForm.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...employeeForm.register("lastName")}
                placeholder="Smith"
              />
              {employeeForm.formState.errors.lastName && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document">Document</Label>
              <Input
                id="document"
                {...employeeForm.register("document")}
                placeholder="12345678"
              />
              {employeeForm.formState.errors.document && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.document.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Controller
                name="position"
                control={employeeForm.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="RECEPTIONIST">
                        Receptionist
                      </SelectItem>
                      <SelectItem value="HOUSEKEEPER">
                        Housekeeping Staff
                      </SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="CHEF">Chef</SelectItem>
                      <SelectItem value="WAITER">Waiter</SelectItem>
                      <SelectItem value="SECURITY">Security</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {employeeForm.formState.errors.position && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.position.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...employeeForm.register("phone")}
                placeholder="+57 300 123 4567"
              />
              {employeeForm.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...employeeForm.register("email")}
                placeholder="employee@hotel.com"
              />
              {employeeForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              {...employeeForm.register("salary", { valueAsNumber: true })}
              placeholder="1500000"
            />
            {employeeForm.formState.errors.salary && (
              <p className="text-sm text-red-500">
                {employeeForm.formState.errors.salary.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
