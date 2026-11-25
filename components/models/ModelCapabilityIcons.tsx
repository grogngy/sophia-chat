"use client";

import { type AiModel } from "@/lib/drizzle/schema";
import { Eye, Headphones, Brain } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ModelCapabilityIconsProps {
  model: AiModel;
}

export function ModelCapabilityIcons({ model }: ModelCapabilityIconsProps) {
  const capabilities = [
    {
      condition: model.has_image_input,
      icon: Eye,
      tooltip: "Supports image uploads",
      bgColor: "bg-blue-600/10",
      iconColor: "text-blue-600",
    },
    {
      condition: model.has_audio_input,
      icon: Headphones,
      tooltip: "Supports audio inputs",
      bgColor: "bg-green-600/10",
      iconColor: "text-green-600",
    },
    {
      condition: model.has_reasoning,
      icon: Brain,
      tooltip: "Has reasoning capabilities",
      bgColor: "bg-purple-600/10",
      iconColor: "text-purple-600",
    },
  ];

  const activeCapabilities = capabilities.filter((cap) => cap.condition);

  if (activeCapabilities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No special capabilities
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeCapabilities.map((capability, index) => {
        const IconComponent = capability.icon;
        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${capability.bgColor} cursor-help`}
              >
                <IconComponent className={`w-4 h-4 ${capability.iconColor}`} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{capability.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
