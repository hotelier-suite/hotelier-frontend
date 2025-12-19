"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { SystemRole, UpdateRoleRequest } from "@/lib/api/roles";

const updateRoleSchema = z.object({
  name: z
    .string({ message: "This field is required" })
    .min(1, "Role name is required")
    .max(50, "Must have a maximum of 50 characters"),
  description: z
    .string()
    .max(200, "Must have a maximum of 200 characters")
    .optional(),
});

type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;

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
  const form = useForm<UpdateRoleFormData>({
    resolver: zodResolver(updateRoleSchema),
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
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Modify the details of the selected role
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-name">Role Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g. senior_receptionist"
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
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Describe the responsibilities of this role..."
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
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Updating..."
                : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
