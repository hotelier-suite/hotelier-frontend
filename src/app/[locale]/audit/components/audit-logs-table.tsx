"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/utils/locale";
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
  const t = useTranslations("AuditLogsTableComp");
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);
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
      [AuditAction.CREATE]: t("actionCreate"),
      [AuditAction.READ]: t("actionRead"),
      [AuditAction.UPDATE]: t("actionUpdate"),
      [AuditAction.DELETE]: t("actionDelete"),
      [AuditAction.LOGIN]: t("actionLogin"),
      [AuditAction.LOGOUT]: t("actionLogout"),
      [AuditAction.LOGIN_FAILED]: t("actionLoginFailed"),
      [AuditAction.CHECK_IN]: t("actionCheckIn"),
      [AuditAction.CHECK_OUT]: t("actionCheckOut"),
      [AuditAction.PAYMENT_PROCESSED]: t("actionPaymentProcessed"),
      [AuditAction.INVOICE_GENERATED]: t("actionInvoiceGenerated"),
      [AuditAction.STATUS_CHANGE]: t("actionStatusChange"),
      [AuditAction.SYSTEM_CONFIG_CHANGE]: t("actionSystemConfig"),
      [AuditAction.REPORT_GENERATED]: t("actionReportGenerated"),
      [AuditAction.EXPORT]: t("actionExport"),
      [AuditAction.CUSTOM]: t("actionCustom"),
      [AuditAction.PASSWORD_CHANGE]: t("actionPasswordChange"),
      [AuditAction.PASSWORD_RESET]: t("actionPasswordReset"),
      [AuditAction.CANCEL_RESERVATION]: t("actionCancelReservation"),
      [AuditAction.MODIFY_RESERVATION]: t("actionModifyReservation"),
      [AuditAction.REFUND_ISSUED]: t("actionRefundIssued"),
      [AuditAction.APPROVAL]: t("actionApproval"),
      [AuditAction.REJECTION]: t("actionRejection"),
      [AuditAction.PERMISSION_GRANTED]: t("actionPermissionGranted"),
      [AuditAction.PERMISSION_REVOKED]: t("actionPermissionRevoked"),
      [AuditAction.ROLE_ASSIGNED]: t("actionRoleAssigned"),
      [AuditAction.ROLE_REMOVED]: t("actionRoleRemoved"),
      [AuditAction.FILE_UPLOAD]: t("actionFileUpload"),
      [AuditAction.FILE_DOWNLOAD]: t("actionFileDownload"),
      [AuditAction.FILE_DELETE]: t("actionFileDelete"),
    };

    return actionMap[action] || action;
  };

  const formatResourceText = (resource: AuditResource): string => {
    const resourceMap: Record<AuditResource, string> = {
      [AuditResource.USER]: t("resourceUser"),
      [AuditResource.ROLE]: t("resourceRole"),
      [AuditResource.PERMISSION]: t("resourcePermission"),
      [AuditResource.RESERVATION]: t("resourceReservation"),
      [AuditResource.ROOM]: t("resourceRoom"),
      [AuditResource.GUEST]: t("resourceGuest"),
      [AuditResource.INVOICE]: t("resourceInvoice"),
      [AuditResource.PAYMENT]: t("resourcePayment"),
      [AuditResource.BILLING]: t("resourceBilling"),
      [AuditResource.EMPLOYEE]: t("resourceEmployee"),
      [AuditResource.SHIFT]: t("resourceShift"),
      [AuditResource.ATTENDANCE]: t("resourceAttendance"),
      [AuditResource.HOUSEKEEPING]: t("resourceHousekeeping"),
      [AuditResource.MAINTENANCE]: t("resourceMaintenance"),
      [AuditResource.RESTAURANT]: t("resourceRestaurant"),
      [AuditResource.MENU_ITEM]: t("resourceMenu"),
      [AuditResource.ROOM_SERVICE]: t("resourceRoomService"),
      [AuditResource.EVENT]: t("resourceEvent"),
      [AuditResource.VENUE]: t("resourceVenue"),
      [AuditResource.RECREATIONAL]: t("resourceRecreation"),
      [AuditResource.INVENTORY]: t("resourceInventory"),
      [AuditResource.SUPPLIER]: t("resourceSupplier"),
      [AuditResource.PARKING]: t("resourceParking"),
      [AuditResource.GUEST_REQUEST]: t("resourceGuestRequest"),
      [AuditResource.EMPLOYEE_REQUEST]: t("resourceEmployeeRequest"),
      [AuditResource.REPORT]: t("resourceReport"),
      [AuditResource.ANALYTICS]: t("resourceAnalytics"),
      [AuditResource.CONFIGURATION]: t("resourceSettings"),
      [AuditResource.NOTIFICATION]: t("resourceNotification"),
      [AuditResource.AUDIT_LOG]: t("resourceAuditLog"),
      [AuditResource.SYSTEM]: t("resourceSystem"),
      [AuditResource.OTHER]: t("resourceOther"),
    };

    return resourceMap[resource] || resource;
  };

  if (loading && logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("auditRegistrations")}</CardTitle>
          <CardDescription>{t("loadingRecords")}</CardDescription>
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
          <CardTitle>{t("auditRecords")}</CardTitle>
          <CardDescription>
            {t("showingRecords", { start: startIndex, end: endIndex, total })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("user")}</TableHead>
                  <TableHead>{t("action")}</TableHead>
                  <TableHead>{t("resource")}</TableHead>
                  <TableHead>{t("description")}</TableHead>
                  <TableHead>{t("dateTime")}</TableHead>
                  <TableHead>{t("ip")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {t("noRecordsFound")}
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
                              { locale: dateFnsLocale },
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
                              <DialogTitle>{t("recordDetails")}</DialogTitle>
                              <DialogDescription>
                                {t("recordInfo", { id: log.id })}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedLog && (
                              <ScrollArea className="max-h-[60vh]">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        {t("user")}
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
                                        {t("dateAndTime")}
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          {format(
                                            new Date(selectedLog.createdAt),
                                            "PPpp",
                                            { locale: dateFnsLocale },
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        {t("action")}
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
                                        {t("resource")}
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
                                      {t("description")}
                                    </h4>
                                    <p className="text-sm bg-gray-50 p-3 rounded">
                                      {selectedLog.description}
                                    </p>
                                  </div>

                                  {selectedLog.userAgent && (
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        {t("connectionInfo")}
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedLog.userAgent && (
                                          <div className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" />
                                            <span>{t("agent")}</span>
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
                                          {t("additionalDetails")}
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
                {t("pageOf", { current: currentPage + 1, total: totalPages })}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  {t("next")}
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
