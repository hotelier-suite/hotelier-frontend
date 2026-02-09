"use client"; // Error boundaries must be Client Components

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">{t("errorLoading")}</CardTitle>
          <CardDescription>{t("unexpectedError")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-md bg-gray-50 p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {t("errorDetails")}
              </h4>
              <p className="text-sm text-gray-600 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  {t("digest")} {error.digest}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("tryAgain")}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              {t("reloadPage")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
