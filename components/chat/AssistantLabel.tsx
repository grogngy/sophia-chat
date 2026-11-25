import { Bot } from "lucide-react";

interface AssistantLabelProps {
  modelName?: string | null;
}

export function AssistantLabel({ modelName }: AssistantLabelProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Bot className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        Assistant{modelName ? ` - ${modelName}` : ""}
      </span>
    </div>
  );
}
