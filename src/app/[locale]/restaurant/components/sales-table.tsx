"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalesTableProps {
  sales: Array<{
    date: string;
    roomService: number;
    diningRoom: number;
    bar: number;
    total: number;
    orders: number;
  }>;
}

export function SalesTable({ sales }: SalesTableProps) {
  const t = useTranslations("SalesTableComp");
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
              <TableHead>{t("roomService")}</TableHead>
              <TableHead>{t("restaurant")}</TableHead>
              <TableHead>{t("bar")}</TableHead>
              <TableHead>{t("total")}</TableHead>
              <TableHead>{t("orders")}</TableHead>
              <TableHead>{t("average")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{sale.date}</TableCell>
                <TableCell>{formatCurrency(sale.roomService)}</TableCell>
                <TableCell>{formatCurrency(sale.diningRoom)}</TableCell>
                <TableCell>{formatCurrency(sale.bar)}</TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(sale.total)}
                </TableCell>
                <TableCell>{sale.orders}</TableCell>
                <TableCell>
                  {formatCurrency(Math.round(sale.total / sale.orders))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
