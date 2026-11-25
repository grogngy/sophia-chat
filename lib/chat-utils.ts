import type { UIMessage, TextUIPart, FileUIPart, ReasoningUIPart } from "ai";
import {
  type MessageAttachment,
  type Message,
  messages as dbMessages,
  aiModels,
} from "@/lib/drizzle/schema";
import { refreshConversationAttachments } from "@/lib/attachments";
import { db } from "@/lib/drizzle/db";
import { eq, asc } from "drizzle-orm";

// =============================================================================
// MESSAGE UTILITIES & TYPES
// =============================================================================

// Extended Message type for UI components - extends v5 UIMessage with our database extensions
export interface ExtendedMessage extends UIMessage {
  // Database extensions for display purposes
  attachments?: MessageAttachment[];
  model_name?: string | null;
  provider_name?: string | null;
  status?: "success" | "error"; // Track message status for error handling
}

// =============================================================================
// CONVERSATION MESSAGE PROCESSING
// =============================================================================

/**
 * Fetch and process messages for a conversation, handling attachments and format conversion
 * @param conversationId - ID of the conversation to fetch messages for
 * @param userId - User ID for attachment refresh
 * @returns Processed messages ready for chat interface
 */
export async function fetchAndFormatConversationMessages(
  conversationId: string,
  userId: string
): Promise<{
  success: boolean;
  messages?: ExtendedMessage[];
  error?: string;
}> {
  try {
    console.log("🔍 Fetching messages for conversation:", conversationId);

    // Fetch messages from database with model information
    const dbMessagesResult = await db
      .select({
        id: dbMessages.id,
        conversation_id: dbMessages.conversation_id,
        sender: dbMessages.sender,
        content: dbMessages.content,
        model_id: dbMessages.model_id,
        attachments: dbMessages.attachments,
        status: dbMessages.status, // Include status field for error detection
        created_at: dbMessages.created_at,
        model_name: aiModels.model_name,
        reasoning: dbMessages.reasoning,
      })
      .from(dbMessages)
      .leftJoin(aiModels, eq(dbMessages.model_id, aiModels.id))
      .where(eq(dbMessages.conversation_id, conversationId))
      .orderBy(asc(dbMessages.created_at));

    console.log(
      `📋 Processing ${dbMessagesResult.length} messages from conversation`
    );

    const hasAttachments = dbMessagesResult.some(
      (msg) =>
        msg.attachments && (msg.attachments as MessageAttachment[]).length > 0
    );

    let finalMessages: Message[] = dbMessagesResult;

    // Handle attachment URL refresh if needed
    if (hasAttachments) {
      console.log("🔍 Checking for expired attachment URLs...");

      const refreshResult = await refreshConversationAttachments(
        dbMessagesResult,
        userId
      );

      if (refreshResult.success && refreshResult.refreshedCount > 0) {
        console.log(
          `✅ Refreshed ${refreshResult.refreshedCount} expired attachment URLs`
        );
        // Use the updated messages from the refresh result
        finalMessages = refreshResult.updatedMessages as Message[];
      } else if (refreshResult.failedCount > 0) {
        console.error(
          `❌ Failed to refresh ${refreshResult.failedCount} attachment URLs`
        );
      } else {
        console.log("✅ All attachment URLs are still valid");
      }
    } else {
      console.log("📭 No attachments found in conversation");
    }

    // Convert to AI SDK v5 format with parts arrays
    const messages: ExtendedMessage[] = finalMessages.map((msg) => {
      // Create parts array for v5 UIMessage structure
      const parts: Array<TextUIPart | FileUIPart | ReasoningUIPart> = [];

      // Add reasoning content as a reasoning part (for assistant messages)
      if (msg.sender === "assistant" && msg.reasoning && msg.reasoning.trim()) {
        parts.push({
          type: "reasoning",
          text: msg.reasoning,
        });
      }

      // Add text content as a text part
      if (msg.content && msg.content.trim()) {
        parts.push({
          type: "text",
          text: msg.content,
        });
      }

      // Add file attachments as file parts
      if (
        msg.attachments &&
        (msg.attachments as MessageAttachment[]).length > 0
      ) {
        (msg.attachments as MessageAttachment[]).forEach(
          (attachment: MessageAttachment) => {
            parts.push({
              type: "file",
              mediaType: attachment.contentType,
              url: attachment.signedUrl,
              filename: attachment.name,
            });
          }
        );
      }

      const message: ExtendedMessage = {
        id: msg.id,
        role: msg.sender as "user" | "assistant",
        parts: parts.length > 0 ? parts : [{ type: "text", text: "" }], // Ensure at least one part
      };

      // Add database attachments for display
      if (
        msg.attachments &&
        (msg.attachments as MessageAttachment[]).length > 0
      ) {
        message.attachments = msg.attachments as MessageAttachment[];
      }

      // Add status for error handling and UI display
      if (msg.status) {
        message.status = msg.status as "success" | "error";
      }

      // Add model information if available (only for assistant messages)
      if (msg.sender === "assistant") {
        message.model_name = (
          msg as Message & { model_name?: string }
        ).model_name;
      }

      return message;
    });

    return {
      success: true,
      messages,
    };
  } catch (error) {
    console.error(
      "❌ Error fetching and formatting conversation messages:",
      error
    );
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch conversation messages",
    };
  }
}
