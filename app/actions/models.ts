"use server";

import { db } from "@/lib/drizzle/db";
import { aiModels, type AiModel } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { requireAdminAccess } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type ServerActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Deactivate a model by setting is_active to false.
 * This preserves all conversation history while preventing the model from being used in new conversations.
 * ADMIN ONLY - Should only be callable by admin users.
 */
export async function deactivateModel(
  modelId: string
): Promise<ServerActionResponse> {
  try {
    // Verify user has admin role (handles authentication internally)
    await requireAdminAccess();

    // Deactivate the model by setting is_active to false
    const result = await db
      .update(aiModels)
      .set({
        is_active: false,
        updated_at: new Date(),
      })
      .where(eq(aiModels.id, modelId))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Model not found" };
    }

    console.log(
      `Successfully soft deleted model ${modelId}: ${result[0].provider_name} ${result[0].model_name}`
    );
    revalidatePath("/admin/models");
    return { success: true };
  } catch (error) {
    console.error("Error deactivating model:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to deactivate model",
    };
  }
}

/**
 * Reactivates a previously soft-deleted model by setting is_active to true.
 * ADMIN ONLY - Should only be callable by admin users.
 */
export async function reactivateModel(
  modelId: string
): Promise<ServerActionResponse> {
  try {
    // Verify user has admin role (handles authentication internally)
    await requireAdminAccess();

    // Reactivate the model by setting is_active to true
    const result = await db
      .update(aiModels)
      .set({
        is_active: true,
        updated_at: new Date(),
      })
      .where(eq(aiModels.id, modelId))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Model not found" };
    }

    console.log(
      `Successfully reactivated model ${modelId}: ${result[0].provider_name} ${result[0].model_name}`
    );
    revalidatePath("/admin/models");
    return { success: true };
  } catch (error) {
    console.error("Error reactivating model:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reactivate model",
    };
  }
}

/**
 * Gets model statistics for admin dashboard.
 * ADMIN ONLY - Should only be callable by admin users.
 */
export async function getModelStatsForAdmin(): Promise<
  ServerActionResponse<{
    totalModels: number;
    activeModels: number;
    inactiveModels: number;
  }>
> {
  try {
    // Verify user has admin role (handles authentication internally)
    await requireAdminAccess();

    const models = await db
      .select({
        is_active: aiModels.is_active,
      })
      .from(aiModels);

    const stats = {
      totalModels: models.length,
      activeModels: models.filter((m) => m.is_active).length,
      inactiveModels: models.filter((m) => !m.is_active).length,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching model stats for admin:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch model statistics",
    };
  }
}

/**
 * Gets all models (active and inactive) for admin management.
 * ADMIN ONLY - Should only be callable by admin users.
 */
export async function getAllModelsForAdmin(): Promise<
  ServerActionResponse<{ models: AiModel[] }>
> {
  try {
    // Verify user has admin role (handles authentication internally)
    await requireAdminAccess();

    const models = await db
      .select()
      .from(aiModels)
      .orderBy(aiModels.provider_name, aiModels.model_name);

    return { success: true, data: { models } };
  } catch (error) {
    console.error("Error fetching models for admin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch models",
    };
  }
}

/**
 * Creates a new AI model.
 * ADMIN ONLY - Should only be callable by admin users.
 */
export async function createModel(modelData: {
  provider_name: "OpenAI" | "Anthropic" | "Google" | "xAI";
  model_name: string;
  has_image_input: boolean;
  has_audio_input: boolean;
  has_reasoning: boolean;
}): Promise<ServerActionResponse> {
  try {
    // Verify user has admin role (handles authentication internally)
    await requireAdminAccess();

    const result = await db
      .insert(aiModels)
      .values({
        provider_name: modelData.provider_name,
        model_name: modelData.model_name,
        has_image_input: modelData.has_image_input,
        has_audio_input: modelData.has_audio_input,
        has_reasoning: modelData.has_reasoning,
        is_active: true, // New models are active by default
      })
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Failed to create model" };
    }

    console.log(
      `Successfully created model: ${result[0].provider_name} ${result[0].model_name}`
    );
    revalidatePath("/admin/models");
    return { success: true };
  } catch (error) {
    console.error("Error creating model:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create model",
    };
  }
}

/**
 * Updates an existing AI model.
 * ADMIN ONLY - Should only be callable by admin users.
 */
export async function updateModel(
  modelId: string,
  updateData: {
    provider_name: "OpenAI" | "Anthropic" | "Google" | "xAI";
    model_name: string;
    has_image_input: boolean;
    has_audio_input: boolean;
    has_reasoning: boolean;
  }
): Promise<ServerActionResponse> {
  try {
    // Verify user has admin role (handles authentication internally)
    await requireAdminAccess();

    const result = await db
      .update(aiModels)
      .set({
        provider_name: updateData.provider_name,
        model_name: updateData.model_name,
        has_image_input: updateData.has_image_input,
        has_audio_input: updateData.has_audio_input,
        has_reasoning: updateData.has_reasoning,
        updated_at: new Date(),
      })
      .where(eq(aiModels.id, modelId))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Model not found" };
    }

    console.log(
      `Successfully updated model ${modelId}: ${result[0].provider_name} ${result[0].model_name}`
    );
    revalidatePath("/admin/models");
    return { success: true };
  } catch (error) {
    console.error("Error updating model:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update model",
    };
  }
}
