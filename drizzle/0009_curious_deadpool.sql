CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"source" text DEFAULT 'user' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"rating" integer NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"book_slug" text NOT NULL,
	"book_title" text NOT NULL,
	"book_kind" text DEFAULT 'book' NOT NULL,
	"name" text NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"avatar_color" text DEFAULT '#1877F2' NOT NULL,
	"verified" boolean DEFAULT true NOT NULL,
	"reply" text,
	"reply_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reviews_status_created_idx" ON "reviews" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "reviews_book_slug_status_idx" ON "reviews" USING btree ("book_slug","status");--> statement-breakpoint
CREATE INDEX "reviews_user_id_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reviews_pinned_idx" ON "reviews" USING btree ("pinned");