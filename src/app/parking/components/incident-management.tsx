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
import { ParkingIncident } from "@/lib/api/parking";

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
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
      case "alta":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
      case "media":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
      case "baja":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getIncidentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        );
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reported Incidents</CardTitle>
        <CardDescription>Incident and issue management</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Vehicle/Space</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Responsible</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
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
                    {incident.vehicle && <div>Veh: {incident.vehicle}</div>}
                    {incident.space && <div>Space: {incident.space}</div>}
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
                        Assign
                      </Button>
                    )}
                    {incident.status === "in_progress" && (
                      <Button
                        size="sm"
                        onClick={() => onResolveIncident(incident.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Resolve
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
