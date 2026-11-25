"use client";

import React, { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square } from "lucide-react";
import { CurrentModelDropdown } from "./CurrentModelDropdown";
import { ImageUpload } from "./ImageUpload";
import { AttachmentArea } from "./AttachmentArea";
import { MessageCounter } from "./MessageCounter";
import { type ImagePreview } from "@/lib/chat-utils-client";
import { IMAGE_UPLOAD_CONSTRAINTS } from "@/lib/app-utils";
import { useChatState } from "@/contexts/ChatStateContext";

export function MessageInput() {
  // Get chat state from context
  const {
    input,
    handleInputChange,
    isLoading,
    isStreaming,
    isStopping,
    setIsStopping,
    currentModel,
    availableModels,
    setCurrentModel,
    isModelReady,
    attachmentPreviews: attachments,
    handleAttachmentsChange: onAttachmentsChange,
    stop,
    isSendDisabled,
  } = useChatState();

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // Block submission when sending is disabled
      if (isSendDisabled) {
        return;
      }

      // Submit the closest form
      const form = e.currentTarget.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleStopClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsStopping(true);
    stop();
  };

  const handleImagesSelected = (images: ImagePreview[]) => {
    onAttachmentsChange([...attachments, ...images]);
  };

  // Get placeholder text based on current state
  const placeholderText = (): string => {
    if (isLoading) {
      return "Sophia está pensando...";
    }

    // Check if we have models but none are active
    if (!isModelReady && availableModels.length > 0) {
      return "No hay modelos de IA disponibles";
    }

    if (!isModelReady) {
      return "Selecciona un modelo para comenzar a aprender con Sophia...";
    }

    if (isStreaming) {
      return "Continúa preguntando a Sophia...";
    }

    if (attachments.length > 0) {
      return "Describe tu imagen para que Sophia la analice...";
    }

    return "Pregunta a Sophia sobre IA para tu negocio...";
  };

  // Determine button state and behavior
  const isStreamingOrStopping = isStreaming || isStopping;
  const canSend = input.trim() && !isSendDisabled;
  const canStop = isStreaming && !isStopping;

  // Check if current model supports image input
  const supportsImageInput = currentModel?.has_image_input || false;

  return (
    <div className="space-y-3 mb-2">
      {/* Attachment Area - Show when images are attached */}
      {attachments.length > 0 && (
        <AttachmentArea
          attachments={attachments}
          onAttachmentsChange={onAttachmentsChange}
          disabled={isSendDisabled}
        />
      )}

      {/* Text Input Row */}
      <div className="w-full">
        <Textarea
          placeholder={placeholderText()}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isSendDisabled}
          className="w-full text-md resize-none md:text-lg"
          rows={3}
          autoFocus
        />
      </div>

      {/* Controls Row: Attachment + Model Selector + Limit Badge + Send/Stop */}
      <div className="flex items-center gap-3">
        {/* Image Upload Button - Only show if model supports images */}
        {supportsImageInput && (
          <ImageUpload
            onImagesSelected={handleImagesSelected}
            currentImageCount={attachments.length}
            disabled={
              isSendDisabled ||
              attachments.length >=
                IMAGE_UPLOAD_CONSTRAINTS.MAX_FILES_PER_MESSAGE
            }
          />
        )}

        {/* Model Selector */}
        <CurrentModelDropdown
          currentModel={currentModel || undefined}
          availableModels={availableModels}
          onModelSelect={setCurrentModel}
          isLoading={isLoading || isStreaming}
        />

        {/* Message Counter - only shows when approaching limit */}
        <MessageCounter className="text-xs" />

        {/* Spacer to push send button to the right */}
        <div className="flex-1" />

        {/* Dynamic Send/Stop Button - Far Right */}
        {isStreamingOrStopping ? (
          <Button
            type="button"
            onClick={handleStopClicked}
            disabled={!canStop}
            size="icon"
            variant="destructive"
            className="shrink-0"
            aria-label="Stop generating response"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!canSend}
            size="icon"
            className="shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
