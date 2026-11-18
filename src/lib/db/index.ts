import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill in your Neon pooled connection string.",
  );
}

const globalForDb = globalThis as unknown as {
  __sql?: ReturnType<typeof postgres>;
};

/**
 * postgres.js keeps its own pool, so in development (HMR) it must be cached on
 * `globalThis` or every reload leaks connections until Neon refuses new ones.
 */
const sql =
  globalForDb.__sql ??
  postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    // Neon's "-pooler" host is PgBouncer in transaction mode: named prepared
    // statements are connection-scoped and break when a statement is sent on a
    // different backend.
    prepare: false,
    ssl: "require",
    onnotice: () => {},
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__sql = sql;
}

export const db = drizzle(sql, { schema });
export { sql };