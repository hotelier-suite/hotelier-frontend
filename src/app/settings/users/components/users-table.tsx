"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/lib/features/auth/types";
import { UserRow } from "./user-row";

interface UsersTableProps {
  users: User[];
  onAssignRoles: (user: User) => void;
}

export function UsersTable({ users, onAssignRoles }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Last Access</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} onAssignRoles={onAssignRoles} />
        ))}
      </TableBody>
    </Table>
  );
}
