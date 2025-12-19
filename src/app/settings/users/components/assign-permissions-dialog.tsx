"use client";

import { useState, useEffect, startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SystemRole, SystemPermission } from "@/lib/api/roles";

interface AssignPermissionsDialogProps {
  role: SystemRole | null;
  permissions: SystemPermission[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (roleId: number, permissionIds: number[]) => void;
}

export function AssignPermissionsDialog({
  role,
  permissions,
  open,
  onOpenChange,
  onSubmit,
}: AssignPermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    if (role) {
      const currentPermissions =
        role.permissions?.map((rp) => rp.permissionId) || [];
      startTransition(() => {
        setSelectedPermissions(currentPermissions);
      });
    }
  }, [role]);

  const handleSubmit = () => {
    if (role) {
      onSubmit(role.id, selectedPermissions);
    }
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  // Group permissions by resource
  const permissionsByResource = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    },
    {} as Record<string, SystemPermission[]>,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Permissions</DialogTitle>
          <DialogDescription>
            Select permissions for role: {role?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {Object.entries(permissionsByResource).map(
            ([resource, resourcePermissions]) => (
              <div key={resource}>
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {resource.replace(/_/g, " ")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resourcePermissions.map((permission) => (
                    <div
                      key={`${resource}-${permission.id}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`permission-${resource}-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <Label
                        htmlFor={`permission-${resource}-${permission.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <div>
                          <Badge variant="outline" className="mr-2">
                            {permission.action}
                          </Badge>
                          {permission.description}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Permissions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
