"use client";

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
import { CheckCircle } from "lucide-react";
import type { ParkingIncident } from "@/lib/features/parking/types";
import { useTranslations } from "next-intl";

interface IncidentManagementProps {
  incidents: ParkingIncident[];
  onAssignIncident: (incidentId: string) => void;
  onResolveIncident: (incidentId: string) => void;
}

export default function IncidentManagement({
  incidents,
  onAssignIncident,
  onResolveIncident,
}: IncidentManagementProps) {
  const t = useTranslations("IncidentManagement");
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
      case "alta":
        return <Badge variant="destructive">{t("priorityHigh")}</Badge>;
      case "medium":
      case "media":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("priorityMedium")}
          </Badge>
        );
      case "low":
      case "baja":
        return <Badge variant="secondary">{t("priorityLow")}</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getIncidentStatusBadge = (status: string) => {
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
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("statusResolved")}
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
              <TableHead>{t("typeHead")}</TableHead>
              <TableHead>{t("descriptionHead")}</TableHead>
              <TableHead>{t("vehicleSpace")}</TableHead>
              <TableHead>{t("dateHead")}</TableHead>
              <TableHead>{t("responsible")}</TableHead>
              <TableHead>{t("priorityHead")}</TableHead>
              <TableHead>{t("statusHead")}</TableHead>
              <TableHead>{t("actionsHead")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>
                  <Badge variant="outline">{incident.type}</Badge>
                </TableCell>
                <TableCell>{incident.description}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {incident.vehicle && (
                      <div>
                        {t("veh")}: {incident.vehicle}
                      </div>
                    )}
                    {incident.space && (
                      <div>
                        {t("space")}: {incident.space}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{incident.reportDate}</TableCell>
                <TableCell>{incident.responsible}</TableCell>
                <TableCell>{getPriorityBadge(incident.priority)}</TableCell>
                <TableCell>{getIncidentStatusBadge(incident.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {incident.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAssignIncident(incident.id)}
                      >
                        {t("assign")}
                      </Button>
                    )}
                    {incident.status === "in_progress" && (
                      <Button
                        size="sm"
                        onClick={() => onResolveIncident(incident.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t("resolve")}
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
