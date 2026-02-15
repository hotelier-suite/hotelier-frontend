"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SystemRole, UpdateRoleRequest } from "@/lib/features/roles/types";

function createUpdateRoleSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string({ message: t("fieldRequired") })
      .min(1, t("roleNameRequired"))
      .max(50, t("maxChars50")),
    description: z.string().max(200, t("maxChars200")).optional(),
  });
}

type UpdateRoleFormData = z.infer<ReturnType<typeof createUpdateRoleSchema>>;

interface EditRoleDialogProps {
  role: SystemRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateRoleRequest) => void;
}

export function EditRoleDialog({
  role,
  open,
  onOpenChange,
  onSubmit,
}: EditRoleDialogProps) {
  const t = useTranslations("EditRoleDialog");
  const roleSchema = createUpdateRoleSchema(t);
  const form = useForm<UpdateRoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description || "",
      });
    }
  }, [role, form]);

  const handleFormSubmit = (data: UpdateRoleFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t("roleName")}</Label>
            <Input
              id="edit-name"
              placeholder={t("roleNamePlaceholder")}
              {...form.register("name")}
              disabled={form.formState.isSubmitting}
              className={form.formState.errors.name ? "border-red-500" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">{t("descriptionLabel")}</Label>
            <Textarea
              id="edit-description"
              placeholder={t("descriptionPlaceholder")}
              {...form.register("description")}
              disabled={form.formState.isSubmitting}
              className={
                form.formState.errors.description ? "border-red-500" : ""
              }
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t("updating") : t("updateRole")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
