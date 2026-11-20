CREATE TABLE "sell_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"address" text NOT NULL,
	"book_title" text NOT NULL,
	"purchase_price" numeric(10, 2) NOT NULL,
	"condition" text NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'New' NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sell_requests" ADD CONSTRAINT "sell_requests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sell_requests_status_created_idx" ON "sell_requests" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "sell_requests_user_id_idx" ON "sell_requests" USING btree ("user_id");