"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createModel } from "@/app/actions/models";
import { modelSchema, type ModelFormData, initialFormState } from "@/lib/models-client";

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddModelDialog({ open, onOpenChange }: AddModelDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ModelFormData>(initialFormState);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate form data using safeParse
    const validation = modelSchema.safeParse(formData);

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || "Validation failed");
      setIsLoading(false);
      return;
    }

    try {
      const result = await createModel(validation.data);

      if (result.success) {
        toast.success(
          `Successfully added ${validation.data.provider_name} ${validation.data.model_name}`
        );
        handleCancel(); // Reset form and close
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error creating model:", error);
      setError("Failed to create model. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    setFormData(initialFormState);
    setError(null);
    onOpenChange(false);
  };

  const updateFormData = <K extends keyof ModelFormData>(
    field: K,
    value: ModelFormData[K]
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New AI Model</DialogTitle>
          <DialogDescription>
            Add a new AI model to the system. This model will be available for
            users to select in conversations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider_name">Provider</Label>
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
              <Label htmlFor="model_name">Model Name</Label>
              <Input
                id="model_name"
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
                  id="has_image_input"
                  checked={formData.has_image_input}
                  onCheckedChange={(checked) =>
                    updateFormData("has_image_input", !!checked)
                  }
                  disabled={isLoading}
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="has_image_input"
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
                  id="has_audio_input"
                  checked={formData.has_audio_input}
                  onCheckedChange={(checked) =>
                    updateFormData("has_audio_input", !!checked)
                  }
                  disabled={isLoading}
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="has_audio_input"
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
                  id="has_reasoning"
                  checked={formData.has_reasoning}
                  onCheckedChange={(checked) =>
                    updateFormData("has_reasoning", !!checked)
                  }
                  disabled={isLoading}
                />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="has_reasoning"
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
                  Adding Model...
                </>
              ) : (
                "Add Model"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
