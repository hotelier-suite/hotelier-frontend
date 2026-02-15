"use client";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CreateRoleRequest } from "@/lib/features/roles/types";
import { Plus } from "lucide-react";

function createRoleSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string({ message: t("fieldRequired") })
      .min(1, t("roleNameRequired"))
      .max(50, t("maxChars50")),
    description: z.string().max(200, t("maxChars200")).optional(),
  });
}

type CreateRoleFormData = z.infer<ReturnType<typeof createRoleSchema>>;

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoleRequest) => void;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateRoleDialogProps) {
  const t = useTranslations("CreateRoleDialog");
  const roleSchema = createRoleSchema(t);
  const form = useForm<CreateRoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = (data: CreateRoleFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("createRole")}
        </Button>
      </DialogTrigger>
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
            <Label htmlFor="name">{t("roleName")}</Label>
            <Input
              id="name"
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
            <Label htmlFor="description">{t("descriptionLabel")}</Label>
            <Textarea
              id="description"
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
              {form.formState.isSubmitting ? t("creating") : t("createRole")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
