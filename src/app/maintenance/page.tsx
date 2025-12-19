"use client";

import { useEffect, useState } from "react";
import MaintenanceDashboard from "./components/maintenance-dashboard";
import {
  maintenanceApi,
  GeneralMaintenanceRequest,
} from "@/lib/api/maintenance";
import { housekeepingApi, MaintenanceReport } from "@/lib/api/housekeeping";

export default function MaintenancePage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<GeneralMaintenanceRequest[]>([]);
  const [housekeepingReports, setHousekeepingReports] = useState<
    MaintenanceReport[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both general maintenance requests and housekeeping incident reports
        const [generalRequests, incidentReports] = await Promise.all([
          maintenanceApi.getAll(),
          housekeepingApi.getMaintenanceReports(),
        ]);

        setRequests(generalRequests);
        setHousekeepingReports(incidentReports);
        setError(null);
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
        setError("Error loading maintenance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading maintenance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <MaintenanceDashboard
      initialRequests={requests}
      housekeepingReports={housekeepingReports}
    />
  );
}
