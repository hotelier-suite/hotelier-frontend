"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IncidentReportDialog from "./components/incident-report-dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, Users } from "lucide-react";
import { type CleaningAssignment } from "@/lib/features/housekeeping/types";
import { housekeepingService } from "@/lib/features/housekeeping/service";
import { type Employee } from "@/lib/features/employees/types";
import { employeesService } from "@/lib/features/employees/service";

export default function HousekeepingPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [cleaningAssignments, setCleaningAssignments] = useState<
    CleaningAssignment[]
  >([]);
  const [loading, setLoading] = useState(true);

  const handleReportIncident = async (incident: {
    room: string;
    type: string;
    priority: string;
    description: string;
  }) => {
    try {
      // API call will go here when implemented
      console.log("New maintenance request:", incident);
    } catch (error) {
      console.error("Error creating maintenance request:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, assignmentsData] = await Promise.all([
          employeesService.getByDepartment("HOUSEKEEPING"),
          housekeepingService.getTodaysCleaningAssignments(),
        ]);

        setEmployees(employeesData);
        setCleaningAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching cleaning data:", error);
        // Set empty arrays on error to prevent crashes
        setEmployees([]);
        setCleaningAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Housekeeping</h1>
          <p className="text-muted-foreground">Loading housekeeping data...</p>
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  // Calculate cleaning statistics based on assignments
  const assignmentsByStatus = {
    pending: cleaningAssignments.filter((a) => a.status === "pending").length,
    in_progress: cleaningAssignments.filter((a) => a.status === "in_progress")
      .length,
    completed: cleaningAssignments.filter((a) => a.status === "completed")
      .length,
    inspected: cleaningAssignments.filter((a) => a.status === "inspected")
      .length,
  };

  const totalEmployees = employees.length;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Housekeeping</h1>
        <p className="text-muted-foreground">
          Room cleaning and maintenance management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assignmentsByStatus.completed}
            </div>
            <p className="text-xs text-muted-foreground">Finished cleanings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {assignmentsByStatus.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting cleaning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {assignmentsByStatus.in_progress}
            </div>
            <p className="text-xs text-muted-foreground">
              Cleaning in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Staff
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground">Cleaning staff</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cleaning Assignments</CardTitle>
            </div>
            <IncidentReportDialog onReportIncident={handleReportIncident} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cleaningAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium">
                        Room {assignment.roomNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.employeeName}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      assignment.status === "completed"
                        ? "default"
                        : assignment.status === "in_progress"
                          ? "secondary"
                          : assignment.status === "inspected"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {assignment.status === "completed"
                      ? "Completed"
                      : assignment.status === "in_progress"
                        ? "In progress"
                        : assignment.status === "inspected"
                          ? "Inspected"
                          : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cleaning Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => {
                // Count assignments for this employee
                const employeeAssignments = cleaningAssignments.filter(
                  (a) => a.employeeName === employee.name,
                );
                const completedCount = employeeAssignments.filter(
                  (a) => a.status === "completed",
                ).length;
                return (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Shift {employee.shift}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {completedCount}/{employeeAssignments.length}
                      </p>
                      <Badge
                        variant={
                          employee.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {employee.status === "ACTIVE"
                          ? "Active"
                          : employee.status === "ON_LEAVE"
                            ? "On leave"
                            : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
