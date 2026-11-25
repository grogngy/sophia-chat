import { Suspense } from "react";
import { getAllModelsForAdmin } from "@/app/actions/models";
import { AddModelButton } from "@/components/models/AddModelButton";
import { ModelsTable } from "@/components/models/ModelsTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

async function ModelsTableWrapper() {
  const result = await getAllModelsForAdmin();

  if (!result.success) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Failed to load models: {result.error}
        </p>
      </div>
    );
  }

  return <ModelsTable models={result.data?.models || []} />;
}

function ModelsTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminModelsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Models</h1>
          <p className="text-muted-foreground">
            Manage AI models, their capabilities, and availability.
          </p>
        </div>
        <div className="flex-shrink-0">
          <AddModelButton />
        </div>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<ModelsTableSkeleton />}>
          <ModelsTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}
