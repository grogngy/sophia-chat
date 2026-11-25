"use client";

import { useState } from "react";
import { type AiModel } from "@/lib/drizzle/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModelActionButton } from "@/components/admin/ModelActionButton";
import { ModelEditDialog } from "@/components/admin/ModelEditDialog";
import { Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelCapabilityIcons } from "./ModelCapabilityIcons";

interface ModelsTableProps {
  models: AiModel[];
}

export function ModelsTable({ models }: ModelsTableProps) {
  const [editingModel, setEditingModel] = useState<AiModel | null>(null);

  return (
    <div className="space-y-4">
      {models.map((model) => (
        <Card key={model.id} className={cn(!model.is_active && "opacity-60")}>
          <CardHeader className="pb-3">
            {/* Desktop Layout */}
            <div className="hidden md:flex md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">
                  {model.provider_name} {model.model_name}
                </CardTitle>
                <ModelCapabilityIcons model={model} />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingModel(model)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit model</span>
                </Button>
                <ModelActionButton
                  modelId={model.id}
                  modelName={model.model_name}
                  providerName={model.provider_name}
                  isActive={model.is_active}
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="space-y-3">
                <CardTitle className="text-lg">
                  {model.provider_name} {model.model_name}
                </CardTitle>
                <ModelCapabilityIcons model={model} />
                <div className="text-xs text-muted-foreground">
                  <div className="flex flex-col gap-1">
                    <div>Created: {model.created_at.toLocaleDateString()}</div>
                    <div>Updated: {model.updated_at.toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop timestamps */}
            <div className="hidden md:block text-xs text-muted-foreground">
              <div className="flex flex-col sm:flex-row gap-2">
                <div>Created: {model.created_at.toLocaleDateString()}</div>
                <span className="hidden sm:block">|</span>
                <div>Updated: {model.updated_at.toLocaleDateString()}</div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="md:hidden mt-0">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingModel(model)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <ModelActionButton
                  modelId={model.id}
                  modelName={model.model_name}
                  providerName={model.provider_name}
                  isActive={model.is_active}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {models.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No models found</p>
        </div>
      )}

      <ModelEditDialog
        open={editingModel !== null}
        onOpenChange={(open) => !open && setEditingModel(null)}
        model={editingModel}
      />
    </div>
  );
}
