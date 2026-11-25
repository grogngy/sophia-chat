// Import types are no longer needed as we define our own types

export interface ExportableConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  model_name: string;
  messages: Array<{
    id: string;
    sender: "user" | "assistant";
    content: string;
    created_at: string;
    model_name?: string;
  }>;
}

// Type for conversations with messages and model info
export type ConversationWithMessages = {
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
};

export interface ConversationExport {
  version: string;
  exported_at: string;
  app_name: "Sophia by Identia Lab";
  conversations: ExportableConversation[];
}

/**
 * Export conversations to JSON format
 */
export function exportConversationsToJSON(
  conversations: Array<ConversationWithMessages>
): string {
  const exportData: ConversationExport = {
    version: "1.0",
    exported_at: new Date().toISOString(),
    app_name: "Sophia by Identia Lab",
    conversations: conversations.map(conv => ({
      id: conv.id,
      title: conv.title || "Conversación sin título",
      created_at: conv.created_at.toISOString(),
      updated_at: conv.updated_at.toISOString(),
      model_name: "Sophia", // Default model name since we don't have model_name in conversation
      messages: conv.messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        created_at: msg.created_at.toISOString(),
        model_name: msg.model_name || undefined,
      })),
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export conversations to Markdown format
 */
export function exportConversationsToMarkdown(
  conversations: Array<ConversationWithMessages>
): string {
  let markdown = `# Exportación de Conversaciones - Sophia by Identia Lab\n\n`;
  markdown += `**Fecha de exportación:** ${new Date().toLocaleDateString('es-CO')}\n`;
  markdown += `**Total de conversaciones:** ${conversations.length}\n\n`;
  markdown += `---\n\n`;

  conversations.forEach((conv, index) => {
    markdown += `## ${index + 1}. ${conv.title || "Conversación sin título"}\n\n`;
    markdown += `**ID:** ${conv.id}\n`;
    markdown += `**Modelo:** Sophia\n`;
    markdown += `**Creada:** ${new Date(conv.created_at).toLocaleString('es-CO')}\n`;
    markdown += `**Actualizada:** ${new Date(conv.updated_at).toLocaleString('es-CO')}\n\n`;

    conv.messages.forEach((msg, msgIndex) => {
      const role = msg.sender === "user" ? "Usuario" : "Sophia";
      const modelInfo = msg.model_name ? ` (${msg.model_name})` : "";
      markdown += `### ${msgIndex + 1}. ${role}${modelInfo}\n\n`;
      markdown += `${msg.content}\n\n`;
    });

    markdown += `---\n\n`;
  });

  return markdown;
}

/**
 * Parse exported JSON data
 */
export function parseExportedJSON(data: string): ConversationExport | null {
  try {
    const parsed = JSON.parse(data);
    
    // Validate the structure
    if (!parsed.version || !parsed.exported_at || !parsed.conversations) {
      return null;
    }

    return parsed as ConversationExport;
  } catch (error) {
    console.error("Error parsing exported JSON:", error);
    return null;
  }
}

/**
 * Validate conversation data before import
 */
export function validateConversationData(conversation: ExportableConversation): boolean {
  return !!(
    conversation.id &&
    conversation.title &&
    conversation.created_at &&
    conversation.updated_at &&
    conversation.model_name &&
    Array.isArray(conversation.messages) &&
    conversation.messages.every(msg => 
      msg.id && 
      msg.sender && 
      msg.content && 
      msg.created_at &&
      (msg.sender === "user" || msg.sender === "assistant")
    )
  );
}

/**
 * Generate download filename for export
 */
export function generateExportFilename(format: "json" | "md"): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = format === "json" ? "json" : "md";
  return `sophia-conversations-${timestamp}.${extension}`;
}

/**
 * Download data as file
 */
export function downloadAsFile(data: string, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
