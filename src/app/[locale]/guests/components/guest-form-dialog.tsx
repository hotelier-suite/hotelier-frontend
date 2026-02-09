"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Guest } from "@/lib/features/guests/types";
import { guestsService } from "@/lib/features/guests/service";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

function createGuestSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string({ message: t("validationFieldRequired") })
      .min(2, t("validationNameMinLength"))
      .max(100, t("validationNameMaxLength")),
    email: z
      .string({ message: t("validationFieldRequired") })
      .email(t("validationEmailInvalid")),
    phone: z
      .string()
      .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, t("validationPhoneInvalid"))
      .optional()
      .or(z.literal("")),
    document: z
      .string()
      .regex(/^[A-Z0-9]{6,20}$/i, t("validationDocumentInvalid"))
      .optional()
      .or(z.literal("")),
    address: z.string().optional(),
    nationality: z.string().optional(),
    vip: z.boolean(),
  });
}

type GuestFormData = z.infer<ReturnType<typeof createGuestSchema>>;

interface GuestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGuest: Guest | null;
  onGuestSaved: (guest: Guest, isEdit: boolean) => void;
}

export function GuestFormDialog({
  open,
  onOpenChange,
  editingGuest,
  onGuestSaved,
}: GuestFormDialogProps) {
  const t = useTranslations("GuestFormDialog");
  const guestSchema = createGuestSchema(t);
  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      document: "",
      address: "",
      nationality: "",
      vip: false,
    },
  });

  useEffect(() => {
    if (editingGuest) {
      form.reset({
        name: editingGuest.name || "",
        email: editingGuest.email || "",
        phone: editingGuest.phone || "",
        document: editingGuest.document || "",
        address: editingGuest.address || "",
        nationality: editingGuest.nationality || "",
        vip: !!editingGuest.vip,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        document: "",
        address: "",
        nationality: "",
        vip: false,
      });
    }
  }, [editingGuest, form]);

  const onSubmit = async (data: GuestFormData) => {
    try {
      if (editingGuest) {
        const updated = await guestsService.update(editingGuest.id, data);
        onGuestSaved(updated, true);
      } else {
        const created = await guestsService.create(data);
        onGuestSaved(created, false);
      }
    } catch (e: unknown) {
      console.error("Error saving guest:", e);
      toast.error(t("error"), {
        description: e instanceof Error ? e.message : t("couldNotSave"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingGuest ? t("editGuest") : t("newGuest")}
          </DialogTitle>
          <DialogDescription>{t("completeGuestInfo")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("name")}</Label>
              <Input
                {...form.register("name")}
                className={form.formState.errors.name ? "border-red-500" : ""}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("email")}</Label>
              <Input
                type="email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("phone")}</Label>
              <Input
                {...form.register("phone")}
                className={form.formState.errors.phone ? "border-red-500" : ""}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("document")}</Label>
              <Input
                {...form.register("document")}
                className={
                  form.formState.errors.document ? "border-red-500" : ""
                }
              />
              {form.formState.errors.document && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.document.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("address")}</Label>
              <Input {...form.register("address")} />
            </div>
            <div className="space-y-2">
              <Label>{t("nationality")}</Label>
              <Input {...form.register("nationality")} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="vip"
              checked={useWatch({ control: form.control, name: "vip" })}
              onCheckedChange={(v) => form.setValue("vip", !!v)}
            />
            <Label htmlFor="vip">{t("vip")}</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? t("saving")
                : editingGuest
                  ? t("save")
                  : t("create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
