"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { rolesService } from "@/lib/features/roles/service";
import { authService } from "@/lib/features/auth/service";
import { usersService } from "@/lib/features/users/service";
import type { SystemRole } from "@/lib/features/roles/types";
import type { User } from "@/lib/features/auth/types";
import { Users } from "lucide-react";
import { AssignRolesDialog } from "./assign-roles-dialog";
import { UserSearch } from "./user-search";
import { UsersTable } from "./users-table";
import { LoadingState } from "./loading-state";

interface UsersManagementProps {
  initialUsers: User[];
  initialRoles: SystemRole[];
}

export function UsersManagement({
  initialUsers,
  initialRoles,
}: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<SystemRole[]>(initialRoles);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleAssignDialogOpen, setRoleAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<SystemRole[]>([]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        authService.getAllUsers(),
        rolesService.getAll(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch {
      toast.error("Error", {
        description: "Could not load the data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoles = async (userId: number, roleIds: number[]) => {
    try {
      // Log for debugging
      console.log("Assigning roles:", { userId, roleIds });

      // Validate input
      if (!userId || !Number.isInteger(userId)) {
        throw new Error("Invalid user ID");
      }

      if (!Array.isArray(roleIds)) {
        throw new Error("Role IDs must be an array");
      }

      // Filter out any invalid role IDs
      const validRoleIds = roleIds.filter(
        (id) => id != null && Number.isInteger(id) && id > 0,
      );

      if (validRoleIds.length !== roleIds.length) {
        console.warn("Some invalid role IDs were filtered out:", {
          original: roleIds,
          valid: validRoleIds,
        });
      }

      await usersService.update(userId, { roleIds: validRoleIds });
      await refreshData();
      toast("Success", { description: "Roles assigned successfully" });

      // Close dialog and clear state
      setRoleAssignDialogOpen(false);
      setSelectedUser(null);
      setSelectedUserRoles([]);
    } catch (error) {
      console.error("Failed to assign roles:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Could not assign the roles",
      });
    }
  };

  const openRoleAssignDialog = async (user: User) => {
    try {
      setSelectedUser(user);
      const userRoles = await rolesService.getUserRoles(Number(user.id));
      console.log("Fetched user roles:", userRoles);
      setSelectedUserRoles(userRoles);
      setRoleAssignDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch user roles:", error);
      toast.error("Error", {
        description: "Could not load the user's roles",
      });
    }
  };

  const handleCloseDialog = (open: boolean) => {
    setRoleAssignDialogOpen(open);
    if (!open) {
      // Clear state when dialog closes
      setSelectedUser(null);
      setSelectedUserRoles([]);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            System Users
          </CardTitle>
          <CardDescription>
            Manage users and assign roles based on their responsibilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <UsersTable
            users={filteredUsers}
            onAssignRoles={openRoleAssignDialog}
          />
        </CardContent>
      </Card>

      <AssignRolesDialog
        user={selectedUser}
        roles={roles}
        userRoles={selectedUserRoles}
        open={roleAssignDialogOpen}
        onOpenChange={handleCloseDialog}
        onSubmit={handleAssignRoles}
      />
    </div>
  );
}
