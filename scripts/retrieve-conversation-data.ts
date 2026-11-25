#!/usr/bin/env tsx

/**
 * Script to retrieve Sophia's conversation data from Supabase
 * Supports filtering by user, date range, AI model, and more
 */

import { db } from "@/lib/drizzle/db";
import { conversations, messages, users, aiModels } from "@/lib/drizzle/schema";
import { eq, and, gte, lte, desc, asc, like } from "drizzle-orm";
import { writeFileSync } from "fs";

// Types for the retrieved data
interface ConversationData {
  conversation: {
    id: string;
    title: string | null;
    created_at: Date;
    updated_at: Date;
    user_email: string;
    user_name: string | null;
    ai_model: string | null;
    ai_provider: string | null;
  };
  messages: Array<{
    id: string;
    sender: 'user' | 'assistant';
    content: string;
    created_at: Date;
    ai_model_used: string | null;
    reasoning: string | null;
    attachments: unknown[];
    status: 'success' | 'error';
  }>;
  stats: {
    total_messages: number;
    user_messages: number;
    assistant_messages: number;
    has_attachments: boolean;
    conversation_duration_hours: number;
  };
}

interface RetrievalOptions {
  // User filtering
  userEmail?: string;
  userId?: string;
  
  // Date filtering
  startDate?: Date;
  endDate?: Date;
  
  // AI Model filtering
  aiModel?: string;
  aiProvider?: string;
  
  // Content filtering
  contentKeywords?: string[];
  
  // Limits and sorting
  limit?: number;
  orderBy?: 'newest' | 'oldest' | 'most_messages';
  
  // Output options
  includeContent?: boolean;
  includeReasoning?: boolean;
  includeAttachments?: boolean;
  
  // Export format
  exportFormat?: 'json' | 'csv' | 'console';
  exportPath?: string;
}

/**
 * Main function to retrieve conversation data
 */
