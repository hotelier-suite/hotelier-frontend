"use client";

import { useState, useEffect, startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SystemRole } from "@/lib/features/roles/types";
import type { User } from "@/lib/features/auth/types";

interface AssignRolesDialogProps {
  user: User | null;
  roles: SystemRole[];
  userRoles: SystemRole[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: number, roleIds: number[]) => void;
}

export function AssignRolesDialog({
  user,
  roles,
  userRoles,
  open,
  onOpenChange,
  onSubmit,
}: AssignRolesDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  useEffect(() => {
    if (open && userRoles && userRoles.length > 0) {
      const currentRoles = userRoles.map((role) => role.id);
      console.log("Setting selected roles from user roles:", currentRoles);
      startTransition(() => {
        setSelectedRoles(currentRoles);
      });
    } else if (open && (!userRoles || userRoles.length === 0)) {
      console.log("No user roles found, clearing selection");
      startTransition(() => {
        setSelectedRoles([]);
      });
    }
  }, [open, userRoles]);

  useEffect(() => {
    console.log("Selected roles updated:", selectedRoles);
  }, [selectedRoles]);

  const handleSubmit = () => {
    if (user) {
      onSubmit(Number(user.id), selectedRoles);
    }
  };

  const toggleRole = (roleId: number) => {
    const validRoleId = Number.isInteger(roleId) ? roleId : Number(roleId);

    if (!Number.isInteger(validRoleId) || validRoleId <= 0) {
      console.error("Invalid role ID:", roleId);
      return;
    }

    setSelectedRoles((prev) =>
      prev.includes(validRoleId)
        ? prev.filter((id) => id !== validRoleId)
        : [...prev, validRoleId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Roles</DialogTitle>
          <DialogDescription>
            Select roles for user: {user?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-2">
            {roles.map((role) => {
              const isChecked = selectedRoles.includes(role.id);

              return (
                <div
                  key={role.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => toggleRole(role.id)}
                >
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={isChecked}
                    onCheckedChange={() => toggleRole(role.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{role.name}</span>
                        {role.isSystem && (
                          <Badge variant="outline" className="text-xs">
                            System
                          </Badge>
                        )}
                      </div>
                      {role.description && (
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {role.description}
                        </p>
                      )}
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter className="border-t pt-4 mt-2">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {selectedRoles.length}{" "}
              {selectedRoles.length === 1 ? "role selected" : "roles selected"}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Assign Roles</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
