"use client";

import { type AiModel } from "@/lib/drizzle/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface InactiveModelBannerProps {
  inactiveModel: AiModel;
  onSelectNewModel: () => void;
  className?: string;
}

export function InactiveModelBanner({
  inactiveModel,
  onSelectNewModel,
  className = "",
}: InactiveModelBannerProps) {
  const modelDisplayName = `${inactiveModel.provider_name} ${inactiveModel.model_name}`;

  return (
    <Alert
      className={`border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 ${className}`}
    >
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1 text-sm text-amber-800 dark:text-amber-200">
          <strong>Model No Longer Available:</strong> This conversation used{" "}
          <span className="font-medium">{modelDisplayName}</span> which is no
          longer active. You can continue the conversation by selecting a new
          model.
        </div>
        <Button
          size="sm"
          onClick={onSelectNewModel}
          className="ml-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white"
        >
          Select New Model
        </Button>
      </AlertDescription>
    </Alert>
  );
}
