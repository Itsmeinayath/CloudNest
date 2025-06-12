CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"size" integer DEFAULT 0 NOT NULL,
	"type" text NOT NULL,
	"mime_type" text,
	"file_url" text,
	"thumbnail_url" text,
	"user_id" text NOT NULL,
	"parent_id" uuid,
	"is_folder" boolean DEFAULT false NOT NULL,
	"is_starred" boolean DEFAULT false NOT NULL,
	"is_trash" boolean DEFAULT false NOT NULL,
	"is_shared" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"trashed_at" timestamp
);
