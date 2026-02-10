import { apiRequest } from "@/lib/api/base";
import {
  GeneralMaintenanceRequest,
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
  MaintenanceStats,
} from "./types";

export const maintenanceService = {
  async getAll(): Promise<GeneralMaintenanceRequest[]> {
    return apiRequest<GeneralMaintenanceRequest[]>("/maintenance");
  },

  async getById(id: number): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>(`/maintenance/${id}`);
  },

  async create(
    data: CreateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>("/maintenance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: number,
    data: UpdateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>(`/maintenance/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/maintenance/${id}`, {
      method: "DELETE",
    });
  },

  async getByStatus(status: string): Promise<GeneralMaintenanceRequest[]> {
    const all = await maintenanceService.getAll();
    return all.filter((r) => r.status === status);
  },

  async getByPriority(priority: string): Promise<GeneralMaintenanceRequest[]> {
    const all = await maintenanceService.getAll();
    return all.filter((r) => r.priority === priority);
  },

  async getByTechnician(
    technicianId: number,
  ): Promise<GeneralMaintenanceRequest[]> {
    const all = await maintenanceService.getAll();
    return all.filter((r) => r.assignedTechnicianId === technicianId);
  },

  async getOverdue(): Promise<GeneralMaintenanceRequest[]> {
    const all = await maintenanceService.getAll();
    const now = new Date();
    return all.filter((r) => {
      if (r.status === "completed" || r.status === "cancelled") return false;
      const scheduledDate = r.scheduledDate ? new Date(r.scheduledDate) : null;
      return scheduledDate && scheduledDate < now;
    });
  },

  async getUpcoming(days?: number): Promise<GeneralMaintenanceRequest[]> {
    const all = await maintenanceService.getAll();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (days || 7));
    return all.filter((r) => {
      if (r.status === "completed" || r.status === "cancelled") return false;
      const scheduledDate = r.scheduledDate ? new Date(r.scheduledDate) : null;
      return (
        scheduledDate && scheduledDate >= now && scheduledDate <= futureDate
      );
    });
  },

  async getStats(): Promise<MaintenanceStats> {
    const requests = await maintenanceService.getAll();
    const now = new Date();
    return {
      total: requests.length,
      scheduled: requests.filter((r) => r.status === "scheduled").length,
      inProgress: requests.filter((r) => r.status === "in_progress").length,
      completed: requests.filter((r) => r.status === "completed").length,
      overdue: requests.filter((r) => {
        if (r.status === "completed" || r.status === "cancelled") return false;
        const scheduledDate = r.scheduledDate
          ? new Date(r.scheduledDate)
          : null;
        return scheduledDate && scheduledDate < now;
      }).length,
      byPriority: {
        low: requests.filter((r) => r.priority === "low").length,
        medium: requests.filter((r) => r.priority === "medium").length,
        high: requests.filter((r) => r.priority === "high").length,
        urgent: requests.filter((r) => r.priority === "urgent").length,
        critical: requests.filter((r) => r.priority === "critical").length,
      },
    };
  },

  async assignTechnician(
    id: number,
    technicianId: number,
  ): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>(
      `/maintenance/${id}/assign/${technicianId}`,
      {
        method: "PATCH",
      },
    );
  },

  async updateStatus(
    id: number,
    status: string,
  ): Promise<GeneralMaintenanceRequest> {
    return maintenanceService.update(id, {
      status: status as UpdateMaintenanceRequestDto["status"],
    });
  },
};
