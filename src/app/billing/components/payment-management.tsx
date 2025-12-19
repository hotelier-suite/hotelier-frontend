"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string;
  invoiceId: string | number;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  status: string;
}

interface PaymentManagementProps {
  payments: Payment[];
}

export default function PaymentManagement({
  payments,
}: PaymentManagementProps) {
  const getPaymentMethodBadge = (method: string) => {
    const variants: Record<string, string> = {
      card: "bg-blue-100 text-blue-800",
      cash: "bg-green-100 text-green-800",
      transfer: "bg-purple-100 text-purple-800",
    };

    return (
      <Badge className={variants[method] || "bg-gray-100 text-gray-800"}>
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Record of all payments received</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((paymentItem) => (
              <TableRow key={paymentItem.id}>
                <TableCell className="font-medium">{paymentItem.id}</TableCell>
                <TableCell>{paymentItem.invoiceId}</TableCell>
                <TableCell>{paymentItem.date}</TableCell>
                <TableCell>
                  ${(Number(paymentItem.amount) || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {getPaymentMethodBadge(paymentItem.method)}
                </TableCell>
                <TableCell>{paymentItem.reference}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    Approved
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
