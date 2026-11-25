"use server";

import { db } from "@/lib/drizzle/db";
import { messages, conversations } from "@/lib/drizzle/schema";
import { getCurrentUserId } from "@/lib/auth";
import { eq, and, gte, sql } from "drizzle-orm";

export type UsageResult = 
  | { success: true; data: { messagesUsed: number; limit: number; remaining: number } }
  | { success: false; error: string };

/**
 * Get user's message count for today (simple approach - no new tables)
 */
export async function getCurrentUserUsage(): Promise<UsageResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    // Get start of today in Colombia timezone (UTC-5)
    const now = new Date();
    const colombiaOffset = -5 * 60; // Colombia is UTC-5
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const colombiaTime = new Date(utcTime + (colombiaOffset * 60000));
    
    // Start of today in Colombia time
    const startOfToday = new Date(colombiaTime);
    startOfToday.setHours(0, 0, 0, 0);
    
    // Convert back to UTC for database query
    const startOfTodayUTC = new Date(startOfToday.getTime() - (colombiaOffset * 60000));

    // Count user messages (not assistant messages) from today
    const result = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`
      })
      .from(messages)
      .innerJoin(conversations, eq(messages.conversation_id, conversations.id))
      .where(
        and(
          eq(conversations.user_id, userId),
          eq(messages.sender, 'user'),
          gte(messages.created_at, startOfTodayUTC)
        )
      );

    const messagesUsed = result[0]?.count || 0;
    const limit = 50;
    const remaining = Math.max(0, limit - messagesUsed);

    return {
      success: true,
      data: { messagesUsed, limit, remaining }
    };
  } catch (error) {
    console.error('Failed to get user usage:', error);
    return { 
      success: false, 
      error: "Failed to fetch usage data" 
    };
  }
}

/**
 * Check if user has reached daily limit (simple check)
 */
export async function hasReachedDailyLimit(): Promise<boolean> {
  try {
    const result = await getCurrentUserUsage();
    if (!result.success) return false;
    
    return result.data.remaining <= 0;
  } catch {
    return false; // Don't block on errors
  }
}
