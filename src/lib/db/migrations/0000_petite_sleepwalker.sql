CREATE TABLE "activity_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"url" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"log_type" varchar(20) DEFAULT 'global' NOT NULL,
	"repository_id" uuid,
	"title" text,
	"summary" text NOT NULL,
	"bullets" jsonb NOT NULL,
	"raw_data" jsonb NOT NULL,
	"metadata" jsonb,
	"processed" boolean DEFAULT false NOT NULL,
	"analysis_depth" varchar(20) DEFAULT 'standard',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analysis_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repository_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"rule_type" varchar(50) NOT NULL,
	"rule_content" text NOT NULL,
	"apply_to" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "global_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "global_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repo_id" varchar(255),
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"full_name" text NOT NULL,
	"description" text,
	"language" text,
	"path" text,
	"scope" varchar(20) DEFAULT 'github',
	"default_branch" text DEFAULT 'main',
	"is_private" boolean DEFAULT false,
	"analysis_enabled" boolean DEFAULT true NOT NULL,
	"analysis_depth" text DEFAULT 'deep',
	"stars" integer DEFAULT 0,
	"topics" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb,
	"last_activity" timestamp,
	"commit_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "repositories_repo_id_unique" UNIQUE("repo_id"),
	CONSTRAINT "repositories_owner_name_unique" UNIQUE("owner","name")
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"default_analysis_depth" text DEFAULT 'deep',
	"focus_areas" jsonb DEFAULT '["architecture","performance","security","code-quality","technical-debt"]'::jsonb,
	"daily_digest_enabled" boolean DEFAULT true,
	"weekly_report_enabled" boolean DEFAULT true,
	"global_logs_enabled" boolean DEFAULT true,
	"include_private_repos" boolean DEFAULT true,
	"include_forked_repos" boolean DEFAULT false,
	"min_commit_size" integer DEFAULT 1,
	"ai_model" text DEFAULT 'anthropic/claude-sonnet-4',
	"ai_temperature" integer DEFAULT 7,
	"ai_verbosity" text DEFAULT 'detailed',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "activity_details" ADD CONSTRAINT "activity_details_log_id_activity_logs_id_fk" FOREIGN KEY ("log_id") REFERENCES "public"."activity_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_rules" ADD CONSTRAINT "analysis_rules_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;