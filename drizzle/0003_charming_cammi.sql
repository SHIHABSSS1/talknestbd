DROP TABLE IF EXISTS "rateLimit";--> statement-breakpoint
CREATE TABLE "rateLimit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text UNIQUE NOT NULL,
	"count" integer NOT NULL,
	"last_request" bigint NOT NULL
);
