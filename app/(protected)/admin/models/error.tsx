"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminModelsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to monitoring service
    console.error("Admin models page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header - Error page doesn't need Add Button */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Models</h1>
        <p className="text-muted-foreground">
          Manage AI models, their capabilities, and availability.
        </p>
      </div>

      <div className="space-y-6">

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Models
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            An error occurred while loading the AI models. This could be due to
            a temporary connection issue or server problem.
          </p>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-mono">
              {error.message || "An unexpected error occurred"}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-1">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={reset} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
