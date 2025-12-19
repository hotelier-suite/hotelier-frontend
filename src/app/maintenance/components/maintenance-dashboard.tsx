"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import {
  GeneralMaintenanceRequest,
  maintenanceApi,
  MaintenanceStats,
} from "@/lib/api/maintenance";
import { MaintenanceReport } from "@/lib/api/housekeeping";
import MaintenanceTable from "./maintenance-table";
import MaintenanceStatsCards from "./maintenance-stats-cards";

interface MaintenanceDashboardProps {
  initialRequests: GeneralMaintenanceRequest[];
  housekeepingReports?: MaintenanceReport[];
}

export default function MaintenanceDashboard({
  initialRequests,
  housekeepingReports = [],
}: MaintenanceDashboardProps) {
  const [requests, setRequests] =
    useState<GeneralMaintenanceRequest[]>(initialRequests);
  const [reports, setReports] =
    useState<MaintenanceReport[]>(housekeepingReports);
  const [stats, setStats] = useState<MaintenanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setIsCreateDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<GeneralMaintenanceRequest | null>(null);
  const [, setIsEditDialogOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await maintenanceApi.getAll();
      setRequests(data);
      // Reset create dialog state when refreshing
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await maintenanceApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching maintenance stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [requests]);

  useEffect(() => {
    setReports(housekeepingReports);
  }, [housekeepingReports]);

  const handleDeleteRequest = async (id: number) => {
    try {
      await maintenanceApi.delete(id);
      await fetchRequests();
    } catch (error) {
      console.error("Error deleting maintenance request:", error);
    }
  };

  const handleEditRequest = (request: GeneralMaintenanceRequest) => {
    setSelectedRequest(request);
    setIsEditDialogOpen(true);
    // selectedRequest is used for future edit dialog functionality
    console.log("Editing request:", selectedRequest?.id || request.id);
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await maintenanceApi.updateStatus(id, status);
      await fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getFilteredRequests = (filter: string) => {
    switch (filter) {
      case "scheduled":
        return requests.filter((r) => r.status === "scheduled");
      case "in_progress":
        return requests.filter((r) => r.status === "in_progress");
      case "completed":
        return requests.filter((r) => r.status === "completed");
      case "overdue":
        const today = new Date();
        return requests.filter(
          (r) =>
            r.status === "scheduled" &&
            r.scheduledDate &&
            new Date(r.scheduledDate) < today,
        );
      default:
        return requests;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">
            Manage hotel maintenance requests
          </p>
        </div>
      </div>

      {stats && <MaintenanceStatsCards stats={stats} />}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="incidents">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Clock className="mr-2 h-4 w-4" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            <Wrench className="mr-2 h-4 w-4" />
            In Progress
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="mr-2 h-4 w-4" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="overdue">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Overdue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <MaintenanceTable
                requests={requests}
                loading={loading}
                onEdit={handleEditRequest}
                onDelete={handleDeleteRequest}
                onStatusUpdate={handleStatusUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incidents Reported from Housekeeping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No reported incidents
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {reports.map((report) => (
                      <Card key={report.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">
                                Room {report.roomNumber}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${report.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : report.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                  }`}
                              >
                                {report.priority}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${report.status === "pending"
                                  ? "bg-orange-100 text-orange-800"
                                  : report.status === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : report.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {report.status === "pending"
                                  ? "Pending"
                                  : report.status === "in_progress"
                                    ? "In Progress"
                                    : report.status === "completed"
                                      ? "Completed"
                                      : report.status}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{report.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {report.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Reported by: {report.reportedBy}
                              {report.createdAt &&
                                ` • ${new Date(report.createdAt).toLocaleString()}`}
                            </div>
                          </div>
                          <div className="text-right">
                            {report.cost && (
                              <p className="text-sm font-semibold text-green-600">
                                ${report.cost.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <MaintenanceTable
                requests={getFilteredRequests("scheduled")}
                loading={loading}
                onEdit={handleEditRequest}
                onDelete={handleDeleteRequest}
                onStatusUpdate={handleStatusUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in_progress">
          <Card>
            <CardHeader>
              <CardTitle>Requests In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <MaintenanceTable
                requests={getFilteredRequests("in_progress")}
                loading={loading}
                onEdit={handleEditRequest}
                onDelete={handleDeleteRequest}
                onStatusUpdate={handleStatusUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <MaintenanceTable
                requests={getFilteredRequests("completed")}
                loading={loading}
                onEdit={handleEditRequest}
                onDelete={handleDeleteRequest}
                onStatusUpdate={handleStatusUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <MaintenanceTable
                requests={getFilteredRequests("overdue")}
                loading={loading}
                onEdit={handleEditRequest}
                onDelete={handleDeleteRequest}
                onStatusUpdate={handleStatusUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
