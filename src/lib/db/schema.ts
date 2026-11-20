import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Editable page content — one row per block, keyed by a stable string.
 *
 * Why JSONB instead of one table per section: the admin panel edits ~20
 * section documents (hero, trust strip, category cards, shelf headings, site
 * settings...). Each has a different shape and changes shape as the UI evolves.
 * A single `key` + `data` table keeps that flexible without a migration per
 * field, while the relational catalogue/orders stay properly normalised.
 *
 * Validation lives in `src/lib/*-schema.ts` (zod), never in the database: the
 * DB stores the document, the server action decides if it is legal.
 */
export const contentBlocks = pgTable("content_blocks", {
  /** Stable block id, e.g. "hero", "trust-strip", "site-settings". */
  key: text("key").primaryKey(),
  /** The block document. Shape is enforced server-side before writing. */
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type NewContentBlock = typeof contentBlocks.$inferInsert;


/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Identity & access (Better Auth core schema, owned by this project)
 * ─────────────────────────────────────────────────────────────────────────────
 * These four tables are mapped explicitly in src/lib/auth.ts:
 *   drizzleAdapter(db, { provider: "pg", schema: {
 *     user: users, session: sessions, account: accounts, verification: verifications
 *   }})
 * Better Auth generates the ids and writes every column itself. Do not rename
 * the TS keys (emailVerified, userId, ...) — the adapter looks them up by name.
 * `role` is our one custom user field, declared as server-owned in auth.ts.
 */
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  /** customer | admin — see src/lib/auth-guards.ts. */
  role: text("role").notNull().default("customer"),
  phone: text("phone"),
  city: text("city"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** "credential" for email/password, "google" for OAuth. */
    providerId: text("provider_id").notNull(),
    accountId: text("account_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    /** scrypt hash for credential accounts; null for OAuth-only accounts. */
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    uniqueIndex("account_provider_account_idx").on(table.providerId, table.accountId),
  ],
);

export const verifications = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/**
 * Better Auth rate-limit counters (storage: "database"). Shared across server
 * instances so an attacker cannot reset the counter by triggering a restart.
 * The table name and column names are fixed by Better Auth's database adapter.
 */
export const rateLimits = pgTable("rateLimit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

/**
 * Admin roles and page permissions.
 *
 * `permissions` mirrors the old browser-local `AdminRole.permissions` exactly:
 * a list of admin hrefs, with `*` meaning full access. The built-in Super Admin
 * role is `system: true` and cannot be edited or deleted. A user gets one role
 * through `user_roles`; `users.role` still gates the panel as a whole.
 */
export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull().default(""),
  permissions: jsonb("permissions").$type<string[]>().notNull().default([]),
  system: boolean("system").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userRoles = pgTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
    index("user_roles_role_id_idx").on(table.roleId),
  ],
);

/**
 * Account data. Every write goes through an API route that checks the Better
 * Auth session and scopes rows to session.user.id. Prices are numeric(10,2),
 * never float; snapshots freeze the address and item titles at purchase time.
 */
export const addresses = pgTable(
  "addresses",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    division: text("division").notNull(),
    district: text("district").notNull(),
    area: text("area").notNull(),
    street: text("street").notNull(),
    postcode: text("postcode"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("addresses_user_id_idx").on(table.userId)],
);

export const orders = pgTable(
  "orders",
  {
    /** Human-facing order number, e.g. TNB-261119-1234. */
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    status: text("status").notNull().default("confirmed"),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    deliveryCharge: numeric("delivery_charge", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: text("payment_method").notNull(),
    paymentNumber: text("payment_number"),
    deliveryMethod: text("delivery_method").notNull(),
    addressSnapshot: jsonb("address_snapshot").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("orders_user_id_created_idx").on(table.userId, table.createdAt)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    bookSlug: text("book_slug"),
    kind: text("kind").notNull(),
    titleSnapshot: text("title_snapshot").notNull(),
    meta: text("meta"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [index("order_items_order_id_idx").on(table.orderId)],
);

export const audioUnlocks = pgTable(
  "audio_unlocks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.slug] })],
);

/**
 * Point-in-time backups of the editable content blocks.
 *
 * The demo defaults are seeded as a `demo` snapshot on first run so the
 * browser-only data can always be recovered after a migration. Admins can
 * create their own snapshots from /admin/settings (Data tab) and restore any
 * of them. Snapshots are admin-only: no `"use cache"` query reads this table.
 */
export const dataSnapshots = pgTable(
  "data_snapshots",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    /** `demo` (seeded, immutable) or `manual` (created by an admin). */
    kind: text("kind").notNull().default("manual"),
    /** Map of content_blocks key → document, frozen at snapshot time. */
    data: jsonb("data").notNull(),
    note: text("note"),
    createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("data_snapshots_kind_created_idx").on(table.kind, table.createdAt)],
);

export type DataSnapshot = typeof dataSnapshots.$inferSelect;

/**
 * Sell requests raised from the public calculator on /sell-used-books.
 *
 * Prices are numeric(10,2), never float. The submitter is optional so anonymous
 * demo visitors can use the calculator; when a Better Auth session exists the
 * server records its user id — the client never chooses it.
 */
export const sellRequests = pgTable(
  "sell_requests",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    address: text("address").notNull(),
    bookTitle: text("book_title").notNull(),
    purchasePrice: numeric("purchase_price", { precision: 10, scale: 2 }).notNull(),
    condition: text("condition").notNull(),
    rate: numeric("rate", { precision: 5, scale: 2 }).notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    status: text("status").notNull().default("New"),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("sell_requests_status_created_idx").on(table.status, table.createdAt),
    index("sell_requests_user_id_idx").on(table.userId),
  ],
);

export type SellRequestRow = typeof sellRequests.$inferSelect;

/** Wholesale quote requests from the public /wholesale form. */
export const wholesaleRequests = pgTable(
  "wholesale_requests",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    organization: text("organization").notNull(),
    contact: text("contact").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    city: text("city").notNull(),
    quantity: text("quantity").notNull(),
    message: text("message").notNull().default(""),
    status: text("status").notNull().default("New"),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("wholesale_requests_status_created_idx").on(table.status, table.createdAt),
    index("wholesale_requests_user_id_idx").on(table.userId),
  ],
);

export type WholesaleRequestRow = typeof wholesaleRequests.$inferSelect;