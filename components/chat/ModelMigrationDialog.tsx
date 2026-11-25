"use client";

import { useState } from "react";
import { type AiModel } from "@/lib/drizzle/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ModelMigrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableModels: AiModel[];
  inactiveModel: AiModel;
  onSelectModel: (model: AiModel) => Promise<void>;
  isLoading?: boolean;
}

export function ModelMigrationDialog({
  open,
  onOpenChange,
  availableModels,
  inactiveModel,
  onSelectModel,
  isLoading = false,
}: ModelMigrationDialogProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  const handleConfirm = async () => {
    const selectedModel = availableModels.find((m) => m.id === selectedModelId);
    if (selectedModel) {
      await onSelectModel(selectedModel);
    }
  };

  const selectedModel = availableModels.find((m) => m.id === selectedModelId);
  const inactiveModelDisplay = `${inactiveModel.provider_name} ${inactiveModel.model_name}`;

  // Group models by provider for better organization
  const modelsByProvider = availableModels.reduce((acc, model) => {
    if (!acc[model.provider_name]) {
      acc[model.provider_name] = [];
    }
    acc[model.provider_name].push(model);
    return acc;
  }, {} as Record<string, AiModel[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a New Model</DialogTitle>
          <DialogDescription className="space-y-2">
            <div>
              The model{" "}
              <Badge variant="outline" className="mx-1">
                {inactiveModelDisplay}
              </Badge>
              is no longer available for this conversation.
            </div>
            <div>
              Please select a new model to continue. Your message history will
              be preserved.
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="model-select" className="text-sm font-medium">
              Choose a model:
            </label>
            <Select
              value={selectedModelId}
              onValueChange={setSelectedModelId}
              disabled={isLoading}
            >
              <SelectTrigger id="model-select">
                <SelectValue placeholder="Select a model..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(modelsByProvider).map(([provider, models]) => (
                  <div key={provider}>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {provider}
                    </div>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{model.model_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedModel && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">
                {selectedModel.provider_name} {selectedModel.model_name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Your conversation will continue with this model.
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedModelId || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue with Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
