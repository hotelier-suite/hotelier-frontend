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

function createEmployeeSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t("validationNameMinLength")),
    lastName: z.string().min(2, t("validationLastNameMinLength")),
    document: z.string().min(5, t("validationDocumentMinLength")),
    position: z.string().min(1, t("validationSelectPosition")),
    phone: z.string().min(7, t("validationPhoneMinLength")),
    email: z.string().email(t("validationEmailInvalid")),
    salary: z.number().min(0, t("validationSalaryMin")),
  });
}

type EmployeeFormData = z.infer<ReturnType<typeof createEmployeeSchema>>;

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
  const t = useTranslations("AddEmployeeDialog");
  const employeeSchema = createEmployeeSchema(t);
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
          <DialogTitle>{t("addEmployee")}</DialogTitle>
          <DialogDescription>{t("completeDetails")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={employeeForm.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                {...employeeForm.register("name")}
                placeholder={t("placeholderName")}
              />
              {employeeForm.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t("lastName")}</Label>
              <Input
                id="lastName"
                {...employeeForm.register("lastName")}
                placeholder={t("placeholderLastName")}
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
              <Label htmlFor="document">{t("document")}</Label>
              <Input
                id="document"
                {...employeeForm.register("document")}
                placeholder={t("placeholderDocument")}
              />
              {employeeForm.formState.errors.document && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.document.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">{t("position")}</Label>
              <Controller
                name="position"
                control={employeeForm.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectPosition")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER">{t("manager")}</SelectItem>
                      <SelectItem value="RECEPTIONIST">
                        {t("receptionist")}
                      </SelectItem>
                      <SelectItem value="HOUSEKEEPER">
                        {t("housekeepingStaff")}
                      </SelectItem>
                      <SelectItem value="MAINTENANCE">
                        {t("maintenance")}
                      </SelectItem>
                      <SelectItem value="CHEF">{t("chef")}</SelectItem>
                      <SelectItem value="WAITER">{t("waiter")}</SelectItem>
                      <SelectItem value="SECURITY">{t("security")}</SelectItem>
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
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                {...employeeForm.register("phone")}
                placeholder={t("placeholderPhone")}
              />
              {employeeForm.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                {...employeeForm.register("email")}
                placeholder={t("placeholderEmail")}
              />
              {employeeForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">{t("salary")}</Label>
            <Input
              id="salary"
              type="number"
              {...employeeForm.register("salary", { valueAsNumber: true })}
              placeholder={t("placeholderSalary")}
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
              {t("cancel")}
            </Button>
            <Button type="submit">{t("addEmployee")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
