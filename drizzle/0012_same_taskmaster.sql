CREATE TABLE "audio_chapters" (
	"id" text PRIMARY KEY NOT NULL,
	"audiobook_id" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"duration" text DEFAULT '—' NOT NULL,
	"src" text NOT NULL,
	"free" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audiobooks" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"author" text NOT NULL,
	"author_slug" text DEFAULT '' NOT NULL,
	"publisher" text DEFAULT 'TalkNest Audio' NOT NULL,
	"publisher_slug" text DEFAULT 'talknestaudio' NOT NULL,
	"narrator" text DEFAULT 'TalkNest Voices' NOT NULL,
	"source" text DEFAULT '' NOT NULL,
	"duration" text DEFAULT '—' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"long_description" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category" text DEFAULT 'uponnash' NOT NULL,
	"subcategory" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"old_price" numeric(10, 2),
	"free" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"cover" jsonb NOT NULL,
	"rating" numeric(2, 1) DEFAULT '4.8' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"pages" integer DEFAULT 0 NOT NULL,
	"language" text DEFAULT 'Bangla' NOT NULL,
	"binding" text DEFAULT 'Audiobook' NOT NULL,
	"published_year" integer DEFAULT 2026 NOT NULL,
	"stock" integer DEFAULT 999 NOT NULL,
	"isbn" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audiobooks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "audio_chapters" ADD CONSTRAINT "audio_chapters_audiobook_id_audiobooks_id_fk" FOREIGN KEY ("audiobook_id") REFERENCES "public"."audiobooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audio_chapters_book_idx" ON "audio_chapters" USING btree ("audiobook_id");--> statement-breakpoint
CREATE INDEX "audiobooks_status_created_idx" ON "audiobooks" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "audiobooks_category_idx" ON "audiobooks" USING btree ("category");