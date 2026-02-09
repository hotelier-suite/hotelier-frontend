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
        <Skeleton className="h-5 w-72 mx-auto animate-pulse" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 animate-pulse" />
          <Skeleton className="h-10 w-full animate-pulse" />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 animate-pulse" />
          <Skeleton className="h-10 w-full animate-pulse" />
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 animate-pulse" />
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 animate-pulse" />
          <div className="relative">
            <Skeleton className="h-10 w-full animate-pulse" />
            {/* Eye icon placeholder */}
            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
              <Skeleton className="h-4 w-4 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Skeleton className="h-10 w-full animate-pulse" />

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <Skeleton className="h-4 w-48 mx-auto animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
