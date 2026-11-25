import { db } from "@/lib/drizzle/db";
import {
  conversations,
  aiModels,
  type Conversation,
  type AiModel,
} from "@/lib/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { ConversationNotFoundError } from "@/components/error/ConversationNotFoundError";
import {
  fetchAndFormatConversationMessages,
  type ExtendedMessage,
} from "@/lib/chat-utils";
import { requireUserId } from "@/lib/auth";
import { ChatStateProvider } from "@/contexts/ChatStateContext";
import { ChatContainer } from "@/components/chat/ChatContainer";

interface ChatPageProps {
  params: Promise<{
    conversationId?: string[];
  }>;
  searchParams: Promise<{
    new?: string;
  }>;
}

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
  const userId = await requireUserId();

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const conversationId = resolvedParams.conversationId?.[0];
  const isNewConversation = resolvedSearchParams.new === 'true';

  let conversation: Conversation | null = null;
  let messages: ExtendedMessage[] = [];

  // Fetch all models (both active and inactive) for the chat interface
  // Inactive models will be shown as disabled in the dropdown
  const availableModels: AiModel[] = await db.select().from(aiModels);

  if (conversationId) {
    console.log("🔍 Loading specific conversation:", conversationId);

    // Get conversation and verify ownership - handle database errors separately
    let conversationResult;
    try {
      conversationResult = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.id, conversationId),
            eq(conversations.user_id, userId)
          )
        )
        .limit(1);
    } catch (error) {
      console.error("Database error fetching conversation:", error);
      return <ConversationNotFoundError />;
    }

    conversation = conversationResult[0] ?? null;

    // If conversation not found, 404 (outside try-catch to avoid error capture)
    if (!conversation) {
      return <ConversationNotFoundError />;
    }

    // Now safely fetch messages since we know conversation exists
    try {
      const messagesResult = await fetchAndFormatConversationMessages(
        conversationId,
        userId
      );

      if (messagesResult.success && messagesResult.messages) {
        messages = messagesResult.messages;
      } else {
        console.error(
          "❌ Failed to fetch conversation messages:",
          messagesResult.error
        );
        messages = [];
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      messages = [];
    }
  } else if (!isNewConversation) {
    // No specific conversation ID and not requesting new - load the most recent conversation for continuity
    console.log("🔍 Loading most recent conversation for user:", userId);
    
    try {
      const recentConversationResult = await db
        .select()
        .from(conversations)
        .where(eq(conversations.user_id, userId))
        .orderBy(desc(conversations.updated_at))
        .limit(1);

      if (recentConversationResult.length > 0) {
        conversation = recentConversationResult[0];
        console.log("✅ Found recent conversation:", conversation.id);
        
        // Load messages for the recent conversation
        const messagesResult = await fetchAndFormatConversationMessages(
          conversation.id,
          userId
        );

        if (messagesResult.success && messagesResult.messages) {
          messages = messagesResult.messages;
        }
      } else {
        // No conversations exist yet - conversation stays null (will create new on first message)
        console.log("ℹ️ No existing conversations - will create new on first message");
      }
    } catch (error) {
      console.error("Error fetching recent conversation:", error);
      // conversation stays null - will create new on first message
    }
  } else {
    // User requested a new conversation - conversation stays null (will create new on first message)
    console.log("✨ Starting new conversation as requested");
  }

  return (
    <ChatStateProvider
      availableModels={availableModels}
      conversation={conversation}
      initialMessages={messages}
      preferredModelId={conversation?.active_model_id}
    >
      <div className="h-full w-full flex flex-col">
        <ChatContainer />
      </div>
    </ChatStateProvider>
  );
}
