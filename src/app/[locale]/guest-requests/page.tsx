import { guestRequestsService } from "@/lib/features/guest-requests/service";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import GuestRequestsInterface from "./components/guest-requests-interface";

export const dynamic = "force-dynamic";

export default async function GuestRequestsPage() {
  const requests = await guestRequestsService.getAll();
  const t = await getTranslations("GuestRequestsPage");

  const statusCounts = {
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    IN_PROGRESS: requests.filter((r) => r.status === "IN_PROGRESS").length,
    COMPLETED: requests.filter((r) => r.status === "COMPLETED").length,
    CANCELLED: requests.filter((r) => r.status === "CANCELLED").length,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pending")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.PENDING}</div>
            <p className="text-xs text-muted-foreground">
              {t("pendingRequests")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("inProgress")}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.IN_PROGRESS}</div>
            <p className="text-xs text-muted-foreground">
              {t("beingProcessed")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("completed")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.COMPLETED}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("resolvedSuccessfully")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("cancelled")}
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.CANCELLED}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("cancelledRequests")}
            </p>
          </CardContent>
        </Card>
      </div>

      <GuestRequestsInterface initialRequests={requests} />
    </div>
  );
}
