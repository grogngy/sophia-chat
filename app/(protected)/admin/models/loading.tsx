import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminModelsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header Skeleton with Add Button */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="flex-shrink-0">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="space-y-6">

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              {/* Desktop Skeleton */}
              <div className="hidden md:flex md:items-center md:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>

              {/* Mobile Skeleton */}
              <div className="md:hidden">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>

              {/* Mobile Action Buttons Skeleton */}
              <div className="md:hidden mt-4 pt-4 border-t">
                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
