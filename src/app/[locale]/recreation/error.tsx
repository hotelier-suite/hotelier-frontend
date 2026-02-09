"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecreationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("RecreationError");

  useEffect(() => {
    // Log the error to monitoring service
    console.error("Recreational page error:", error);
  }, [error]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <strong>{t("technicalDetails")}</strong>
              <br />
              {error.message || t("unknownError")}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={reset} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("tryAgain")}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                {t("reloadPage")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
