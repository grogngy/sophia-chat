import { db } from "@/lib/drizzle/db";
import { conversations, aiModels } from "@/lib/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";

export type ConversationWithModel = {
  id: string;
  title: string | null;
  created_at: Date;
  updated_at: Date;
  model_name?: string | null;
  provider_name?: string | null;
  message_count?: number;
  model_is_active?: boolean;
  active_model_id?: string | null;
};

export type GroupedConversations = {
  today: ConversationWithModel[];
  yesterday: ConversationWithModel[];
  thisWeek: ConversationWithModel[];
  older: ConversationWithModel[];
};

export async function getConversationsGrouped(): Promise<{
  success: boolean;
  conversations?: GroupedConversations;
  error?: string;
}> {
  try {
    const userId = await requireUserId();

    // Get all conversations
    const conversationsData = await db
      .select()
      .from(conversations)
      .where(eq(conversations.user_id, userId))
      .orderBy(desc(conversations.updated_at));

    // Get all AI models in a single query for efficient lookup
    const allModels = await db.select().from(aiModels);

    // Create lookup map for efficient model matching
    const modelLookup = new Map(allModels.map((model) => [model.id, model]));

    // Transform data with actual model lookup and status checking
    const transformedConversations: ConversationWithModel[] =
      conversationsData.map((conv) => {
        const model = conv.active_model_id
          ? modelLookup.get(conv.active_model_id)
          : null;

        // Get model information (clean, without status suffixes)
        let modelName = "Unknown";
        let providerName = "Unknown";

        if (model) {
          modelName = model.model_name;
          providerName = model.provider_name;
        }

        return {
          id: conv.id,
          title: conv.title,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          model_name: modelName,
          provider_name: providerName,
          message_count: 0, // Will implement later
          model_is_active: model?.is_active ?? false,
          active_model_id: conv.active_model_id,
        };
      });

    // Group by time periods
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const grouped: GroupedConversations = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    transformedConversations.forEach((conv) => {
      const updatedDate = new Date(conv.updated_at);

      if (updatedDate >= today) {
        grouped.today.push(conv);
      } else if (updatedDate >= yesterday) {
        grouped.yesterday.push(conv);
      } else if (updatedDate >= thisWeekStart) {
        grouped.thisWeek.push(conv);
      } else {
        grouped.older.push(conv);
      }
    });

    return {
      success: true,
      conversations: grouped,
    };
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch conversations",
    };
  }
}
