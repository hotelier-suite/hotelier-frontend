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

interface HousekeepingEmployee {
  id: string;
  name: string;
  shift: string;
  assignedRooms: number;
  completedRooms: number;
  status: string;
  currentLocation: string;
}

interface StaffStatusManagementProps {
  employees: HousekeepingEmployee[];
}

export default function StaffStatusManagement({
  employees,
}: StaffStatusManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Housekeeping Staff</CardTitle>
        <CardDescription>Staff status and assignments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee: HousekeepingEmployee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.shift}</TableCell>
                <TableCell>{employee.assignedRooms}</TableCell>
                <TableCell>{employee.completedRooms}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(employee.completedRooms / employee.assignedRooms) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(
                        (employee.completedRooms / employee.assignedRooms) *
                        100,
                      )}
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      employee.status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {employee.status === "available" ? "Active" : "Break"}
                  </Badge>
                </TableCell>
                <TableCell>{employee.currentLocation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
