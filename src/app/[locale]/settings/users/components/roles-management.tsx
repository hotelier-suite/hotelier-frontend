"use client";

import { useState, useEffect, useReducer } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  rolesService,
  systemPermissionsService,
} from "@/lib/features/roles/service";
import type {
  SystemRole,
  SystemPermission,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "@/lib/features/roles/types";
import { Edit, Shield, Trash2 } from "lucide-react";
import { CreateRoleDialog } from "./create-role-dialog";
import { EditRoleDialog } from "./edit-role-dialog";
import { AssignPermissionsDialog } from "./assign-permissions-dialog";

export function RolesManagement() {
  const t = useTranslations("RolesManagementComp");
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [permissions, setPermissions] = useState<SystemPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [refreshKey, refresh] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [rolesData, permissionsData] = await Promise.all([
          rolesService.getAll(),
          systemPermissionsService.getAll(),
        ]);
        setRoles(rolesData);
        setPermissions(permissionsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error(t("error"), {
          description: t("errorLoadData"),
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [t, refreshKey]);

  const handleCreateRole = async (data: CreateRoleRequest) => {
    try {
      await rolesService.create(data);
      refresh();
      setCreateDialogOpen(false);
      toast(t("success"), { description: t("roleCreated") });
    } catch {
      toast.error(t("error"), { description: t("errorCreateRole") });
    }
  };

  const handleUpdateRole = async (data: UpdateRoleRequest) => {
    if (!selectedRole) return;

    try {
      await rolesService.update(selectedRole.id, data);
      refresh();
      setEditDialogOpen(false);
      setSelectedRole(null);
      toast(t("success"), { description: t("roleUpdated") });
    } catch {
      toast.error(t("error"), { description: t("errorUpdateRole") });
    }
  };

  const handleDeleteRole = async (role: SystemRole) => {
    try {
      await rolesService.delete(role.id);
      refresh();
      toast(t("success"), { description: t("roleDeleted") });
    } catch {
      toast.error(t("error"), { description: t("errorDeleteRole") });
    }
  };

  const handleAssignPermissions = async (
    roleId: number,
    permissionIds: number[],
  ) => {
    try {
      await rolesService.update(roleId, { permissionIds });
      refresh();
      setPermissionsDialogOpen(false);
      setSelectedRole(null);
      toast(t("success"), { description: t("permissionsAssigned") });
    } catch {
      toast.error(t("error"), {
        description: t("errorAssignPermissions"),
      });
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <CreateRoleDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onSubmit={handleCreateRole}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("descriptionCol")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("permissions")}</TableHead>
                <TableHead>{t("users")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={role.isSystem ? "secondary" : "default"}>
                      {role.isSystem ? t("system") : t("custom")}
                    </Badge>
                  </TableCell>
                  <TableCell>{role.permissions?.length || 0}</TableCell>
                  <TableCell>{role.userRoles?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role);
                          setEditDialogOpen(true);
                        }}
                        disabled={role.isSystem}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role);
                          setPermissionsDialogOpen(true);
                        }}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              role.isSystem || (role.userRoles?.length || 0) > 0
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("areYouSure")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("deleteConfirmation")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRole(role)}
                            >
                              {t("delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <EditRoleDialog
        role={selectedRole}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateRole}
      />

      {/* Assign Permissions Dialog */}
      <AssignPermissionsDialog
        role={selectedRole}
        permissions={permissions}
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        onSubmit={handleAssignPermissions}
      />
    </div>
  );
}
