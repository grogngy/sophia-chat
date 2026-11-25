"use client";

import { AiModel } from "@/lib/drizzle/schema";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { cn } from "@/lib/utils";

interface CurrentModelDropdownProps {
  currentModel?: AiModel;
  availableModels: AiModel[];
  onModelSelect: (model: AiModel) => void;
  isLoading?: boolean;
}

// Map providers to colors
const providerColors = {
  OpenAI: "text-openai",
  Anthropic: "text-anthropic",
  Google: "text-gemini-blue",
  xAI: "text-black dark:text-white",
};

export function CurrentModelDropdown({
  currentModel,
  availableModels,
  onModelSelect,
  isLoading,
}: CurrentModelDropdownProps) {
  // Show disabled state when no models are available
  if (availableModels.length === 0) {
    return (
      <Button
        variant="outline"
        className="justify-between max-w-[220px] sm:max-w-full truncate"
        disabled
      >
        <span className="text-muted-foreground truncate">No models found</span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  // If we have models but no currentModel, it means no active models
  if (!currentModel) {
    return (
      <Button
        variant="outline"
        className="justify-between max-w-[220px] sm:max-w-full truncate"
        disabled
      >
        <span className="text-muted-foreground truncate">No active models</span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  const currentColorClass =
    providerColors[currentModel.provider_name as keyof typeof providerColors];

  const groupedModels = availableModels.reduce(
    (acc, model) => {
      const { provider_name } = model;
      if (!acc[provider_name]) {
        acc[provider_name] = [];
      }
      acc[provider_name].push(model);
      return acc;
    },
    {} as Record<string, AiModel[]>
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between max-w-[220px] sm:max-w-full truncate ${isLoading ? "opacity-40" : ""}`}
          disabled={isLoading}
        >
          <div className="flex items-center gap-2 truncate">
            <span className={`font-medium truncate ${currentColorClass}`}>
              {currentModel.model_name}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px]">
        {Object.entries(groupedModels).map(([provider, models], index) => {
          const providerColorClass =
            providerColors[provider as keyof typeof providerColors];
          return (
            <React.Fragment key={provider}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuGroup>
                <DropdownMenuLabel className={providerColorClass}>
                  {provider}
                </DropdownMenuLabel>
                {models.map((model) => {
                  const isSelected = currentModel.id === model.id;
                  const isDisabled = !model.is_active;

                  return (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={
                        isDisabled ? undefined : () => onModelSelect(model)
                      }
                      className={cn(
                        "hover:bg-primary/10",
                        isDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer",
                        isSelected && "bg-primary/10 text-primary"
                      )}
                      disabled={isDisabled}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span
                            className={`ml-2 ${
                              isDisabled ? "text-muted-foreground" : ""
                            }`}
                          >
                            {model.model_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!model.is_active && (
                            <Badge
                              variant="outline"
                              className="text-xs text-muted-foreground border-muted-foreground/50"
                            >
                              Disabled
                            </Badge>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
