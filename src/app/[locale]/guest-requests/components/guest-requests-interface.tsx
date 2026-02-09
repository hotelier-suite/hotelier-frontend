"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getIntlLocale } from "@/lib/utils/locale";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { type GuestRequest } from "@/lib/features/guest-requests/types";
import { guestRequestsService } from "@/lib/features/guest-requests/service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
} from "lucide-react";

function createNewRequestSchema(t: (key: string) => string) {
  return z.object({
    guestName: z.string().min(1, t("validationGuestNameRequired")),
    room: z.string().min(1, t("validationRoomRequired")),
    type: z.enum([
      "MAINTENANCE",
      "HOUSEKEEPING",
      "TOWELS",
      "ROOM_SERVICE",
      "CONCIERGE",
      "TECHNICAL_SUPPORT",
      "OTHER",
    ]),
    description: z.string().min(1, t("validationDescriptionRequired")),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  });
}

type NewRequestFormData = z.infer<ReturnType<typeof createNewRequestSchema>>;

interface GuestRequestsInterfaceProps {
  initialRequests: GuestRequest[];
}

export default function GuestRequestsInterface({
  initialRequests,
}: GuestRequestsInterfaceProps) {
  const t = useTranslations("GuestRequestsInterfaceComp");
  const locale = useLocale();
  const intlLocale = getIntlLocale(locale);
  const newRequestSchema = createNewRequestSchema(t);
  const [requests, setRequests] = useState<GuestRequest[]>(initialRequests);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [newRequestDialogOpen, setNewRequestDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<GuestRequest | null>(
    null,
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const form = useForm<NewRequestFormData>({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      guestName: "",
      room: "",
      type: "OTHER",
      description: "",
      priority: "MEDIUM",
    },
  });

  const getStatusColor = (status: GuestRequest["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: GuestRequest["priority"]) => {
    switch (priority) {
      case "LOW":
        return "text-green-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "HIGH":
        return "text-orange-600";
      case "URGENT":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTypeLabel = (type: GuestRequest["type"]) => {
    const labels = {
      MAINTENANCE: t("typeMaintenance"),
      HOUSEKEEPING: t("typeHousekeeping"),
      TOWELS: t("typeTowels"),
      ROOM_SERVICE: t("typeRoomService"),
      CONCIERGE: t("typeConcierge"),
      TECHNICAL_SUPPORT: t("typeTechnicalSupport"),
      OTHER: t("typeOther"),
    };
    return labels[type] || type;
  };

  const handleCreateRequest = async (data: NewRequestFormData) => {
    try {
      setLoading(true);
      const requestData = {
        ...data,
        time: new Date().toISOString(),
        status: "PENDING" as const,
      };

      const createdRequest = await guestRequestsService.create(requestData);
      setRequests((prev) => [createdRequest, ...prev]);

      form.reset();
      setNewRequestDialogOpen(false);
      toast.success(t("requestCreated"));
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error(t("errorCreatingRequest"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string | number,
    newStatus: GuestRequest["status"],
  ) => {
    try {
      setLoading(true);
      const numericId = typeof id === "string" ? parseInt(id) : id;
      const updatedRequest = await guestRequestsService.update(numericId, {
        status: newStatus,
      });
      setRequests((prev) =>
        prev.map((request) => (request.id === id ? updatedRequest : request)),
      );
      toast.success(t("statusUpdated"));
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(t("errorUpdatingStatus"));
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <>
      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-96"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="PENDING">{t("pending")}</SelectItem>
              <SelectItem value="IN_PROGRESS">{t("inProgress")}</SelectItem>
              <SelectItem value="COMPLETED">{t("completed")}</SelectItem>
              <SelectItem value="CANCELLED">{t("cancelled")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("priority")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="URGENT">{t("urgent")}</SelectItem>
              <SelectItem value="HIGH">{t("high")}</SelectItem>
              <SelectItem value="MEDIUM">{t("medium")}</SelectItem>
              <SelectItem value="LOW">{t("low")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog
          open={newRequestDialogOpen}
          onOpenChange={setNewRequestDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("newRequest")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("newRequest")}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleCreateRequest)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="guestName">{t("guestName")} *</Label>
                <Input
                  id="guestName"
                  {...form.register("guestName")}
                  placeholder={t("fullNamePlaceholder")}
                  className={
                    form.formState.errors.guestName ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.guestName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.guestName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">{t("roomNumber")} *</Label>
                <Input
                  id="room"
                  {...form.register("room")}
                  placeholder={t("roomPlaceholder")}
                  className={form.formState.errors.room ? "border-red-500" : ""}
                />
                {form.formState.errors.room && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.room.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">{t("requestType")} *</Label>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          form.formState.errors.type ? "border-red-500" : ""
                        }
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAINTENANCE">
                          {t("typeMaintenance")}
                        </SelectItem>
                        <SelectItem value="HOUSEKEEPING">
                          {t("typeHousekeeping")}
                        </SelectItem>
                        <SelectItem value="TOWELS">
                          {t("typeTowels")}
                        </SelectItem>
                        <SelectItem value="ROOM_SERVICE">
                          {t("typeRoomService")}
                        </SelectItem>
                        <SelectItem value="CONCIERGE">
                          {t("typeConcierge")}
                        </SelectItem>
                        <SelectItem value="TECHNICAL_SUPPORT">
                          {t("typeTechnicalSupport")}
                        </SelectItem>
                        <SelectItem value="OTHER">{t("typeOther")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">{t("priority")} *</Label>
                <Controller
                  name="priority"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          form.formState.errors.priority ? "border-red-500" : ""
                        }
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">{t("low")}</SelectItem>
                        <SelectItem value="MEDIUM">{t("medium")}</SelectItem>
                        <SelectItem value="HIGH">{t("high")}</SelectItem>
                        <SelectItem value="URGENT">{t("urgent")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("description")} *</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                  className={
                    form.formState.errors.description ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setNewRequestDialogOpen(false);
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {t("createRequest")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card
            key={request.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedRequest(request);
              setDetailDialogOpen(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{request.guestName}</h3>
                    {request.room && (
                      <Badge variant="outline">
                        {t("room")} {request.room}
                      </Badge>
                    )}
                    <Badge
                      className={`${getStatusColor(request.status)} text-white`}
                    >
                      {request.status === "PENDING" && (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {request.status === "COMPLETED" && (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {request.status === "CANCELLED" && (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {request.status === "IN_PROGRESS" && (
                        <MessageSquare className="mr-1 h-3 w-3" />
                      )}
                      {t(`statuses.${request.status}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium">
                      {getTypeLabel(request.type)}
                    </span>
                    <span
                      className={`text-sm font-medium ${getPriorityColor(request.priority)}`}
                    >
                      {t("priority")}: {t(`priorities.${request.priority}`)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {request.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {t("created")}:{" "}
                    {new Date(request.createdAt).toLocaleString(intlLocale)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {request.status === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(request.id, "IN_PROGRESS");
                      }}
                    >
                      {t("take")}
                    </Button>
                  )}
                  {request.status === "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(request.id, "COMPLETED");
                      }}
                    >
                      {t("complete")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noRequestsMatch")}</p>
        </div>
      )}

      {/* Request Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("requestDetails")}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">{t("guest")}</Label>
                <p className="text-sm">{selectedRequest.guestName}</p>
              </div>
              {selectedRequest.room && (
                <div>
                  <Label className="text-sm font-medium">{t("room")}</Label>
                  <p className="text-sm">{selectedRequest.room}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">{t("type")}</Label>
                <p className="text-sm">{getTypeLabel(selectedRequest.type)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">{t("priority")}</Label>
                <p
                  className={`text-sm ${getPriorityColor(selectedRequest.priority)}`}
                >
                  {t(`priorities.${selectedRequest.priority}`)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">{t("status")}</Label>
                <Badge
                  className={`${getStatusColor(selectedRequest.status)} text-white`}
                >
                  {t(`statuses.${selectedRequest.status}`)}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  {t("description")}
                </Label>
                <p className="text-sm">{selectedRequest.description}</p>
              </div>
              <div className="flex gap-2">
                {selectedRequest.status === "PENDING" && (
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedRequest.id, "IN_PROGRESS");
                      setDetailDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    {t("takeRequest")}
                  </Button>
                )}
                {selectedRequest.status === "IN_PROGRESS" && (
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedRequest.id, "COMPLETED");
                      setDetailDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    {t("markCompleted")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
