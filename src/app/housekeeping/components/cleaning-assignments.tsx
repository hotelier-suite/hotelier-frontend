"use client";

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
  const getStatusBadge = (status: string) => {
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
      case "inspected":
        return (
          <Badge className="bg-purple-100 text-purple-800">Inspected</Badge>
        );
      case "needs_maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cleaning Assignments</CardTitle>
        <CardDescription>Daily cleaning task management</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
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
                        <Play className="mr-2 h-4 w-4" /> Start
                      </Button>
                    )}
                    {a.status === "in_progress" && (
                      <Button size="sm" onClick={() => onComplete(a.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Complete
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
