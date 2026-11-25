"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deactivateModel, reactivateModel } from "@/app/actions/models";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ModelActionButtonProps {
  modelId: string;
  modelName: string;
  providerName: string;
  isActive: boolean;
  onActionComplete?: () => void;
}

export function ModelActionButton({
  modelId,
  modelName,
  providerName,
  isActive,
  onActionComplete,
}: ModelActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const action = isActive ? "deactivated" : "reactivated";
      const actionFunction = isActive ? deactivateModel : reactivateModel;

      const result = await actionFunction(modelId);

      if (result.success) {
        toast.success(`Successfully ${action} ${providerName} ${modelName}`);
        router.refresh();
        onActionComplete?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error updating model status:", error);
      toast.error(
        `Failed to ${isActive ? "deactivate" : "reactivate"} model`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isActive ? "outline" : "default"}
      size="sm"
      onClick={handleAction}
      disabled={isLoading}
      className="min-w-[90px]"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {isActive ? "Deactivating..." : "Activating..."}
        </>
      ) : (
        <>{isActive ? "Deactivate" : "Activate"}</>
      )}
    </Button>
  );
}
