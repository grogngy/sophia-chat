import { useEffect, useRef, useState, useMemo, RefObject } from "react";
import { type AiModel } from "@/lib/drizzle/schema";

/**
 * Pure function that computes which model should be selected given the current state.
 * This handles ALL model selection logic in one place.
 */
function computeCorrectModel(
  availableModels: AiModel[], 
  preferredModelId?: string | null
): AiModel | null {
  // Filter to only active models
  const activeModels = availableModels.filter((model) => model.is_active);
  
  if (activeModels.length === 0) return null;
  
  // Try preferred model first (from conversation.active_model_id)
  if (preferredModelId) {
    const preferredModel = activeModels.find((model) => model.id === preferredModelId);
    if (preferredModel) return preferredModel;
  }
  
  // Simple fallback: gpt-5 → first active → null
  const gpt5Model = activeModels.find((model) => model.model_name === "gpt-5");
  return gpt5Model || activeModels[0] || null;
}

export function useChatModel(
  availableModels: AiModel[],
  preferredModelId?: string | null
): {
  currentModel: AiModel | null;
  currentModelRef: RefObject<AiModel | null>;
  isModelReady: boolean;
  setCurrentModel: (model: AiModel) => void;
} {
  // Always compute what the correct model SHOULD be
  const correctModel = useMemo(
    () => computeCorrectModel(availableModels, preferredModelId),
    [availableModels, preferredModelId]
  );
  
  const [currentModel, setCurrentModel] = useState<AiModel | null>(correctModel);
  const currentModelRef = useRef<AiModel | null>(correctModel);

  // Initialize from computed model, but preserve user selection thereafter.
  // Only reset when no selection exists OR current selection becomes invalid.
  useEffect(() => {
    // Check: Does the user have a selection?
    const hasSelection = !!currentModel;

    // Check: Is their selection active?
    const isSelectionActive = hasSelection && 
      availableModels.some((m) => m.id === currentModel.id && m.is_active);

    // If the user didn't select a model OR their selection is no longer active,
    // then we need to reset to the correct model.
    const shouldReset = (!hasSelection || !isSelectionActive) && !!correctModel;

    if (shouldReset) {
      setCurrentModel(correctModel);
      currentModelRef.current = correctModel;
    }
  }, [correctModel, availableModels, currentModel]);

  const isModelReady = !!currentModelRef.current;

  const handleModelChange = (model: AiModel): void => {
    setCurrentModel(model);
    currentModelRef.current = model;
  };

  return {
    currentModel,
    currentModelRef,
    isModelReady,
    setCurrentModel: handleModelChange,
  };
}