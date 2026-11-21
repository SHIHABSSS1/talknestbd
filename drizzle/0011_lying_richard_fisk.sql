CREATE TABLE "wishlist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_key" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "wishlist_items_owner_slug_idx" ON "wishlist_items" USING btree ("owner_key","slug");--> statement-breakpoint
CREATE INDEX "wishlist_items_owner_idx" ON "wishlist_items" USING btree ("owner_key");