export async function retrieveConversationData(
  options: RetrievalOptions = {}
): Promise<ConversationData[]> {
  try {
    console.log("🔍 Retrieving Sophia conversation data...");
    console.log("📊 Filters:", JSON.stringify(options, null, 2));

    // Build the query with joins
    let query = db
      .select({
        // Conversation fields
        conversation_id: conversations.id,
        conversation_title: conversations.title,
        conversation_created_at: conversations.created_at,
        conversation_updated_at: conversations.updated_at,
        
        // User fields
        user_id: users.id,
        user_email: users.email,
        user_name: users.full_name,
        
        // AI Model fields
        active_model_name: aiModels.model_name,
        active_model_provider: aiModels.provider_name,
        
        // Message fields
        message_id: messages.id,
        message_sender: messages.sender,
        message_content: messages.content,
        message_created_at: messages.created_at,
        message_model_id: messages.model_id,
        message_reasoning: messages.reasoning,
        message_attachments: messages.attachments,
        message_status: messages.status,
      })
      .from(conversations)
      .leftJoin(users, eq(conversations.user_id, users.id))
      .leftJoin(aiModels, eq(conversations.active_model_id, aiModels.id))
      .leftJoin(messages, eq(conversations.id, messages.conversation_id));

    // Apply filters
    const conditions = [];

    if (options.userEmail) {
      conditions.push(eq(users.email, options.userEmail));
    }

    if (options.userId) {
      conditions.push(eq(conversations.user_id, options.userId));
    }

    if (options.startDate) {
      conditions.push(gte(conversations.created_at, options.startDate));
    }

    if (options.endDate) {
      conditions.push(lte(conversations.created_at, options.endDate));
    }

    if (options.aiModel) {
      conditions.push(eq(aiModels.model_name, options.aiModel));
    }

    if (options.aiProvider) {
      conditions.push(eq(aiModels.provider_name, options.aiProvider));
    }

    if (options.contentKeywords && options.contentKeywords.length > 0) {
      const contentConditions = options.contentKeywords.map(keyword =>
        like(messages.content, `%${keyword}%`)
      );
      // At least one keyword must match
      conditions.push(contentConditions[0]); // Simplified for example
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply ordering
    switch (options.orderBy) {
      case 'oldest':
        query = query.orderBy(asc(conversations.created_at));
        break;
      case 'newest':
      default:
        query = query.orderBy(desc(conversations.created_at));
        break;
    }

    // Execute query
    const rawResults = await query;
    
    console.log(`📋 Found ${rawResults.length} message records`);

    // Group results by conversation
    const conversationMap = new Map<string, ConversationData>();

    for (const row of rawResults) {
      if (!conversationMap.has(row.conversation_id)) {
        conversationMap.set(row.conversation_id, {
          conversation: {
            id: row.conversation_id,
            title: row.conversation_title,
            created_at: row.conversation_created_at,
            updated_at: row.conversation_updated_at,
            user_email: row.user_email || 'Unknown',
            user_name: row.user_name,
            ai_model: row.active_model_name,
            ai_provider: row.active_model_provider,
          },
          messages: [],
          stats: {
            total_messages: 0,
            user_messages: 0,
            assistant_messages: 0,
            has_attachments: false,
            conversation_duration_hours: 0,
          },
        });
      }

      const conversationData = conversationMap.get(row.conversation_id)!;

      // Add message if it exists
      if (row.message_id) {
        const hasAttachments = row.message_attachments && 
          Array.isArray(row.message_attachments) && 
          row.message_attachments.length > 0;

        conversationData.messages.push({
          id: row.message_id,
          sender: row.message_sender,
          content: options.includeContent !== false ? row.message_content : '[Content filtered]',
          created_at: row.message_created_at,
          ai_model_used: row.message_model_id,
          reasoning: options.includeReasoning !== false ? row.message_reasoning : null,
          attachments: options.includeAttachments !== false ? row.message_attachments || [] : [],
          status: row.message_status,
        });

        // Update stats
        conversationData.stats.total_messages++;
        if (row.message_sender === 'user') {
          conversationData.stats.user_messages++;
        } else {
          conversationData.stats.assistant_messages++;
        }
        
        if (hasAttachments) {
          conversationData.stats.has_attachments = true;
        }
      }
    }

    // Calculate conversation durations and apply limits
    const finalResults = Array.from(conversationMap.values())
      .map(conv => {
        if (conv.messages.length > 0) {
          const firstMessage = conv.messages[conv.messages.length - 1];
          const lastMessage = conv.messages[0];
          const durationMs = lastMessage.created_at.getTime() - firstMessage.created_at.getTime();
          conv.stats.conversation_duration_hours = durationMs / (1000 * 60 * 60);
        }
        
        // Sort messages chronologically
        conv.messages.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
        
        return conv;
      })
      .slice(0, options.limit || 1000); // Default limit

    console.log(`✅ Processed ${finalResults.length} conversations`);

    // Export results
    if (options.exportFormat && options.exportPath) {
      await exportResults(finalResults, options.exportFormat, options.exportPath);
    }

    return finalResults;

  } catch (error) {
    console.error("❌ Error retrieving conversation data:", error);
    throw error;
  }
}

/**
 * Export results to different formats
 */
async function exportResults(
  data: ConversationData[],
  format: 'json' | 'csv' | 'console',
  path?: string
): Promise<void> {
  switch (format) {
    case 'json':
      if (path) {
        writeFileSync(path, JSON.stringify(data, null, 2));
        console.log(`📄 Exported to ${path}`);
      }
      break;
      
    case 'csv':
      const csvData = data.map(conv => ({
        conversation_id: conv.conversation.id,
        title: conv.conversation.title || 'Untitled',
        user_email: conv.conversation.user_email,
        user_name: conv.conversation.user_name || 'Unknown',
        created_at: conv.conversation.created_at.toISOString(),
        ai_model: conv.conversation.ai_model || 'Unknown',
        total_messages: conv.stats.total_messages,
        user_messages: conv.stats.user_messages,
        assistant_messages: conv.stats.assistant_messages,
        has_attachments: conv.stats.has_attachments,
        duration_hours: conv.stats.conversation_duration_hours.toFixed(2),
      }));
      
      if (path) {
        const csv = [
          Object.keys(csvData[0]).join(','),
          ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');
        writeFileSync(path, csv);
        console.log(`📊 CSV exported to ${path}`);
      }
      break;
      
    case 'console':
      console.log("\n📋 CONVERSATION SUMMARY:");
      console.log("=" .repeat(50));
      
      data.forEach((conv, index) => {
        console.log(`\n${index + 1}. ${conv.conversation.title || 'Untitled'}`);
        console.log(`   User: ${conv.conversation.user_email}`);
        console.log(`   Date: ${conv.conversation.created_at.toLocaleDateString()}`);
        console.log(`   Messages: ${conv.stats.total_messages} (${conv.stats.user_messages} user, ${conv.stats.assistant_messages} assistant)`);
        console.log(`   Model: ${conv.conversation.ai_model || 'Unknown'}`);
        console.log(`   Duration: ${conv.stats.conversation_duration_hours.toFixed(1)} hours`);
        console.log(`   Attachments: ${conv.stats.has_attachments ? 'Yes' : 'No'}`);
      });
      break;
  }
}

// Example usage functions
export async function getConversationsByUser(userEmail: string): Promise<ConversationData[]> {
  return retrieveConversationData({
    userEmail,
    orderBy: 'newest',
    exportFormat: 'console'
  });
}

export async function getRecentConversations(days: number = 7): Promise<ConversationData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return retrieveConversationData({
    startDate,
    orderBy: 'newest',
    limit: 50,
    exportFormat: 'console'
  });
}

export async function getConversationsWithAttachments(): Promise<ConversationData[]> {
  // This would need a more complex query, but shows the concept
  return retrieveConversationData({
    includeAttachments: true,
    orderBy: 'newest',
    exportFormat: 'console'
  });
}

// Run examples if script is executed directly
if (require.main === module) {
  console.log("🚀 Running conversation data retrieval examples...");
  
  // Example 1: Get all conversations from last 7 days
  getRecentConversations(7)
    .then(() => console.log("✅ Recent conversations retrieved"))
    .catch(console.error);
    
  // Example 2: Get conversations by specific user
  // getConversationsByUser("user@example.com")
  //   .then(() => console.log("✅ User conversations retrieved"))
  //   .catch(console.error);
}
