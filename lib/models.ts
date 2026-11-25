import { db } from "@/lib/drizzle/db";
import { aiModels, type AiModel } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Get a specific model by ID (regardless of active status)
 * @param id - Model ID to fetch
 * @returns Promise<{success: boolean, data?: AiModel | null, error?: string}> - Structured response with model or null
 */
export const getModelById = async (id: string): Promise<{
  success: boolean;
  data?: AiModel | null;
  error?: string;
}> => {
  try {
    const result = await db
      .select()
      .from(aiModels)
      .where(eq(aiModels.id, id))
      .limit(1);

    return {
      success: true,
      data: result[0] || null,
    };
  } catch (error) {
    console.error("❌ Error fetching model by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch model",
    };
  }
};
