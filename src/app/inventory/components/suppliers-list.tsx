"use client";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suppliers List</CardTitle>
        <CardDescription>Supplier and contact management</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Delivery Time</TableHead>
              <TableHead>Terms</TableHead>
              <TableHead>Actions</TableHead>
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
                  <Badge variant="outline">General</Badge>
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
                    Contact
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
