import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        {/* Logo skeleton */}
        <div className="flex items-center justify-center mb-6">
          <Skeleton className="h-16 w-48 animate-pulse" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-8 w-32 mx-auto animate-pulse" />

        {/* Description skeleton */}
        <Skeleton className="h-5 w-60 mx-auto animate-pulse" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 animate-pulse" />
          <Skeleton className="h-10 w-full animate-pulse" />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 animate-pulse" />
          <div className="relative">
            <Skeleton className="h-10 w-full animate-pulse" />
            {/* Eye icon placeholder */}
            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
              <Skeleton className="h-4 w-4 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center space-x-2 py-2">
          <Skeleton className="h-4 w-4 rounded animate-pulse" />
          <Skeleton className="h-4 w-20 animate-pulse" />
        </div>

        {/* Submit Button */}
        <Skeleton className="h-10 w-full animate-pulse" />

        {/* Test credentials section */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
          <Skeleton className="h-4 w-36 mx-auto animate-pulse" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full animate-pulse" />
            <Skeleton className="h-3 w-full animate-pulse" />
            <Skeleton className="h-3 w-full animate-pulse" />
            <Skeleton className="h-3 w-full animate-pulse" />
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <Skeleton className="h-4 w-44 mx-auto animate-pulse" />

          <div className="border-t pt-3">
            <Skeleton className="h-4 w-52 mx-auto animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
