"use client";

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
import { CheckCircle, XCircle } from "lucide-react";

interface Permission {
  id: string;
  employeeId: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  approvedBy: string;
}

interface PermissionManagementProps {
  permissions: Permission[];
  onPermissionsChange: (permissions: Permission[]) => void;
}

export default function PermissionManagement({
  permissions,
  onPermissionsChange,
}: PermissionManagementProps) {
  const getPermissionTypeLabel = (type: string) => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
      case "VACATION":
        return "Vacation";
      case "SICK_LEAVE":
        return "Sick Leave";
      case "PERSONAL":
        return "Personal";
      case "OTHER":
        return "Other";
      default:
        return type;
    }
  };

  const getPermissionStatusBadge = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        );
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApprovePermission = (permissionId: string) => {
    const updatedPermissions = permissions.map((permission) =>
      permission.id === permissionId
        ? { ...permission, status: "approved", approvedBy: "Current User" }
        : permission,
    );
    onPermissionsChange(updatedPermissions);
  };

  const handleRejectPermission = (permissionId: string) => {
    const updatedPermissions = permissions.map((permission) =>
      permission.id === permissionId
        ? { ...permission, status: "rejected", approvedBy: "Current User" }
        : permission,
    );
    onPermissionsChange(updatedPermissions);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Permission Requests</h3>
        <p className="text-sm text-muted-foreground">
          Vacation and time off management
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">
                {permission.employee}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getPermissionTypeLabel(permission.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{permission.startDate}</div>
                  <div>{permission.endDate}</div>
                </div>
              </TableCell>
              <TableCell>{permission.days}</TableCell>
              <TableCell>{permission.reason}</TableCell>
              <TableCell>
                {getPermissionStatusBadge(permission.status)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {permission.status.toUpperCase() === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprovePermission(permission.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectPermission(permission.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
