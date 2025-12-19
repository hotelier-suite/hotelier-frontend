"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  CheckCircle,
  Play,
} from "lucide-react";
import { GeneralMaintenanceRequest } from "@/lib/api/maintenance";

interface MaintenanceTableProps {
  requests: GeneralMaintenanceRequest[];
  loading: boolean;
  onEdit: (request: GeneralMaintenanceRequest) => void;
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: string) => void;
}

export default function MaintenanceTable({
  requests,
  loading,
  onEdit,
  onDelete,
  onStatusUpdate,
}: MaintenanceTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      scheduled: "outline",
      in_progress: "default",
      completed: "secondary",
      cancelled: "destructive",
      postponed: "outline",
    };

    const labels: Record<string, string> = {
      scheduled: "Scheduled",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      postponed: "Postponed",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 text-red-800 border-red-200",
      urgent: "bg-orange-100 text-orange-800 border-orange-200",
      high: "bg-yellow-100 text-yellow-800 border-yellow-200",
      medium: "bg-blue-100 text-blue-800 border-blue-200",
      low: "bg-green-100 text-green-800 border-green-200",
    };

    const labels: Record<string, string> = {
      critical: "Critical",
      urgent: "Urgent",
      high: "High",
      medium: "Medium",
      low: "Low",
    };

    return (
      <Badge className={colors[priority] || ""}>
        {labels[priority] || priority}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      preventive: "Preventive",
      corrective: "Corrective",
      emergency: "Emergency",
      upgrade: "Upgrade",
      inspection: "Inspection",
    };

    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No maintenance requests.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Technician</TableHead>
          <TableHead>Scheduled Date</TableHead>
          <TableHead>Est. Cost</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div>
                <div className="font-medium">{request.title}</div>
                {request.description && (
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {request.description}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>{getTypeBadge(request.type)}</TableCell>
            <TableCell>{getPriorityBadge(request.priority)}</TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{request.location}</div>
                {request.equipment && (
                  <div className="text-sm text-muted-foreground">
                    {request.equipment}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {request.assignedTechnician ? (
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span className="text-sm">
                    {request.assignedTechnician.firstName}{" "}
                    {request.assignedTechnician.lastName}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">
                  Not assigned
                </span>
              )}
            </TableCell>
            <TableCell>
              {request.scheduledDate ? (
                <div>
                  <div>
                    {new Date(request.scheduledDate).toLocaleDateString()}
                  </div>
                  {request.scheduledStartTime && (
                    <div className="text-sm text-muted-foreground">
                      {request.scheduledStartTime}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">Not scheduled</span>
              )}
            </TableCell>
            <TableCell>
              {request.estimatedCost ? (
                <span>
                  ${parseFloat(String(request.estimatedCost)).toFixed(2)}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(request)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  {request.status === "scheduled" && (
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(request.id, "in_progress")}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </DropdownMenuItem>
                  )}

                  {request.status === "in_progress" && (
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(request.id, "completed")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => onDelete(request.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
