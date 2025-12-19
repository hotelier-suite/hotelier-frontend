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
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "alta":
        return <Badge variant="destructive">High</Badge>;
      case "media":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        );
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">Completed</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Reports</CardTitle>
        <CardDescription>Incident and repair management</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Est. Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{report.room}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                <TableCell>
                  {getMaintenanceStatusBadge(report.status)}
                </TableCell>
                <TableCell>
                  {report.assignedTechnician || "Not assigned"}
                </TableCell>
                <TableCell>{report.estimatedTime || "Not estimated"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {report.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStartMaintenance(report.id)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                    )}
                    {report.status === "in_progress" && (
                      <Button
                        size="sm"
                        onClick={() => onCompleteMaintenance(report.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete
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
