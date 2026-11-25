CREATE TABLE "usage_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "usage_user_date_idx" ON "usage_tracking" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "usage_date_idx" ON "usage_tracking" USING btree ("date");