"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";
import {
  type AuditLog,
  type AuditLogQuery,
  AuditAction,
} from "@/lib/features/audit/types";
import { auditService } from "@/lib/features/audit/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, Users, BarChart3 } from "lucide-react";
import { AuditLogsTable } from "./components/audit-logs-table";
import { AuditStatistics } from "./components/audit-statistics";
import { AuditFilters } from "./components/audit-filters";

export default function AuditPage() {
  const { user, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<AuditLogQuery>({
    skip: 0,
    take: 50,
    order: "desc",
  });

  // Check authentication and permissions
  useEffect(() => {
    if (!authLoading && (!user || !hasRequiredPermissions(user))) {
      router.push("/dashboard");
      return;
    }
  }, [user, authLoading, router]);

  const hasRequiredPermissions = (user: unknown): boolean => {
    // Only administrators and managers can view audit logs
    return (
      (user as { roles?: Array<{ name: string }> })?.roles?.some((role) =>
        ["administrator", "manager"].includes(role.name),
      ) || false
    );
  };

  // Load audit logs
  useEffect(() => {
    const loadAuditLogs = async () => {
      if (!user || authLoading) return;

      try {
        setLoading(true);
        setError(null);
        const response = await auditService.getAll(query);
        setLogs(response.data);
        setTotal(response.total);
      } catch (err: unknown) {
        console.error("Error loading audit logs:", err);
        setError(
          err instanceof Error ? err.message : "Error loading audit logs",
        );
        setLogs([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadAuditLogs();
  }, [user, authLoading, query]);

  const handleQueryChange = (newQuery: Partial<AuditLogQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...newQuery,
      skip: newQuery.skip !== undefined ? newQuery.skip : 0, // Reset pagination when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      skip: page * (prev.take || 50),
    }));
  };

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            System Audit
          </h1>
          <p className="text-muted-foreground">Loading audit records...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  if (!user || !hasRequiredPermissions(user)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You do not have permission to access the audit records.
          </p>
        </div>
      </div>
    );
  }

  // Calculate quick stats from current logs
  const uniqueUsers = new Set(logs.map((log) => log.userId)).size;
  const recentLogs = logs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return logDate > yesterday;
  }).length;

  const criticalActions = logs.filter((log) =>
    [
      AuditAction.DELETE,
      AuditAction.LOGIN_FAILED,
      AuditAction.SYSTEM_CONFIG_CHANGE,
    ].includes(log.action),
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          System Audit
        </h1>
        <p className="text-muted-foreground">
          Complete record of all system activities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Showing {logs.length} of {total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">In current records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentLogs}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Actions
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalActions}</div>
            <p className="text-xs text-muted-foreground">In current records</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Audit Records</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <AuditFilters
            query={query}
            onQueryChange={handleQueryChange}
            loading={loading}
          />

          {error ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-red-600">Error: {error}</p>
              </CardContent>
            </Card>
          ) : (
            <AuditLogsTable
              logs={logs}
              total={total}
              loading={loading}
              currentPage={Math.floor((query.skip || 0) / (query.take || 50))}
              pageSize={query.take || 50}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>

        <TabsContent value="statistics">
          <AuditStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
