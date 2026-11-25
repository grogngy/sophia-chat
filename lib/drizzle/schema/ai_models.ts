import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// Enum for AI providers
export const aiProviderEnum = pgEnum("ai_provider", [
  "OpenAI",
  "Anthropic",
  "Google",
  "xAI",
]);

// AI Models table
export const aiModels = pgTable(
  "ai_models",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
    provider_name: aiProviderEnum("provider_name").notNull(),
    model_name: text("model_name").notNull(),
    is_active: boolean("is_active").default(true).notNull(),

    // Capabilities
    has_image_input: boolean("has_image_input").default(false).notNull(),
    has_audio_input: boolean("has_audio_input").default(false).notNull(),
    has_reasoning: boolean("has_reasoning").default(false).notNull(),

    // Metadata
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("provider_model_unique").on(table.provider_name, table.model_name),
  ]
);

// TypeScript types
export type AiModel = InferSelectModel<typeof aiModels>;
export type NewAiModel = InferInsertModel<typeof aiModels>;
