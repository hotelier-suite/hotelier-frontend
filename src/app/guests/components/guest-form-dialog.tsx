"use client";

import { useEffect } from "react";
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

const guestSchema = z.object({
  name: z
    .string({ message: "This field is required" })
    .min(2, "Must be at least 2 characters")
    .max(100, "Must be at most 100 characters"),
  email: z
    .string({ message: "This field is required" })
    .email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  document: z
    .string()
    .regex(/^[A-Z0-9]{6,20}$/i, "Invalid document format")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  nationality: z.string().optional(),
  vip: z.boolean(),
});

type GuestFormData = z.infer<typeof guestSchema>;

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
      toast.error("Error", {
        description: e instanceof Error ? e.message : "Could not save",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingGuest ? "Edit Guest" : "New Guest"}</DialogTitle>
          <DialogDescription>Complete the guest information</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
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
              <Label>Email</Label>
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
              <Label>Phone</Label>
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
              <Label>Document</Label>
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
              <Label>Address</Label>
              <Input {...form.register("address")} />
            </div>
            <div className="space-y-2">
              <Label>Nationality</Label>
              <Input {...form.register("nationality")} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="vip"
              checked={useWatch({ control: form.control, name: "vip" })}
              onCheckedChange={(v) => form.setValue("vip", !!v)}
            />
            <Label htmlFor="vip">VIP</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving..."
                : editingGuest
                  ? "Save"
                  : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
