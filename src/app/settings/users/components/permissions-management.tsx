"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SystemPermission, systemPermissionsApi } from "@/lib/api/roles";

export function PermissionsManagement() {
  const [permissionsByResource, setPermissionsByResource] = useState<
    Record<string, SystemPermission[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const permissionsByResourceData =
        await systemPermissionsApi.getByResource();
      setPermissionsByResource(permissionsByResourceData);
    } catch {
      toast.error("Error", {
        description: "Could not load permissions",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Permissions</CardTitle>
          <CardDescription>
            View of all available permissions organized by resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(permissionsByResource).map(
              ([resource, resourcePermissions]) => (
                <div key={resource}>
                  <h3 className="text-lg font-semibold mb-3 capitalize">
                    {resource.replace(/_/g, " ")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {resourcePermissions.map((permission) => (
                      <Card
                        key={`${resource}-permission-${permission.id}`}
                        className="p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {permission.action}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
