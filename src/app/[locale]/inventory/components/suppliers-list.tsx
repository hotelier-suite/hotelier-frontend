"use client";

import { useTranslations } from "next-intl";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Supplier } from "@/lib/features/inventory/types";

interface SuppliersListProps {
  suppliers: Supplier[];
}

export function SuppliersList({ suppliers }: SuppliersListProps) {
  const t = useTranslations("SuppliersList");
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
              <TableHead>{t("supplier")}</TableHead>
              <TableHead>{t("contact")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{t("rating")}</TableHead>
              <TableHead>{t("deliveryTime")}</TableHead>
              <TableHead>{t("terms")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{supplier.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {supplier.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{supplier.contact}</div>
                    <div className="text-sm text-muted-foreground">
                      {supplier.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{t("general")}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">4.0</span>
                  </div>
                </TableCell>
                <TableCell>{supplier.deliveryTime}</TableCell>
                <TableCell>{supplier.paymentTerms}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    {t("contactBtn")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
