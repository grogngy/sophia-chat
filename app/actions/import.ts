"use server";

import { db } from "@/lib/drizzle/db";
import { conversations, messages } from "@/lib/drizzle/schema";
import { requireUserId } from "@/lib/auth";
import { 
  parseExportedJSON, 
  validateConversationData
} from "@/lib/conversation-export";
import { revalidatePath } from "next/cache";
import { eq, and, inArray } from "drizzle-orm";

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors: string[];
  message?: string;
}

/**
 * Import conversations from exported JSON data
 */
export async function importConversations(
  jsonData: string
): Promise<ImportResult> {
  try {
    const userId = await requireUserId();
    
    // Parse the JSON data
    const exportData = parseExportedJSON(jsonData);
    if (!exportData) {
      return {
        success: false,
        importedCount: 0,
        errors: ["Formato de archivo inválido. Asegúrate de que sea un archivo de exportación de Sophia."],
      };
    }

    // Validate app name
    if (exportData.app_name !== "Sophia by Identia Lab") {
      return {
        success: false,
        importedCount: 0,
        errors: ["Este archivo no es una exportación válida de Sophia by Identia Lab."],
      };
    }

    const errors: string[] = [];
    let importedCount = 0;

    // Process each conversation
    for (const conversationData of exportData.conversations) {
      try {
        // Validate conversation data
        if (!validateConversationData(conversationData)) {
          errors.push(`Conversación "${conversationData.title}" tiene datos inválidos y fue omitida.`);
          continue;
        }

        // Check if conversation already exists
        const existingConversation = await db
          .select()
          .from(conversations)
          .where(eq(conversations.id, conversationData.id))
          .limit(1);

        if (existingConversation.length > 0) {
          errors.push(`Conversación "${conversationData.title}" ya existe y fue omitida.`);
          continue;
        }

        // Create conversation
        await db.insert(conversations).values({
          id: conversationData.id,
          user_id: userId,
          title: conversationData.title,
          created_at: new Date(conversationData.created_at),
          updated_at: new Date(conversationData.updated_at),
          active_model_id: null, // We'll set this to null for imported conversations
        });

        // Create messages
        for (const messageData of conversationData.messages) {
          await db.insert(messages).values({
            id: messageData.id,
            conversation_id: conversationData.id,
            sender: messageData.sender,
            content: messageData.content,
            created_at: new Date(messageData.created_at),
            model_id: null, // We'll set this to null for imported messages
          });
        }

        importedCount++;
      } catch (error) {
        console.error(`Error importing conversation ${conversationData.title}:`, error);
        errors.push(`Error importando conversación "${conversationData.title}": ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    // Revalidate the history page
    revalidatePath("/history");

    return {
      success: importedCount > 0,
      importedCount,
      errors,
      message: importedCount > 0 
        ? `Se importaron ${importedCount} conversaciones exitosamente.`
        : "No se pudieron importar conversaciones.",
    };

  } catch (error) {
    console.error("Error importing conversations:", error);
    return {
      success: false,
      importedCount: 0,
      errors: [`Error del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`],
    };
  }
}

/**
 * Get conversation data for export
 */
export async function getConversationsForExport(
  conversationIds: string[]
): Promise<{
  success: boolean;
  conversations?: Array<{
    id: string;
    title: string | null;
    created_at: Date;
    updated_at: Date;
    active_model_id: string | null;
    messages: Array<{
      id: string;
      sender: "user" | "assistant";
      content: string;
      created_at: Date;
      model_id: string | null;
      model_name: string | null;
    }>;
  }>;
  error?: string;
}> {
  try {
    const userId = await requireUserId();

    // Get conversations with messages
    const conversationsData = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        created_at: conversations.created_at,
        updated_at: conversations.updated_at,
        active_model_id: conversations.active_model_id,
        message_id: messages.id,
        message_sender: messages.sender,
        message_content: messages.content,
        message_created_at: messages.created_at,
        message_model_id: messages.model_id,
      })
      .from(conversations)
      .leftJoin(messages, eq(conversations.id, messages.conversation_id))
      .where(
        and(
          eq(conversations.user_id, userId),
          inArray(conversations.id, conversationIds)
        )
      )
      .orderBy(conversations.created_at, messages.created_at);

    // Group messages by conversation
    const groupedConversations = new Map();
    
    for (const row of conversationsData) {
      if (!groupedConversations.has(row.id)) {
        groupedConversations.set(row.id, {
          id: row.id,
          title: row.title,
          created_at: row.created_at,
          updated_at: row.updated_at,
          active_model_id: row.active_model_id,
          messages: [],
        });
      }

      if (row.message_id) {
        groupedConversations.get(row.id).messages.push({
          id: row.message_id,
          sender: row.message_sender,
          content: row.message_content,
          created_at: row.message_created_at,
          model_id: row.message_model_id,
          model_name: null, // We'll set this to null for now
        });
      }
    }

    return {
      success: true,
      conversations: Array.from(groupedConversations.values()),
    };

  } catch (error) {
    console.error("Error getting conversations for export:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
