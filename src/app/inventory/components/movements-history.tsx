"use client";

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
import { InventoryMovement } from "@/lib/api/inventory";

interface MovementsHistoryProps {
  movements: InventoryMovement[];
}

export function MovementsHistory({ movements }: MovementsHistoryProps) {
  const getMovementTypeBadge = (type: string) => {
    return type === "inbound" ? (
      <Badge className="bg-green-100 text-green-800">Entry</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Exit</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement History</CardTitle>
        <CardDescription>
          Inventory entries and exits log
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Responsible</TableHead>
              <TableHead>Reason</TableHead>
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
