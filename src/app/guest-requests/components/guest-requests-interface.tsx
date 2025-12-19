"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { guestRequestsApi, type GuestRequest } from "@/lib/api/guest-requests";
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

const newRequestSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  room: z.string().min(1, "Room number is required"),
  type: z.enum([
    "MAINTENANCE",
    "HOUSEKEEPING",
    "TOWELS",
    "ROOM_SERVICE",
    "CONCIERGE",
    "TECHNICAL_SUPPORT",
    "OTHER",
  ]),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

type NewRequestFormData = z.infer<typeof newRequestSchema>;

interface GuestRequestsInterfaceProps {
  initialRequests: GuestRequest[];
}

export default function GuestRequestsInterface({
  initialRequests,
}: GuestRequestsInterfaceProps) {
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
      MAINTENANCE: "Maintenance",
      HOUSEKEEPING: "Housekeeping",
      TOWELS: "Towels",
      ROOM_SERVICE: "Room Service",
      CONCIERGE: "Concierge",
      TECHNICAL_SUPPORT: "Technical Support",
      OTHER: "Other",
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

      const createdRequest = await guestRequestsApi.create(requestData);
      setRequests((prev) => [createdRequest, ...prev]);

      form.reset();
      setNewRequestDialogOpen(false);
      toast.success("Request created successfully");
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Error creating the request");
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
      const updatedRequest = await guestRequestsApi.update(numericId, {
        status: newStatus,
      });
      setRequests((prev) =>
        prev.map((request) => (request.id === id ? updatedRequest : request)),
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating the status");
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
              placeholder="Search by guest, room or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-96"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
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
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Request</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleCreateRequest)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="guestName">Guest Name *</Label>
                <Input
                  id="guestName"
                  {...form.register("guestName")}
                  placeholder="Full name"
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
                <Label htmlFor="room">Room Number *</Label>
                <Input
                  id="room"
                  {...form.register("room")}
                  placeholder="e.g.: 101"
                  className={form.formState.errors.room ? "border-red-500" : ""}
                />
                {form.formState.errors.room && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.room.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Request Type *</Label>
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
                          Maintenance
                        </SelectItem>
                        <SelectItem value="HOUSEKEEPING">Housekeeping</SelectItem>
                        <SelectItem value="TOWELS">Towels</SelectItem>
                        <SelectItem value="ROOM_SERVICE">
                          Room Service
                        </SelectItem>
                        <SelectItem value="CONCIERGE">Concierge</SelectItem>
                        <SelectItem value="TECHNICAL_SUPPORT">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
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
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Describe the request..."
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
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  Create Request
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
                      <Badge variant="outline">Room {request.room}</Badge>
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
                      {request.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium">
                      {getTypeLabel(request.type)}
                    </span>
                    <span
                      className={`text-sm font-medium ${getPriorityColor(request.priority)}`}
                    >
                      Priority: {request.priority.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {request.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(request.createdAt).toLocaleString()}
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
                      Take
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
                      Complete
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
          <p className="text-muted-foreground">
            No requests match the filters.
          </p>
        </div>
      )}

      {/* Request Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Guest</Label>
                <p className="text-sm">{selectedRequest.guestName}</p>
              </div>
              {selectedRequest.room && (
                <div>
                  <Label className="text-sm font-medium">Room</Label>
                  <p className="text-sm">{selectedRequest.room}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p className="text-sm">{getTypeLabel(selectedRequest.type)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <p
                  className={`text-sm ${getPriorityColor(selectedRequest.priority)}`}
                >
                  {selectedRequest.priority}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge
                  className={`${getStatusColor(selectedRequest.status)} text-white`}
                >
                  {selectedRequest.status.replace("_", " ")}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
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
                    Take Request
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
                    Mark Completed
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
