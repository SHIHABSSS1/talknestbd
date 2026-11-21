CREATE TABLE "stories" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"type" text DEFAULT 'text' NOT NULL,
	"category" text DEFAULT 'Community' NOT NULL,
	"cover_url" text,
	"avatar_color" text DEFAULT '#1877F2' NOT NULL,
	"duration" text,
	"audio_key" text,
	"attachment_key" text,
	"attachment_name" text,
	"likes" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "story_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "story_likes" (
	"story_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_likes_story_id_user_id_pk" PRIMARY KEY("story_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_likes" ADD CONSTRAINT "story_likes_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_likes" ADD CONSTRAINT "story_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stories_status_created_idx" ON "stories" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "stories_user_id_idx" ON "stories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stories_category_idx" ON "stories" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stories_type_idx" ON "stories" USING btree ("type");