"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Play, CheckCircle } from "lucide-react";

export interface CleaningAssignment {
  id: string;
  employeeName: string;
  roomNumber: string;
  assignedDate: string;
  startedAt?: string;
  completedAt?: string;
  status: string;
  notes?: string;
  qualityScore?: number;
}

interface CleaningAssignmentsProps {
  assignments: CleaningAssignment[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

export default function CleaningAssignments({
  assignments,
  onStart,
  onComplete,
}: CleaningAssignmentsProps) {
  const t = useTranslations("CleaningAssignments");
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("statusPending")}
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {t("statusInProgress")}
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("statusCompleted")}
          </Badge>
        );
      case "inspected":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            {t("statusInspected")}
          </Badge>
        );
      case "needs_maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            {t("statusMaintenance")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
              <TableHead>#</TableHead>
              <TableHead>{t("room")}</TableHead>
              <TableHead>{t("employee")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.id}</TableCell>
                <TableCell>{a.roomNumber}</TableCell>
                <TableCell>{a.employeeName}</TableCell>
                <TableCell>{a.assignedDate}</TableCell>
                <TableCell>{getStatusBadge(a.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {a.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStart(a.id)}
                      >
                        <Play className="mr-2 h-4 w-4" /> {t("start")}
                      </Button>
                    )}
                    {a.status === "in_progress" && (
                      <Button size="sm" onClick={() => onComplete(a.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> {t("complete")}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
