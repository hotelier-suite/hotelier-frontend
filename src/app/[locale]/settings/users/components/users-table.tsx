"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("UsersTableComp");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("user")}</TableHead>
          <TableHead>{t("email")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("roles")}</TableHead>
          <TableHead>{t("lastAccess")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
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
