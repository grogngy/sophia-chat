import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { aiModels } from "@/lib/drizzle/schema";
import { NewAiModel } from "@/lib/drizzle/schema/ai_models";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env file");
}

const db = drizzle(postgres(process.env.DATABASE_URL, { max: 1 }));

const data: NewAiModel[] = [
  // OpenAI Models - Premium Tier (BYOK Required)
  {
    provider_name: "OpenAI",
    model_name: "o3-pro",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: true, // o3 series supports reasoning tokens
  },
  {
    provider_name: "OpenAI",
    model_name: "o3",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: true, // o3 series supports reasoning tokens
  },
  // OpenAI Models - Standard Tier (BYOK Required)
  {
    provider_name: "OpenAI",
    model_name: "gpt-5",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: true, // GPT-5 series supports reasoning tokens
  },
  {
    provider_name: "OpenAI",
    model_name: "gpt-5-mini",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: true, // GPT-5 series supports reasoning tokens
  },
  {
    provider_name: "OpenAI",
    model_name: "gpt-oss-120b",
    has_image_input: false,
    has_audio_input: false,
    has_reasoning: true, // Regular MoE model, no reasoning tokens
  },
  {
    provider_name: "OpenAI",
    model_name: "gpt-4o-mini",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: false,
  },

  // Anthropic Claude Models - All Premium
  {
    provider_name: "Anthropic",
    model_name: "claude-opus-4.1",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: true, // Claude 4.x series supports reasoning tokens
  },
  {
    provider_name: "Anthropic",
    model_name: "claude-sonnet-4",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: true, // Claude 4.x series supports reasoning tokens
  },
  {
    provider_name: "Anthropic",
    model_name: "claude-3.7-sonnet:thinking",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: true, // Explicit thinking variant supports reasoning tokens
  },

  // Google Gemini Models - Premium Tier
  {
    provider_name: "Google",
    model_name: "gemini-2.5-pro",
    has_image_input: true,
    has_audio_input: true,
    has_reasoning: true,
  },
  // Google Gemini Models - Standard Tier
  {
    provider_name: "Google",
    model_name: "gemini-2.5-flash",
    has_image_input: true,
    has_audio_input: true,
    has_reasoning: true,
  },
  {
    provider_name: "Google",
    model_name: "gemini-2.5-flash-lite",
    has_image_input: true,
    has_audio_input: true,
    has_reasoning: true,
  },

  // xAI Grok Models - All Premium
  {
    provider_name: "xAI",
    model_name: "grok-4",
    has_image_input: true,
    has_audio_input: false,
    has_reasoning: true, // Regular Grok model, no reasoning tokens
  },
  {
    provider_name: "xAI",
    model_name: "grok-3-mini",
    has_image_input: false,
    has_audio_input: false,
    has_reasoning: true,
  },
];

async function main(): Promise<void> {
  console.log("🌱 Seeding database...");

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Insert each model individually to handle unique constraints gracefully
  for (const model of data) {
    try {
      await db.insert(aiModels).values(model);
      console.log(`✅ Added: ${model.provider_name}/${model.model_name}`);
      successCount++;
    } catch (error: unknown) {
      // Check if it's a unique constraint error (model already exists)
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? (error as { code: string }).code
          : undefined;

      if (
        errorCode === "23505" ||
        errorMessage.includes("duplicate key") ||
        errorMessage.includes("unique constraint")
      ) {
        console.log(
          `⏭️  Skipped: ${model.provider_name}/${model.model_name} (already exists)`
        );
        skippedCount++;
      } else {
        console.error(
          `❌ Error adding ${model.provider_name}/${model.model_name}:`,
          errorMessage
        );
        errorCount++;
      }
    }
  }

  console.log("\n📊 Seeding Summary:");
  console.log(`✅ Successfully added: ${successCount} models`);
  console.log(`⏭️  Skipped (already exist): ${skippedCount} models`);
  console.log(`❌ Errors: ${errorCount} models`);

  if (errorCount > 0) {
    console.warn("⚠️  Some models failed to insert. Check errors above.");
  }

  console.log("🎉 Database seeding completed!");
  process.exit(0);
}

main();
