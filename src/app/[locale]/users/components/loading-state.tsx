"use client";

import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </CardContent>
    </Card>
  );
}
