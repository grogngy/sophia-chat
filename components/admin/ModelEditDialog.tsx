"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type AiModel } from "@/lib/drizzle/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateModel } from "@/app/actions/models";
import { modelSchema, type ModelFormData } from "@/lib/models-client";

interface ModelEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: AiModel | null;
}

export function ModelEditDialog({
  open,
  onOpenChange,
  model,
}: ModelEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ModelFormData>({
    provider_name: "OpenAI",
    model_name: "",
    has_image_input: false,
    has_audio_input: false,
    has_reasoning: false,
  });
  const router = useRouter();

  // Reset form when model changes
  useEffect(() => {
    if (model) {
      setFormData({
        provider_name: model.provider_name,
        model_name: model.model_name,
        has_image_input: model.has_image_input,
        has_audio_input: model.has_audio_input,
        has_reasoning: model.has_reasoning,
      });
      setError(null);
    }
  }, [model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model) return;

    setIsLoading(true);
    setError(null);

    // Validate form data using safeParse
    const validationResult = modelSchema.safeParse(formData);

    if (!validationResult.success) {
      setError(validationResult.error.errors[0]?.message || "Validation failed");
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateModel(model.id, validationResult.data);

      if (result.success) {
        toast.success(
          `Successfully updated ${validationResult.data.provider_name} ${validationResult.data.model_name}`
        );
        onOpenChange(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error updating model:", error);
      setError("Failed to update model. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    if (model) {
      setFormData({
        provider_name: model.provider_name,
        model_name: model.model_name,
        has_image_input: model.has_image_input,
        has_audio_input: model.has_audio_input,
        has_reasoning: model.has_reasoning,
      });
    }
    setError(null);
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  if (!model) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit AI Model</DialogTitle>
          <DialogDescription>
            Update the configuration for {model.provider_name}{" "}
            {model.model_name}. Changes will be applied immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_provider_name">Provider</Label>
              <Select
                value={formData.provider_name}
                onValueChange={(value) =>
                  updateFormData("provider_name", value as ModelFormData["provider_name"])
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Anthropic">Anthropic</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="xAI">xAI</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The AI provider offering this model
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_model_name">Model Name</Label>
              <Input
                id="edit_model_name"
                placeholder="e.g., gpt-4o, claude-3-sonnet"
                value={formData.model_name}
                onChange={(e) => updateFormData("model_name", e.target.value)}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                The specific model identifier
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Model Capabilities</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="edit_has_image_input"
                  checked={formData.has_image_input}
                  onCheckedChange={(checked) =>
                    updateFormData("has_image_input", !!checked)
                  }
                  disabled={isLoading}
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="edit_has_image_input"
                    className="text-sm font-normal"
                  >
                    Image Input
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Can process image uploads
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="edit_has_audio_input"
                  checked={formData.has_audio_input}
                  onCheckedChange={(checked) =>
                    updateFormData("has_audio_input", !!checked)
                  }
                  disabled={isLoading}
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="edit_has_audio_input"
                    className="text-sm font-normal"
                  >
                    Audio Input
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Can process audio files
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="edit_has_reasoning"
                  checked={formData.has_reasoning}
                  onCheckedChange={(checked) =>
                    updateFormData("has_reasoning", !!checked)
                  }
                  disabled={isLoading}
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="edit_has_reasoning"
                    className="text-sm font-normal"
                  >
                    Reasoning
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Supports advanced reasoning
                  </p>
                </div>
              </div>

            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Model...
                </>
              ) : (
                "Update Model"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
