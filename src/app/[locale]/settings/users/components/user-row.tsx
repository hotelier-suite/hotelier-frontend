"use client";

import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Shield } from "lucide-react";
import type { User } from "@/lib/features/auth/types";

interface UserRowProps {
  user: User;
  onAssignRoles: (user: User) => void;
}

export function UserRow({ user, onAssignRoles }: UserRowProps) {
  const t = useTranslations("UserRow");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  const roles = user.userRoles?.map((ur) => ur.role) ?? [];

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium">{user.name}</span>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant="default">{t("active")}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {roles.length > 0 ? (
            roles.map((role) => (
              <Badge key={role.id} variant="secondary" className="text-xs">
                {role.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">
              {t("noRoles")}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-muted-foreground text-sm">
          {user.lastVisit
            ? new Date(user.lastVisit).toLocaleDateString(intlLocale)
            : t("never")}
        </span>
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={() => onAssignRoles(user)}>
          <Shield className="h-4 w-4 mr-2" />
          {t("assignRoles")}
        </Button>
      </TableCell>
    </TableRow>
  );
}
