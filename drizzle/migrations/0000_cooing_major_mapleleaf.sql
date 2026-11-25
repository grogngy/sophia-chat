CREATE TYPE "public"."ai_provider" AS ENUM('OpenAI', 'Anthropic', 'Google', 'xAI');--> statement-breakpoint
CREATE TYPE "public"."message_sender" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('success', 'error');--> statement-breakpoint
CREATE TABLE "ai_models" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"provider_name" "ai_provider" NOT NULL,
	"model_name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"has_image_input" boolean DEFAULT false NOT NULL,
	"has_audio_input" boolean DEFAULT false NOT NULL,
	"has_reasoning" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "provider_model_unique" UNIQUE("provider_name","model_name")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text,
	"active_model_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender" "message_sender" NOT NULL,
	"content" text NOT NULL,
	"model_id" uuid,
	"reasoning" text,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"status" "message_status" DEFAULT 'success' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_active_model_id_ai_models_id_fk" FOREIGN KEY ("active_model_id") REFERENCES "public"."ai_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages_attachments_gin_idx" ON "messages" USING gin ("attachments");--> statement-breakpoint
CREATE INDEX "messages_status_idx" ON "messages" USING btree ("status");