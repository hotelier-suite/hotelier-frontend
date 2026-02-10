"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { type Shift } from "@/lib/features/shifts/types";
import { shiftsService } from "@/lib/features/shifts/service";
import { type Employee } from "@/lib/features/employees/types";

function createShiftSchemaFn(t: (key: string) => string) {
  return z
    .object({
      employeeId: z
        .string({ message: t("validation.employeeRequired") })
        .min(1, t("validation.selectEmployee")),
      date: z
        .string({ message: t("validation.dateRequired") })
        .min(1, t("validation.selectDate"))
        .refine((date) => {
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }, t("validation.dateNotBeforeToday")),
      type: z.enum(["REGULAR", "OVERTIME", "HOLIDAY"], {
        message: t("validation.selectShiftType"),
      }),
      startTime: z
        .string({ message: t("validation.startTimeRequired") })
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          t("validation.invalidTimeFormat"),
        ),
      endTime: z
        .string({ message: t("validation.endTimeRequired") })
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          t("validation.invalidTimeFormat"),
        ),
      position: z.enum(
        ["RECEPTION", "HOUSEKEEPING", "RESTAURANT", "MAINTENANCE", "SECURITY"],
        {
          message: t("validation.selectPosition"),
        },
      ),
    })
    .refine(
      (data) => {
        const start = new Date(`1970-01-01T${data.startTime}:00`);
        const end = new Date(`1970-01-01T${data.endTime}:00`);
        return end > start;
      },
      {
        message: t("validation.endTimeAfterStart"),
        path: ["endTime"],
      },
    );
}

type CreateShiftFormData = z.infer<ReturnType<typeof createShiftSchemaFn>>;

interface CreateShiftDialogProps {
  employees: Employee[];
  onShiftCreated: (shift: Shift) => void;
}

export function CreateShiftDialog({
  employees,
  onShiftCreated,
}: CreateShiftDialogProps) {
  const t = useTranslations("CreateShiftDialogComp");
  const createShiftSchema = createShiftSchemaFn(t);
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const form = useForm<CreateShiftFormData>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      type: "REGULAR",
      startTime: "08:00",
      endTime: "16:00",
      position: "RECEPTION",
    },
  });

  const onSubmit = async (data: CreateShiftFormData) => {
    try {
      setLoading(true);
      const shiftToCreate = {
        employeeId: parseInt(data.employeeId),
        date: data.date,
        type: data.type as Shift["type"],
        startTime: data.startTime,
        endTime: data.endTime,
        position: data.position,
        department: data.position, // Use position as department for now
        status: "SCHEDULED" as const,
      };

      const createdShift = await shiftsService.create(shiftToCreate);
      onShiftCreated(createdShift);

      form.reset();
      setOpenCreateDialog(false);
      toast.success(t("shiftCreatedSuccess"));
    } catch (error) {
      console.error("Error creating shift:", error);
      toast.error(t("errorCreatingShift"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("newShift")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("createNewShift")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">{t("employee")}</Label>
            <Select
              value={form.watch("employeeId")}
              onValueChange={(value) => form.setValue("employeeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectEmployee")} />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.employeeId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.employeeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{t("date")}</Label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
              disabled={form.formState.isSubmitting}
              className={form.formState.errors.date ? "border-red-500" : ""}
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-500">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">{t("startTime")}</Label>
              <Input
                id="startTime"
                type="time"
                {...form.register("startTime")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.startTime ? "border-red-500" : ""
                }
              />
              {form.formState.errors.startTime && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.startTime.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">{t("endTime")}</Label>
              <Input
                id="endTime"
                type="time"
                {...form.register("endTime")}
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.endTime ? "border-red-500" : ""
                }
              />
              {form.formState.errors.endTime && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">{t("position")}</Label>
            <Select
              value={form.watch("position")}
              onValueChange={(value) =>
                form.setValue(
                  "position",
                  value as
                    | "RECEPTION"
                    | "HOUSEKEEPING"
                    | "RESTAURANT"
                    | "MAINTENANCE"
                    | "SECURITY",
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RECEPTION">{t("reception")}</SelectItem>
                <SelectItem value="HOUSEKEEPING">
                  {t("housekeeping")}
                </SelectItem>
                <SelectItem value="RESTAURANT">{t("restaurant")}</SelectItem>
                <SelectItem value="MAINTENANCE">{t("maintenance")}</SelectItem>
                <SelectItem value="SECURITY">{t("security")}</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.position && (
              <p className="text-sm text-red-500">
                {form.formState.errors.position.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenCreateDialog(false)}
              className="flex-1"
              disabled={loading || form.formState.isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || form.formState.isSubmitting}
            >
              {(loading || form.formState.isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("createShift")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
