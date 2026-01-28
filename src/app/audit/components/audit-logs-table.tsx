"use client";

import { useState } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  User,
  Clock,
  Smartphone,
} from "lucide-react";
import {
  type AuditLog,
  AuditAction,
  AuditResource,
} from "@/lib/features/audit/types";

interface AuditLogsTableProps {
  logs: AuditLog[];
  total: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function AuditLogsTable({
  logs,
  total,
  loading,
  currentPage,
  pageSize,
  onPageChange,
}: AuditLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, total);

  const getActionBadgeColor = (action: AuditAction): string => {
    switch (action) {
      case AuditAction.CREATE:
        return "bg-green-100 text-green-800";
      case AuditAction.READ:
        return "bg-blue-100 text-blue-800";
      case AuditAction.UPDATE:
        return "bg-yellow-100 text-yellow-800";
      case AuditAction.DELETE:
        return "bg-red-100 text-red-800";
      case AuditAction.LOGIN:
        return "bg-purple-100 text-purple-800";
      case AuditAction.LOGOUT:
        return "bg-gray-100 text-gray-800";
      case AuditAction.LOGIN_FAILED:
        return "bg-red-100 text-red-800";
      case AuditAction.CHECK_IN:
      case AuditAction.CHECK_OUT:
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResourceBadgeColor = (resource: AuditResource): string => {
    switch (resource) {
      case AuditResource.USER:
      case AuditResource.ROLE:
      case AuditResource.PERMISSION:
        return "bg-purple-100 text-purple-800";
      case AuditResource.RESERVATION:
      case AuditResource.ROOM:
      case AuditResource.GUEST:
        return "bg-blue-100 text-blue-800";
      case AuditResource.INVOICE:
      case AuditResource.PAYMENT:
      case AuditResource.BILLING:
        return "bg-green-100 text-green-800";
      case AuditResource.EMPLOYEE:
      case AuditResource.SHIFT:
      case AuditResource.ATTENDANCE:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatActionText = (action: AuditAction): string => {
    const actionMap: Record<AuditAction, string> = {
      [AuditAction.CREATE]: "Create",
      [AuditAction.READ]: "Read",
      [AuditAction.UPDATE]: "Update",
      [AuditAction.DELETE]: "Delete",
      [AuditAction.LOGIN]: "Login",
      [AuditAction.LOGOUT]: "Logout",
      [AuditAction.LOGIN_FAILED]: "Login Failed",
      [AuditAction.CHECK_IN]: "Check In",
      [AuditAction.CHECK_OUT]: "Check Out",
      [AuditAction.PAYMENT_PROCESSED]: "Payment Processed",
      [AuditAction.INVOICE_GENERATED]: "Invoice Generated",
      [AuditAction.STATUS_CHANGE]: "Status Change",
      [AuditAction.SYSTEM_CONFIG_CHANGE]: "System Config",
      [AuditAction.REPORT_GENERATED]: "Report Generated",
      [AuditAction.EXPORT]: "Export",
      [AuditAction.CUSTOM]: "Custom",
      [AuditAction.PASSWORD_CHANGE]: "Password Change",
      [AuditAction.PASSWORD_RESET]: "Password Reset",
      [AuditAction.CANCEL_RESERVATION]: "Cancel Reservation",
      [AuditAction.MODIFY_RESERVATION]: "Modify Reservation",
      [AuditAction.REFUND_ISSUED]: "Refund Issued",
      [AuditAction.APPROVAL]: "Approval",
      [AuditAction.REJECTION]: "Rejection",
      [AuditAction.PERMISSION_GRANTED]: "Permission Granted",
      [AuditAction.PERMISSION_REVOKED]: "Permission Revoked",
      [AuditAction.ROLE_ASSIGNED]: "Role Assigned",
      [AuditAction.ROLE_REMOVED]: "Role Removed",
      [AuditAction.FILE_UPLOAD]: "File Upload",
      [AuditAction.FILE_DOWNLOAD]: "File Download",
      [AuditAction.FILE_DELETE]: "File Delete",
    };

    return actionMap[action] || action;
  };

  const formatResourceText = (resource: AuditResource): string => {
    const resourceMap: Record<AuditResource, string> = {
      [AuditResource.USER]: "User",
      [AuditResource.ROLE]: "Role",
      [AuditResource.PERMISSION]: "Permission",
      [AuditResource.RESERVATION]: "Reservation",
      [AuditResource.ROOM]: "Room",
      [AuditResource.GUEST]: "Guest",
      [AuditResource.INVOICE]: "Invoice",
      [AuditResource.PAYMENT]: "Payment",
      [AuditResource.BILLING]: "Billing",
      [AuditResource.EMPLOYEE]: "Employee",
      [AuditResource.SHIFT]: "Shift",
      [AuditResource.ATTENDANCE]: "Attendance",
      [AuditResource.HOUSEKEEPING]: "Housekeeping",
      [AuditResource.MAINTENANCE]: "Maintenance",
      [AuditResource.RESTAURANT]: "Restaurant",
      [AuditResource.MENU_ITEM]: "Menu",
      [AuditResource.ROOM_SERVICE]: "Room Service",
      [AuditResource.EVENT]: "Event",
      [AuditResource.VENUE]: "Venue",
      [AuditResource.RECREATIONAL]: "Recreation",
      [AuditResource.INVENTORY]: "Inventory",
      [AuditResource.SUPPLIER]: "Supplier",
      [AuditResource.PARKING]: "Parking",
      [AuditResource.GUEST_REQUEST]: "Guest Request",
      [AuditResource.EMPLOYEE_REQUEST]: "Employee Request",
      [AuditResource.REPORT]: "Report",
      [AuditResource.ANALYTICS]: "Analytics",
      [AuditResource.CONFIGURATION]: "Settings",
      [AuditResource.NOTIFICATION]: "Notification",
      [AuditResource.AUDIT_LOG]: "Audit Log",
      [AuditResource.SYSTEM]: "System",
      [AuditResource.OTHER]: "Other",
    };

    return resourceMap[resource] || resource;
  };

  if (loading && logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit Registrations</CardTitle>
          <CardDescription>Loading records...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Audit Records</CardTitle>
          <CardDescription>
            Showing {startIndex} - {endIndex} of {total} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No audit records found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{log.user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {log.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>
                          {formatActionText(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getResourceBadgeColor(log.resource)}
                          >
                            {formatResourceText(log.resource)}
                          </Badge>
                          {log.resourceId && (
                            <span className="text-sm text-muted-foreground">
                              #{log.resourceId}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate" title={log.description}>
                          {log.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {format(
                              new Date(log.createdAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: enUS },
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell />
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Audit Record Details</DialogTitle>
                              <DialogDescription>
                                Complete information for record #{log.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedLog && (
                              <ScrollArea className="max-h-[60vh]">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        User
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <div>
                                          <p>{selectedLog.user.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedLog.user.email}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        Date and Time
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          {format(
                                            new Date(selectedLog.createdAt),
                                            "PPpp",
                                            { locale: enUS },
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        Action
                                      </h4>
                                      <Badge
                                        className={getActionBadgeColor(
                                          selectedLog.action,
                                        )}
                                      >
                                        {formatActionText(selectedLog.action)}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        Resource
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          className={getResourceBadgeColor(
                                            selectedLog.resource,
                                          )}
                                        >
                                          {formatResourceText(
                                            selectedLog.resource,
                                          )}
                                        </Badge>
                                        {selectedLog.resourceId && (
                                          <span className="text-sm font-mono">
                                            #{selectedLog.resourceId}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Description
                                    </h4>
                                    <p className="text-sm bg-gray-50 p-3 rounded">
                                      {selectedLog.description}
                                    </p>
                                  </div>

                                  {selectedLog.userAgent && (
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        Connection Information
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedLog.userAgent && (
                                          <div className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" />
                                            <span>Agent:</span>
                                            <span className="font-mono break-all">
                                              {selectedLog.userAgent}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {selectedLog.details &&
                                    Object.keys(selectedLog.details).length >
                                      0 && (
                                      <div>
                                        <h4 className="font-semibold mb-2">
                                          Additional Details
                                        </h4>
                                        <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                                          {JSON.stringify(
                                            selectedLog.details,
                                            null,
                                            2,
                                          )}
                                        </pre>
                                      </div>
                                    )}
                                </div>
                              </ScrollArea>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
