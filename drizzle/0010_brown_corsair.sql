CREATE TABLE "cart_items" (
	"user_id" text NOT NULL,
	"slug" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"meta" text,
	"quantity" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_items_user_id_slug_kind_pk" PRIMARY KEY("user_id","slug","kind")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "guest_token" text;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_items_user_id_idx" ON "cart_items" USING btree ("user_id");