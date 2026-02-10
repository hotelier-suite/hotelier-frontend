import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
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

function createShiftSchema(t: (key: string) => string) {
  return z.object({
    employeeId: z.string().min(1, t("validationEmployeeRequired")),
    date: z.string().min(1, t("validationDateRequired")),
    type: z.string().min(1, t("validationShiftRequired")),
    startTime: z.string().min(1, t("validationStartTimeRequired")),
    endTime: z.string().min(1, t("validationEndTimeRequired")),
  });
}

type ShiftFormData = z.infer<ReturnType<typeof createShiftSchema>>;

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
  const t = useTranslations("AddShiftDialog");
  const shiftSchema = createShiftSchema(t);
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
          <DialogTitle>{t("addShift")}</DialogTitle>
          <DialogDescription>{t("completeDetails")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={shiftForm.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="employeeId">{t("employee")}</Label>
            <Controller
              name="employeeId"
              control={shiftForm.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectEmployee")} />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} {emp.lastName} -{" "}
                        {t(`positions.${emp.position}`)}
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
            <Label htmlFor="date">{t("date")}</Label>
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
            <Label htmlFor="type">{t("shiftType")}</Label>
            <Controller
              name="type"
              control={shiftForm.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING">{t("morning")}</SelectItem>
                    <SelectItem value="EVENING">{t("evening")}</SelectItem>
                    <SelectItem value="NIGHT">{t("night")}</SelectItem>
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
              <Label htmlFor="startTime">{t("startTime")}</Label>
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
              <Label htmlFor="endTime">{t("endTime")}</Label>
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
              {t("cancel")}
            </Button>
            <Button type="submit">{t("addShift")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
