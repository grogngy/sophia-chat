-- Down migration for initial schema
-- This migration safely rolls back the initial database schema

-- Drop indexes first (reverse order)
DROP INDEX IF EXISTS "messages_status_idx";
DROP INDEX IF EXISTS "messages_attachments_gin_idx";
DROP INDEX IF EXISTS "conversation_id_idx";
DROP INDEX IF EXISTS "role_idx";

-- Drop foreign key constraints
ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "messages_conversation_id_conversations_id_fk";
ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "conversations_active_model_id_ai_models_id_fk";
ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "conversations_user_id_users_id_fk";

-- Drop tables (reverse order due to foreign keys)
DROP TABLE IF EXISTS "messages";
DROP TABLE IF EXISTS "conversations";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "ai_models";

-- Drop custom types (reverse order)
DROP TYPE IF EXISTS "message_status";
DROP TYPE IF EXISTS "message_sender";
DROP TYPE IF EXISTS "ai_provider";
