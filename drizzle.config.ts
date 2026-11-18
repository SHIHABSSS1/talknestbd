import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js loads .env / .env.local itself; drizzle-kit does not. Support both
// names so the project works whether the secrets live in .env or .env.local.
config({ path: [".env.local", ".env"] });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "drizzle-kit needs DATABASE_URL_UNPOOLED (direct Neon host). Migrations run through a pooler and hang otherwise.",
  );
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  // CLI progress logging only — off outside local development so CI logs stay quiet.
  verbose: process.env.NODE_ENV !== "production",
});