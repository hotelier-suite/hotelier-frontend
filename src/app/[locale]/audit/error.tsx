"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function AuditoriaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("AuditError");

  useEffect(() => {
    console.error("Audit page error:", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-mono text-red-800">
              {error.message || t("unknownError")}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-1">
                {t("digest")}: {error.digest}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t("tryAgain")}
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="h-4 w-4 mr-2" />
              {t("returnToHome")}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>{t("possibleSolutions")}</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("solution1")}</li>
              <li>{t("solution2")}</li>
              <li>{t("solution3")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
