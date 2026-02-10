"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { CheckCircle, Clock } from "lucide-react";

interface MaintenanceReport {
  id: string;
  room: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  assignedTechnician?: string;
  estimatedTime?: string;
}

interface MaintenanceManagementProps {
  maintenanceReports: MaintenanceReport[];
  onStartMaintenance: (reportId: string) => void;
  onCompleteMaintenance: (reportId: string) => void;
}

export default function MaintenanceManagement({
  maintenanceReports,
  onStartMaintenance,
  onCompleteMaintenance,
}: MaintenanceManagementProps) {
  const t = useTranslations("MaintenanceManagement");
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "alta":
        return <Badge variant="destructive">{t("priorityHigh")}</Badge>;
      case "media":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("priorityMedium")}
          </Badge>
        );
      case "low":
        return <Badge variant="secondary">{t("priorityLow")}</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getMaintenanceStatusBadge = (status: string) => {
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
              <TableHead>{t("id")}</TableHead>
              <TableHead>{t("room")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("headerDescription")}</TableHead>
              <TableHead>{t("priority")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("technician")}</TableHead>
              <TableHead>{t("estTime")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{report.room}</TableCell>
                <TableCell>
                  {{
                    preventive: t("typePreventive"),
                    corrective: t("typeCorrective"),
                    emergency: t("typeEmergency"),
                    upgrade: t("typeUpgrade"),
                    inspection: t("typeInspection"),
                  }[report.type] || report.type}
                </TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                <TableCell>
                  {getMaintenanceStatusBadge(report.status)}
                </TableCell>
                <TableCell>
                  {report.assignedTechnician || t("notAssigned")}
                </TableCell>
                <TableCell>
                  {report.estimatedTime || t("notEstimated")}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {report.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStartMaintenance(report.id)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {t("start")}
                      </Button>
                    )}
                    {report.status === "in_progress" && (
                      <Button
                        size="sm"
                        onClick={() => onCompleteMaintenance(report.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t("complete")}
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
