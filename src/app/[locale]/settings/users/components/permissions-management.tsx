"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { systemPermissionsService } from "@/lib/features/roles/service";
import type { SystemPermission } from "@/lib/features/roles/types";

export function PermissionsManagement() {
  const t = useTranslations("PermissionsManagementComp");
  const [permissionsByResource, setPermissionsByResource] = useState<
    Record<string, SystemPermission[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const permissionsByResourceData =
          await systemPermissionsService.getByResource();
        setPermissionsByResource(permissionsByResourceData);
      } catch {
        toast.error(t("error"), {
          description: t("errorLoadPermissions"),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [t]);

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
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(permissionsByResource).map(
              ([resource, resourcePermissions]) => (
                <div key={resource}>
                  <h3 className="text-lg font-semibold mb-3 capitalize">
                    {t(`resources.${resource}`)}
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
                              {t(`actions.${permission.action}`)}
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
