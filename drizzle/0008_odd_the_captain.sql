CREATE TABLE "wholesale_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"organization" text NOT NULL,
	"contact" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"city" text NOT NULL,
	"quantity" text NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'New' NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wholesale_requests" ADD CONSTRAINT "wholesale_requests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wholesale_requests_status_created_idx" ON "wholesale_requests" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "wholesale_requests_user_id_idx" ON "wholesale_requests" USING btree ("user_id");