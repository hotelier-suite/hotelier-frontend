"use client";

import { useTranslations } from "next-intl";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InventoryMovement } from "@/lib/features/inventory/types";

interface MovementsHistoryProps {
  movements: InventoryMovement[];
}

export function MovementsHistory({ movements }: MovementsHistoryProps) {
  const t = useTranslations("MovementsHistory");
  const getMovementTypeBadge = (type: string) => {
    return type === "inbound" ? (
      <Badge className="bg-green-100 text-green-800">{t("entry")}</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">{t("exit")}</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("item")}</TableHead>
              <TableHead>{t("quantity")}</TableHead>
              <TableHead>{t("responsible")}</TableHead>
              <TableHead>{t("reason")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{movement.date}</TableCell>
                <TableCell>{getMovementTypeBadge(movement.type)}</TableCell>
                <TableCell className="font-medium">{movement.item}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{movement.user}</TableCell>
                <TableCell>{movement.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
