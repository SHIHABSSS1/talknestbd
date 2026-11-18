# TalkNest BD — Data, Cache & Media Architecture

> Status: **proposed decision record** · Written Nov 2026 · Applies to Next.js 16.4.6 / React 19 / Tailwind v4
>
> This document is the reference for moving TalkNest BD from a browser-only demo to a
> database-backed storefront. Read it before adding a new persisted feature, a new upload,
> or a new "cache" anywhere in the app.

---

## 0. TL;DR — the decision

| Area | Decision | Why |
| --- | --- | --- |
| Database | **PostgreSQL 18** (Neon, `ap-southeast-1`) | Relational catalogue + orders, JSONB for editable page blocks, real transactions, good text search |
| ORM | **Drizzle ORM** + `postgres.js` + `drizzle-kit` | SQL-first, tiny runtime, type-safe, no codegen step needed at build |
| Auth | **Better Auth** — self-hosted, Google OAuth + email/password, DB sessions | Owns users, accounts, sessions and roles; works with Drizzle; no third-party lock-in |
| Hosting (DB) | **Neon Postgres** — decided | Managed, branching, Singapore region, works from any app host |
| Hosting (app) | **VPS with a persistent volume** — decided | Local uploads for images, audio **and video** need a writable, durable filesystem |
| Content blocks | One `content_blocks` table with `jsonb` | Replaces ~10 localStorage keys; editors keep their current document shape |
| Cache | `"use cache"` + `cacheLife` + `cacheTag` (already enabled) | `cacheComponents: true` is already on in `next.config.ts` |
| Images | `next/image` + `sharp` derivatives (AVIF/WebP) | Current code uses plain `<img>` and base64 data URLs — neither is cacheable |
| Uploads | **Storage driver**: local disk now, S3/R2-compatible later | You asked for local upload; keep the door open for object storage |
| Cart / wishlist | Stay in `localStorage` | Anonymous, high-churn, no server value until checkout |

**Decision (locked):** **Neon Postgres** + the app running on a **VPS with a persistent
volume**, because images, audio **and video** are uploaded to local disk. Vercel is ruled
out as the app host: its filesystem is read-only except `/tmp`, `/tmp` is per-instance and
ephemeral, and serverless request bodies are capped at roughly 4.5 MB — which no video
upload can satisfy. See [§4](#4-hosting-decision-and-the-local-upload-trap).

---

## 1. What the project looks like today (measured, not guessed)

Scan of `src/` on `main` @ `506f89b`:

| Fact | Evidence |
| --- | --- |
| No backend at all | No `src/app/api`, no route handlers, no server actions, no `process.env` DB config |
| No auth library | `package.json` deps are only `next`, `react`, `react-dom`, `swiper`, `lucide-react` |
| 25 static books | `src/data/books.ts` (33.8 KB) |
| ~25 localStorage stores | See table below |
| All images are plain `<img>` | 40+ matches for `<img`, zero imports from `next/image` |
| Uploads are base64 data URLs | `src/lib/image.ts` → `fileToDataURL`, max 1600×900, ≤ 800 000 chars |
| Nothing is server-rendered from data | Every page hydrates a client provider that reads `localStorage` |
| Caching is *enabled* but *unused* | `cacheComponents: true`, `partialPrefetching: true`, but no `"use cache"` anywhere |
| SEO metadata exists per page | But see [SEO.md](./SEO.md) — canonical is wrong and dynamic pages are missing |

### 1.1 The de-facto schema (localStorage keys)

These map 1:1 onto tables. This is the migration checklist.

| Key | Shape | Target table |
| --- | --- | --- |
| `talknestbd-books-v1` | `Book[]` | `books` + `book_tags` |
| `talknestbd-authors-*` | `Author[]` | `authors` |
| `talknestbd-publishers-*` | `Publisher[]` | `publishers` |
| `talknestbd-categories-*` | `Category[]` | `categories` |
| `talknestbd-audio-content-v1` | section + `AudioBookEntry[]` | `audiobooks`, `audio_chapters`, `content_blocks('audio')` |
| `talknestbd-reviews-v1` | `Review[]` | `reviews` |
| `talknestbd-stories-v1` | `Story[]` | `stories`, `story_likes` |
| `talknestbd-video-quiz-v1` | videos + quizzes | `content_blocks('video-quiz')` |
| `talknestbd-trust-strip-v1` | cards + copy | `content_blocks('trust-strip')` |
| `talknestbd-shelf-<slug>-v1` | heading only | `content_blocks('shelf:<slug>')` |
| `talknestbd-site-settings-v1` | settings document | `content_blocks('site-settings')` |
| `talknestbd-sell-used-books-v1` | page copy | `content_blocks('sell-used-books')` |
| `talknestbd-used-books-v1` | page copy + items | `content_blocks('used-books')`, `used_books` |
| `talknestbd-wholesale-v1` | page copy | `content_blocks('wholesale')` |
| `talknestbd-sell-requests-v1` | `SellRequest[]` | `sell_requests` |
| `talknestbd-wholesale-requests-v1` | `WholesaleRequest[]` | `wholesale_requests` |
| `talknestbd-story-requests-v1` | `StoryRequest[]` | `story_requests` |
| `talknestbd-review-requests-v1` | `ReviewRequest[]` | `review_requests` |
| `talknestbd-orders-v1` | `Order[]` | `orders` + `order_items` |
| `talknestbd-addresses-v1` | `SavedAddress[]` | `addresses` |
| `talknestbd-profile-v1` | `Profile` | `users` |
| `talknestbd-cart-v1` / `-wishlist-v1` | ids | keep local (optional `wishlists` table) |
| `talknest-admin-access-v1` | users/roles/permissions | `users`, `roles`, `role_permissions` |
| `talknest_admin_session` | `"active"` | real session cookie |

> **Do not copy this denormalised shape into Postgres wholesale.** The list above is
> *what to migrate*, not *how to model it*. Books must split tags into a join table so
> shelf queries are indexable.

---

## 2. Why PostgreSQL is the right call here

**Yes — PostgreSQL.** Not because it is the default answer, but because this specific
dataset has these properties:

1. **It is genuinely relational.** A book has an author, a publisher, a category, many
   tags, many chapters, many reviews. Orders have line items, which reference books, which
   reference prices. MongoDB would force you to either duplicate author/publisher data into
   every book or hand-join in application code. Every "show all books by this publisher"
   page is a join.
2. **JSONB is the escape hatch you actually need.** Half the admin panel is *document
   editing* — hero copy, trust strip, shelf headings, site settings, video/quiz content.
   Those should **not** become 40 columns. `jsonb` in Postgres gives you schemaless
   documents **and** the ability to index/query into them later (`data->>'title'`).
   So you get relational integrity where it matters and document flexibility where it
   doesn't. This is the single strongest reason to pick Postgres over MySQL/SQLite.
3. **Orders need transactions.** Creating an order + decrementing stock + recording the
   audio unlock must be atomic. `BEGIN … COMMIT` is table stakes; Firebase and many
   document stores make this awkward.
4. **Search.** `pg_trgm` gives you substring search over Bengali/English titles and
   authors with a GIN index — good enough for a few thousand books. You can add
   Meilisearch later without changing the schema.
5. **Ecosystem.** Drizzle, Better Auth, backups, `pg_dump`, every host supports it.

### Rejected alternatives

| Option | Verdict | Reason |
| --- | --- | --- |
| MySQL / MariaDB | Workable | Weaker JSON path/indexing, no `jsonb`, less pleasant full-text story. No upside over Postgres. |
| MongoDB | No | This is a catalogue + order system. You would re-implement joins and transactions by hand. |
| SQLite (better-sqlite3) | Only for a single-VPS, low-traffic deploy | Simpler ops, but no concurrent writers across processes and no serverless story. Fine as a *local dev* stand-in, not the production target. |
| Firebase / Firestore | No | Vendor lock-in, weak relational queries, no SQL reporting for orders. |
| Supabase-managed Postgres | **Acceptable** | It *is* Postgres; useful if you also want Auth + Storage. Choose it if you want one vendor. |
| PlanetScale (MySQL) | No | Same MySQL reasons, and its serverless driver changes the transaction model. |

### Money and Bengali text — two details that bite

- **Money:** use `numeric(10,2)`, never `float`/`real`/`double`. `৳ 499.00` must round-trip
  exactly. If you prefer integer math, store **paisa** as `integer`. Pick one and never mix.
- **Bengali search:** Postgres' built-in stemmers do not stem Bengali. Use
  `to_tsvector('simple', …)` for tokenisation, and rely on **`pg_trgm`** for substring
  matching (`title ILIKE '%' || $1 || '%'` with a GIN trigram index). Note: trigram
  matching needs ≥ 3 characters; if 2-character Bengali queries matter, add `pg_bigm`
  or move search to Meilisearch/Typesense.
- **Slugs:** keep `text` + `UNIQUE`, store lowercase ASCII slugs. Do not use `citext`
  unless you add the extension deliberately.

---

## 3. Recommended schema

Files: `src/lib/db/schema.ts` (Drizzle), `drizzle.config.ts`, `src/lib/db/index.ts`.
Migrations live in `drizzle/`.

### 3.1 Identity & access

```sql
users (
  id            text primary key,            -- uuid/ulid
  email         text not null unique,
  email_verified boolean not null default false,
  name          text not null,
  phone         text,
  image         text,                        -- media id or URL
  role          text not null default 'customer',  -- customer | admin
  password_hash text,                        -- null for OAuth-only
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

sessions (            -- Better Auth owns this table shape
  id text primary key, user_id text not null references users(id) on delete cascade,
  token text not null unique, expires_at timestamptz not null, ip text, user_agent text
);

accounts (            -- required for Google OAuth: one row per provider link
  id text primary key, user_id text not null references users(id) on delete cascade,
  provider_id text not null,              -- 'google' | 'credential'
  account_id text not null,               -- provider's user id (Google `sub`)
  access_token text, refresh_token text, id_token text,
  access_token_expires_at timestamptz, refresh_token_expires_at timestamptz,
  scope text, password text,              -- password hash for email/password accounts
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id, account_id)
);

verification (        -- email verification / password reset tokens
  id text primary key, identifier text not null, value text not null,
  expires_at timestamptz not null, created_at timestamptz, updated_at timestamptz
);

roles (
  id text primary key, name text not null unique, description text,
  permissions jsonb not null default '[]'::jsonb,   -- e.g. ["*"] or ["/admin","/admin/books"]
  system boolean not null default false
);

user_roles (user_id text references users(id) on delete cascade, role_id text references roles(id) on delete cascade,
  primary key (user_id, role_id));

addresses (
  id text primary key, user_id text not null references users(id) on delete cascade,
  label text not null, name text not null, phone text not null, email text,
  division text not null, district text not null, area text not null, street text not null,
  postcode text, is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index on addresses (user_id);
```

> `permissions` as `jsonb` mirrors the current `AdminRole.permissions: string[]` exactly,
> so `canRoleAccess()` in `src/lib/admin-access.ts` keeps working — it just reads from the
> DB instead of localStorage.

> **Do not hand-write the four Better Auth tables.** Better Auth's core schema is
> `user`, `session`, `account`, `verification` (singular). With the Drizzle adapter you
> either name your tables to match, or map them explicitly:
> `drizzleAdapter(db, { schema: { user: users, session: sessions, account: accounts, verification } })`.
> Generate the baseline with `npx @better-auth/cli generate`, then extend `user` with
> `role`, `phone` and `image`. The `accounts` table is what makes Google login work.

### 3.2 Catalogue

```sql
authors (
  id text primary key, slug text not null unique, name text not null, title text,
  bio text not null default '', long_bio jsonb not null default '[]'::jsonb,
  image_media_id text, location text, quote text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

publishers (
  id text primary key, slug text not null unique, name text not null, tagline text,
  description text not null default '', established text, location text,
  initials text, accent text, logo_media_id text,
  featured boolean not null default false
);

categories (
  id text primary key, slug text not null unique, name text not null, english_name text,
  description text, primary boolean not null default false, accent text,
  parent_id text references categories(id) on delete set null   -- subcategory support
);

books (
  id            text primary key,
  slug          text not null unique,
  title         text not null,
  subtitle      text,
  author_id     text references authors(id) on delete set null,
  publisher_id  text references publishers(id) on delete set null,
  category_id   text references categories(id) on delete set null,

  price         numeric(10,2) not null,
  old_price     numeric(10,2),
  cost_price    numeric(10,2),                         -- for profit reporting later

  stock         integer not null default 0,
  pages         integer not null default 0,
  language      text not null default 'Bangla',
  binding       text not null default 'Paperback',
  published_year integer,

  rating        numeric(2,1) not null default 0,
  review_count  integer not null default 0,

  description   text not null default '',
  long_description jsonb not null default '[]'::jsonb,  -- string[]
  highlights    jsonb not null default '[]'::jsonb,     -- string[]

  cover         jsonb not null,                         -- BookCoverTheme (theme + optional media id)
  status        text not null default 'published',      -- draft | published | archived
  is_audio      boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on books (category_id);
create index on books (author_id);
create index on books (publisher_id);
create index on books (status, created_at desc);
create index books_title_trgm on books using gin (title gin_trgm_ops);
create index books_desc_trgm  on books using gin (description gin_trgm_ops);

-- Shelf membership. Tag values match the existing BookTag union.
book_tags (
  book_id text not null references books(id) on delete cascade,
  tag     text not null,          -- bestseller | new | viral | trending | sunnah | audio | ...
  primary key (book_id, tag)
);
create index on book_tags (tag);

-- Only needed if a book can have several authors. Recommended, but optional now.
book_authors (
  book_id text references books(id) on delete cascade,
  author_id text references authors(id) on delete cascade,
  position integer not null default 0,
  primary key (book_id, author_id)
);
```

> Keeping `book_tags` separate is what makes "Viral Books", "Trending", "Student" and
> "Audio" shelves a single indexed query instead of scanning JSON arrays.

### 3.3 Commerce

```sql
orders (
  id           text primary key,
  order_no     text not null unique,          -- TNB-261118-1234
  user_id      text references users(id) on delete set null,
  status       text not null default 'confirmed',
                -- confirmed | processing | out_for_delivery | delivered | cancelled
  subtotal     numeric(10,2) not null,
  delivery_charge numeric(10,2) not null default 0,
  total        numeric(10,2) not null,
  payment_method text not null,               -- cod | bkash | nagad
  payment_number text,
  delivery_method text not null,              -- standard | express | pickup
  address_snapshot jsonb not null,            -- frozen copy at purchase time
  note         text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index on orders (user_id, created_at desc);
create index on orders (status, created_at desc);

order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  book_id  text references books(id) on delete set null,
  kind     text not null,                     -- book | sunnah | audio
  title_snapshot text not null,               -- never join for historical receipts
  price_snapshot numeric(10,2) not null,
  quantity integer not null check (quantity > 0)
);
create index on order_items (order_id);
```

**Non-negotiable rule:** the client may send `{slug, kind, quantity}`. The server
**re-reads prices from `books`** inside the order transaction. Never persist a price the
browser supplied. `address_snapshot` and `title_snapshot` exist because a receipt must not
change when an admin edits the address or renames a book.

### 3.4 Community, audio, leads

```sql
reviews (
  id text primary key, book_id text references books(id) on delete cascade,
  user_id text references users(id) on delete set null,
  name text not null, location text, rating smallint not null check (rating between 1 and 5),
  body text not null,                           -- `text` is a reserved-ish word; avoid
  verified boolean not null default false,
  status text not null default 'pending',       -- pending | published | rejected
  reply text, reply_at timestamptz,
  created_at timestamptz not null default now()
);
create index on reviews (book_id, status, created_at desc);

stories (
  id text primary key, user_id text references users(id) on delete set null,
  name text not null, title text not null, excerpt text not null, body text,
  type text not null,                           -- voice | text | pdf
  status text not null default 'pending',       -- published | pending | rejected
  audio_media_id text, attachment_media_id text,
  duration text, likes integer not null default 0,
  created_at timestamptz not null default now()
);

story_likes (story_id text references stories(id) on delete cascade,
             user_id text references users(id) on delete cascade,
             primary key (story_id, user_id));

audiobooks (
  id text primary key, book_id text not null references books(id) on delete cascade,
  slug text not null unique, narrator text, duration text, description text,
  is_free boolean not null default false, price numeric(10,2) not null default 0
);

audio_chapters (
  id text primary key, audiobook_id text not null references audiobooks(id) on delete cascade,
  position integer not null, title text not null, duration_seconds integer,
  media_id text, is_free boolean not null default false
);

audio_unlocks (
  user_id text references users(id) on delete cascade,
  audiobook_id text references audiobooks(id) on delete cascade,
  order_id text references orders(id) on delete set null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, audiobook_id)
);

-- Lead capture: every form that currently writes to localStorage.
sell_requests     (id, user_id, name, phone, email, city, book_title, condition, offered_price, status, admin_note, created_at)
wholesale_requests(id, organization, contact, phone, email, city, quantity, message, status, created_at)
story_requests    (id, name, phone, email, type, message, status, created_at)
review_requests   (id, name, email, book_slug, message, status, created_at)
contact_messages  (id, name, email, phone, subject, message, status, created_at)
```

Status columns should be `text` + a `CHECK` constraint (or a Postgres enum if you prefer
strictness). Text + check is easier to evolve than an enum.

### 3.5 Content blocks & media

```sql
content_blocks (
  key        text primary key,      -- 'hero' | 'trust-strip' | 'shelf:viral-books' | 'site-settings' | ...
  data       jsonb not null,
  updated_by text references users(id) on delete set null,
  updated_at timestamptz not null default now()
);

media (
  id          text primary key,
  storage_key text not null unique,        -- 'books/2026/11/<hash>.webp'
  url         text not null,               -- public URL served to the browser
  kind        text not null default 'image', -- image | audio | video | pdf
  mime        text not null,
  bytes       bigint not null,
  width       integer, height integer,
  duration_seconds numeric(10,2),          -- audio / video only
  blur_data_url text,                      -- ~20px base64 for next/image placeholder
  alt         text,
  checksum    text,
  uploaded_by text references users(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index on media (uploaded_by, created_at desc);
```

**Why `content_blocks` instead of tables per editor:** the admin editors are document
editors with a stable top-level shape (`section`, `library`, `pricing`, …). One table with
one row per editor keeps the diff small and the cache tag trivial (`content:<key>`).
When a block needs real queries (e.g. you want to filter hero slides by date), promote it
to its own table then — not before.

**Why a `media` table at all if files are on disk:** metadata is queryable, orphan cleanup
is possible, and switching driver (disk → R2) changes only `storage_key`/`url`, not every
row that references an image. Store `media.id` in `cover`/`image_media_id`, **not** the URL
string.

### 3.6 Auth hosting: self-hosted Better Auth vs Neon Managed Better Auth

Neon now ships **Managed Better Auth** (GA, built on Better Auth 1.7.x). It stores identity
in a `neon_auth` schema in your own database and runs as a managed REST service. It is a
genuine option, not a toy — but it changes who owns the tables.

| | **Self-hosted `better-auth` (chosen)** | Neon Managed Better Auth |
| --- | --- | --- |
| Who owns `user`/`session`/`account` | You do, via Drizzle | Neon does, in `neon_auth` (read/query, don't alter) |
| Env vars | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID/SECRET` | `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` |
| Google redirect URI | `{APP_URL}/api/auth/callback/google` | `{NEON_AUTH_BASE_URL}/callback/google` |
| Roles | your `roles` + `user_roles` + `permissions jsonb` | Admin plugin's `role`, plus your own app tables |
| Custom plugins/hooks | Full | Subset (Admin ✅, Organization partial) |
| Infra | Runs inside Next | Managed service, AWS regions only |
| Cost | Free (your DB) | MAU-based, included in all plans (Free ≤ 60k MAU) |
| Leaving Neon | Stays with your code | Export/rebuild users + sessions |
| Preview branches | Manual | Auth state branches with the DB |

**Decision: self-host.** Reasons specific to this app:

1. `orders`, `addresses`, `reviews`, `audio_unlocks` all reference `users.id`. Owning the
   table keeps those plain foreign keys instead of pointing at a schema Neon controls.
2. The admin panel already has custom roles and `canRoleAccess()` over
   `AdminRole.permissions`. That maps 1:1 onto `roles` + `user_roles`; the Admin plugin's
   single `role` column would need extra app tables anyway.
3. The app is already self-hosted on a VPS — there is no extra infrastructure to avoid by
   going managed.
4. No version skew: managed pins Better Auth 1.7.12; self-hosting pins whichever version
   you install.
5. Managed is AWS-only and incompatible with IP Allow / Private Networking. Not a blocker
   today, but it removes options.

**Choose managed instead if** you want zero auth code, shared Google credentials in dev,
and branch-isolated auth for preview environments — and you are happy to treat `neon_auth`
as read-mostly and keep app profiles in your own table.

> Either way the Next.js wiring is the same shape: an `/api/auth/[...path]` route handler,
> HTTP-only cookies, and `auth.getSession()` on the server. Auth-aware pages are dynamic —
> wrap them in `<Suspense>` so the static shell still ships.

---

## 4. Hosting decision and the local-upload trap

### The constraint

| Host | Writable disk? | Persists across deploys? | Local upload possible? |
| --- | --- | --- | --- |
| Vercel (serverless) | Only `/tmp` | No (ephemeral, per-instance) | **No** |
| Vercel (build) | `public/` is copied at build | Files written at runtime are not served | **No** |
| VPS / Docker (Railway, Render, Hetzner, DigitalOcean) | Yes, with a volume | Yes | **Yes** |

Vercel cannot store files locally, so the two paths below were the only honest options.
**Option B is the chosen path** (see "Recommendation (locked)"); Option A is kept for
context because it is the standard serverless answer.

### Option A — Vercel + Neon + object storage (not chosen)

- Postgres: **Neon** (serverless, branching, free tier, `@neondatabase/serverless` or
  `postgres.js` over TCP).
- Files: **Cloudflare R2** (S3-compatible, zero egress fees — the cost matters in BD),
  or Supabase Storage if you already use Supabase.
- Keep the local driver for `npm run dev` only.

Best when: you want zero server ops and the app stays on Vercel. Cannot satisfy a
local-disk video library.

### Option B — VPS (Singapore) + Docker + Neon + local disk (chosen)

- One `docker compose` stack: `app`, `nginx`, volumes `uploads` (Postgres stays on Neon).
- Nginx serves `/media/*` directly (`X-Accel-Redirect`) — Node never streams bytes.
- Cheapest at scale, true local uploads, lowest latency to Dhaka (~50–70 ms from Singapore).
- You own backups, TLS renewal, OS patching, and monitoring.

Best when: local upload is a hard requirement and you are willing to run a server.

### Recommendation (locked)

**Neon Postgres + app on a VPS (Singapore) with a persistent volume.** Every media type —
image, audio, video — is written to local disk. Vercel is no longer a valid app host under
this decision; keep the S3 driver only as a future escape hatch.

Environment contract: `.env.example` in the repo root (`DATABASE_URL`,
`DATABASE_URL_UNPOOLED`, `STORAGE_DRIVER=local`, `UPLOAD_DIR`, `PUBLIC_MEDIA_URL`).

Build against a **storage interface** so the driver stays swappable in one file:

```
src/lib/storage/index.ts     // put(), delete(), url(), exists(), stat()
src/lib/storage/local.ts     // fs + UPLOAD_DIR + path-traversal guard
src/lib/storage/s3.ts        // R2 / S3 / MinIO via @aws-sdk/client-s3
```

Pick the driver with `STORAGE_DRIVER=local|s3`. Both paths write the **same** `media`
rows. Do not scatter `fs.writeFile` through components.

### Cost sketch (order of magnitude, Nov 2026)

| Item | Free / small | Growth |
| --- | --- | --- |
| Neon Postgres | Free tier is enough for a catalogue + demo orders | ~$19/mo+ |
| VPS (Hetzner CX22 / DO basic) | — | ~$5–12/mo incl. uploads; Postgres stays on Neon |
| Object storage (R2) | Not used under the current decision | — |
| Image optimization | Self-hosted `next/image` = your CPU, no per-transform fee | — |

The chosen stack is **Neon free tier + a small VPS**. Cost is dominated by the VPS and by
video storage growth, so watch disk usage (§8.5).

---

## 5. Data access layer

```
src/lib/db/index.ts        // postgres.js client (singleton, HMR-safe)
src/lib/db/schema.ts       // Drizzle tables + relations
src/lib/db/queries/*.ts    // getBooks, getBookBySlug, getOrdersForUser, ...
src/lib/db/seed.ts         // seeds from src/data/*
src/lib/actions/*.ts       // "use server" mutations
drizzle.config.ts
```

Rules:

1. **Server Components read; Server Actions write.** No `fetch("/api/...")` from the
   client for catalogue data. `src/app/api` should only exist for webhooks and file
   streaming.
2. **Never import the DB client into a Client Component.** Keep it in `src/lib/db` and
   import only from server files; add `import "server-only"` at the top of `db/index.ts`.
3. **Validate every mutation with `zod`.** The current editors accept arbitrary JSON; a
   server action must reject anything outside the expected shape.
4. **Dedupe per request with `React.cache()`**, and *then* cache across requests with
   `"use cache"` (see §6). They solve different problems.
5. **Singleton client** for dev (`globalThis.__db ??= postgres(...)`) so HMR does not leak
   connections. Cap the pool (`max: 10`) on serverless.
6. **Seed from `src/data`** so the demo content survives the migration; keep `src/data`
   as the seed source of truth until the admin panel is the source of truth.

```ts
// src/lib/db/index.ts
import "server-only";
import postgres from "postgres";

const globalForDb = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };
export const sql =
  globalForDb.__sql ??
  postgres(process.env.DATABASE_URL!, {
    max: 10,
    idle_timeout: 20,
    prepare: false,   // Neon's pooler is PgBouncer in transaction mode
    ssl: "require",
  });
if (process.env.NODE_ENV !== "production") globalForDb.__sql = sql;
```

**Verified 2026-11-19 against the live Neon project** (do not re-litigate these):

| Fact | Value |
| --- | --- |
| Server | PostgreSQL **18.7**, `ap-southeast-1` (Singapore) |
| Database / role | `talknestbd` / `talknestbd_owner` |
| Pooled host (`DATABASE_URL`) | connects, ~1.5 s cold |
| Direct host (`DATABASE_URL_UNPOOLED`) | connects, ~0.9 s cold |
| Extensions available | `pg_trgm`, `unaccent`, `citext` |
| `public` schema | empty — ready for the first migration |
| Driver | `postgres@4.1.1`; Neon's `?sslmode=require&channel_binding=require` is accepted as-is |

> `sslmode=require` in postgres.js maps to `ssl: "require"`, which sets
> `rejectUnauthorized: false` — it encrypts but does **not** verify the server certificate.
> For production, prefer `sslmode=verify-full` (Neon chains to a public CA, so this works
> with no extra config). Keep `channel_binding=require`; it defends against a MITM holding
> a different certificate.

---

## 6. Caching strategy (Next.js 16 Cache Components)

`next.config.ts` already has `cacheComponents: true` and `partialPrefetching: true`.
That means `"use cache"`, `cacheLife` and `cacheTag` are available **today** — the app
just isn't using them yet.

### 6.1 The model

```
Request → static shell (prerendered) → cached data (use cache) → streamed dynamic holes
```

- **Cached:** catalogue, book detail, authors, publishers, categories, reviews, content
  blocks, site settings, sitemap data.
- **Dynamic (never cached):** cart, checkout, account, orders, admin panel, search
  results, anything reading `cookies()`/`headers()`.

### 6.2 Data-level cache with tags

```ts
// src/lib/db/queries/books.ts
import { cacheLife, cacheTag } from "next/cache";

export async function getBookBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("books", `book:${slug}`);
  return sql<Book[]>`select * from books where slug = ${slug} and status = 'published' limit 1`;
}

export async function getBooksByTag(tag: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("books", `shelf:${tag}`);
  return sql<Book[]>`
    select b.* from books b
    join book_tags t on t.book_id = b.id
    where t.tag = ${tag} and b.status = 'published'
    order by b.created_at desc`;
}
```

### 6.3 Tag vocabulary (use these exact strings)

| Tag | Invalidated when |
| --- | --- |
| `books` | any book create/update/delete, bulk import |
| `book:<slug>` | that book's edit, price, stock |
| `shelf:<tag>` | tag membership changes |
| `authors` / `author:<slug>` | author edit |
| `publishers` / `publisher:<slug>` | publisher edit |
| `categories` | category tree edit |
| `reviews:<bookSlug>` | review published/replied |
| `content:<key>` | a `content_blocks` row saved |
| `settings` | `site-settings` saved |
| `audio` | audiobook/chapter edit |

### 6.4 Invalidation after an admin save

```ts
"use server";
import { revalidateTag, updateTag } from "next/cache";

// Catalogue: stale-while-revalidate is fine.
revalidateTag("books", "max");
revalidateTag(`book:${slug}`, "max");

// Settings / permissions: must be immediate, or the admin sees stale data.
updateTag("settings");
updateTag("admin-access");
```

- `revalidateTag(tag, profile)` — serves stale content immediately, refreshes in the
  background. Good for catalogue and blogs. (The second argument is required in this
  version; `'max'` gives the longest stale window.)
- `updateTag(tag)` — expires immediately, next request blocks for fresh data. Use for
  settings, roles/permissions, and anything where stale data is a bug.

### 6.5 What *not* to do

- Do **not** put `"use cache"` on a function that reads cookies/session — it will throw or
  cache one user's data for everyone.
- Do **not** cache the whole `app/layout.tsx`; it contains auth-aware header state.
- Do **not** wrap `getOrdersForUser` in a shared tag; tag it per user or leave it dynamic.
- Do **not** add `revalidatePath("/")` on every save — it nukes the whole cache. Use the
  narrowest tag.

### 6.6 Client-side state migration

Right now 20 providers in `src/app/layout.tsx` each read `localStorage` on mount. The
target state:

1. Root layout keeps only `StoreProvider` (cart/wishlist) and auth/session context.
2. Catalogue/content providers are **deleted**; their data arrives as RSC props from a
   server layout/page.
3. Admin editors receive their initial document as a prop and call a server action on save.
4. `localStorage` remains only for: cart, wishlist, and non-sensitive UI preferences
   (theme, recently viewed).

This also fixes the flash-of-empty-content on first paint and removes ~20 nested context
providers from every route's JS.

### 6.7 Static generation

- `generateStaticParams()` for `/books/[slug]`, `/blogs/[slug]`, `/authors/[slug]`,
  `/publishers/[slug]`, `/category/[slug]` — fed from the DB at build time.
- With `cacheComponents`, cached data is included in the prerendered shell. Pages become
  static and revalidate by tag, no `revalidate = 60` guesswork.
- Search stays dynamic: wrap results in `<Suspense>` so the static shell still ships.

---

## 7. Image optimization

The current pipeline writes base64 JPEG data URLs into `localStorage` (≤ 800 KB each).
That cannot be cached, bloats HTML/RSC payloads, and breaks `next/image`. Replace it.

### 7.1 `next.config.ts` — Next 16 specifics

```ts
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Required in Next 16: an explicit allowlist. Default is [75].
    qualities: [60, 75, 90],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "media.talknestbd.com" }, // R2/CDN custom domain
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
    ],
  },
};
```

Notes that are easy to get wrong in 16:

- `images.qualities` is **required** in Next 16; an unlisted `quality` is coerced to the
  nearest allowed value (and the REST endpoint returns 400 for unlisted values).
- `formats` defaults to `['image/webp']`. Add AVIF **first** — order matters.
- `priority` is **deprecated in v16**; use **`preload`** for the single LCP image.

### 7.2 Component rules

```tsx
import Image from "next/image";

// LCP hero — exactly one per page
<Image src={src} alt={alt} fill sizes="100vw" preload placeholder="blur" blurDataURL={blur} />

// Book card in a 2/3/4/6-column grid
<Image
  src={url} alt={`${book.title} — ${book.author}`}
  width={400} height={600}
  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
  placeholder="blur" blurDataURL={blur}
/>
```

- Always set `sizes` when `fill` is used, otherwise Next serves desktop pixels to phones.
- Set `width`/`height` (or a fixed aspect box) to avoid CLS. The existing CSS `BookCover`
  already reserves its ratio — keep that behaviour for uploaded covers.
- `alt` is required. Use `alt=""` only for genuinely decorative images.

### 7.3 Upload pipeline (where the real wins are)

Do the resizing **once, on upload**, not on every request:

| Derivative | Width | Format | Use |
| --- | --- | --- | --- |
| `thumb` | 160 | WebP | admin lists, avatars |
| `sm` | 400 | AVIF + WebP | book cards |
| `md` | 800 | AVIF + WebP | detail hero, blog inline |
| `lg` | 1600 | AVIF + WebP | hero banners |
| `blur` | 20 | WebP | `blurDataURL` |

- Use `sharp` (already the engine behind `next/image`).
- Rename by **content hash**: `books/<yyyy>/<mm>/<sha256-12>.<ext>`. Hashed filenames can
  be served `Cache-Control: public, max-age=31536000, immutable`.
- Store the derivatives' URLs in `media` (one base row + a `derivatives jsonb`, or rows
  with a `variant` column if you want to query them).
- Strip EXIF (sharp does by default when re-encoding). Never trust the client's
  orientation metadata.
- Keep the CSS-generated `BookCover` as the default for demo/uncovered books — it is
  zero bytes, infinitely sharp, and already implemented. Only use a real image when the
  admin uploaded one.

### 7.4 Serving

- Local disk (VPS): Nginx serves `/media/` with `immutable` headers; Next never touches
  the bytes.
- R2: serve through a custom domain (`media.talknestbd.com`) so images are CDN-cached and
  not proxied through the Next server.
- `next/image` still optimizes on demand; with pre-generated AVIF/WebP you can also set
  `unoptimized` for already-hashed derivatives to skip a second transform.

---

## 8. File uploads (local disk)

### 8.1 Layout

```
uploads/                     # NOT public/, NOT committed
  books/2026/11/<hash>.webp
  authors/2026/11/<hash>.webp
  audio/<hash>.mp3
  video/<hash>.mp4
  stories/<hash>.pdf
```

- `.gitignore` must include `/uploads` and `UPLOAD_DIR`. (Already done.)
- `UPLOAD_DIR` env var; default `./uploads` in dev, `/data/uploads` (volume) in prod.
- **Never write into `public/` at runtime** — Next copies `public/` at build time; runtime
  files are not reliably served and vanish on redeploy.

### 8.2 Storage interface

```ts
// src/lib/storage/index.ts
export interface StoredFile { key: string; url: string; bytes: number; mime: string; }
export interface StorageDriver {
  put(key: string, data: Buffer, mime: string): Promise<StoredFile>;
  delete(key: string): Promise<void>;
  url(key: string): string;
}
```

`local.ts` uses `node:fs/promises` + path traversal guards (`path.resolve` must stay
inside `UPLOAD_DIR`). `s3.ts` uses `PutObjectCommand` and returns the CDN URL.

### 8.3 Upload flow

```
client (file picker)
  → POST /api/uploads  (Route Handler; multipart)
     1. auth check (admin or logged-in user)
     2. size + magic-byte check (not just file.type)
     3. sharp: rotate → resize → encode AVIF/WebP → blur
     4. storage.put(hash key)
     5. insert into media
  → 201 { mediaId, url, width, height, blurDataURL }
```

- Prefer a **Route Handler** over a Server Action for binary bodies — easier to stream,
  set limits, and return progress-friendly responses. Server Actions are fine for
  metadata-only saves.
- **Limits:** image 10 MB, audio 25 MB, PDF 15 MB. Reject at the edge before buffering.
- **Magic bytes:** check the first bytes (`FF D8 FF` JPEG, `89 50 4E 47` PNG,
  `52 49 46 46 … 57 45 42 50` WebP). `file.type` is attacker-controlled.
- **Filenames:** generate `<hash>.<ext>`; never use `file.name` on disk. Keep the original
  name only as a display label in the DB if you want.
- **SVG:** reject, or sanitize with DOMPurify on the server and serve with
  `Content-Disposition: attachment` + a restrictive CSP. SVG is executable.
- **Public uploads (stories, avatars, review images):** rate-limit per IP/user, and
  consider ClamAV if the uploads are publicly downloadable.

### 8.4 Serving local files in production

Two acceptable patterns:

1. **Nginx `X-Accel-Redirect`** (best): the route handler authorizes, then returns
   `X-Accel-Redirect: /protected-media/<key>`; Nginx streams the file with correct
   headers. Zero Node memory pressure.
2. **Route handler streaming** (`Readable.toWeb(createReadStream(...))`): simple, fine at
   low volume, but every byte flows through Node.

For public media (book covers, audio, video), let Nginx serve the directory directly —
do not proxy bytes through Next:

```nginx
server {
    client_max_body_size 250m;          # must exceed MAX_VIDEO_MB

    location /media/ {
        alias /data/uploads/;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Content-Type-Options nosniff;
        add_header Accept-Ranges bytes;  # required for audio/video seeking
        try_files $uri =404;
    }
}
```

Only files that need authorization (paid audiobook chapters) should go through
`X-Accel-Redirect` with an `internal;` location.

Either way set: `Cache-Control: public, max-age=31536000, immutable` (hashed names),
`Content-Type` from the DB (not the request), and `X-Content-Type-Options: nosniff`.

### 8.5 Video and large-file uploads

Video changes the upload design. A 200 MB file must never be held in memory.

- **Do not** call `await request.formData()` for video. `formData()` buffers the whole
  multipart body. Fine for a 2 MB cover, fatal for a 200 MB video.
- **Stream** the raw request body straight to a temp file, then atomically rename:

  ```ts
  const tmp = path.join(UPLOAD_DIR, "tmp", `${crypto.randomUUID()}.part`);
  await pipeline(Readable.fromWeb(request.body!), createWriteStream(tmp));
  await fs.rename(tmp, finalPath); // same filesystem → atomic
  ```

- **Chunked / resumable uploads** are the better UX for video. Use `tus`
  (`@tus/server` + `@tus/file-store`) or a small custom chunk endpoint. It survives flaky
  mobile connections and gives real progress.
- **Validate before writing:** check `Content-Length` against `MAX_VIDEO_MB`, then sniff
  magic bytes from the first chunk. Abort and delete the `.part` on failure.
- **Never trust the extension.** Accept an allowlist of container MIME types
  (`video/mp4`, `video/webm`) and re-mux/re-encode with `ffmpeg` if you need a guaranteed
  playable format. For audio: `audio/mpeg`, `audio/mp4`, `audio/ogg`.
- **Generate a poster frame** for video with `ffmpeg` (`-ss 00:00:02 -frames:v 1`) and feed
  it through the same `sharp` pipeline as an image. Store it as the video's `blur_data_url`
  / poster.
- **Duration** goes in `media.duration_seconds`, not in a client-submitted string.
- **Timeouts:** raise the reverse-proxy `proxy_read_timeout` for the upload route; keep the
  default for everything else.
- **Disk space:** monitor it. A video library grows fast. Add a `df` alarm and a retention
  rule for `tmp/*.part` (delete older than 24 h on boot).

### 8.6 Range requests and playback

`<video>` and `<audio>` issue `Range` requests to seek. If you serve media through a custom
route handler you must implement `206 Partial Content` correctly, or seeking breaks.

- Nginx `location /media/` handles Range automatically (`Accept-Ranges: bytes`).
- If streaming from Node, parse `Range`, return `206` with
  `Content-Range: bytes start-end/total`, and set `Accept-Ranges: bytes`.
- Prefer Nginx for public media and reserve Node streaming for paid/authorized audio.

### 8.7 Why this rules out Vercel

For the record, since the decision is local disk:

- `/tmp` is ephemeral and per-instance → files disappear on the next invocation.
- `public/` is build-time only → runtime writes are not served.
- Serverless request bodies are capped at ~4.5 MB → even a 30-second video would fail.

If the app ever returns to Vercel, switch `STORAGE_DRIVER=s3` and point it at R2. Nothing
else changes: same `media` rows, same URLs (`media.talknestbd.com`), same upload route.
This is exactly why the interface exists.

---

## 9. Phased rollout

**Status (Nov 2026):** phase 0 done, phase 1 started — the `content_blocks` table exists on
Neon and the **hero section is fully migrated** (DB → cached read → server action →
`/api/uploads` → `/media`). That one vertical slice is the reference implementation for
every other section.

| Phase | Work | Done when |
| --- | --- | --- |
| **0. Decide** | Locked: **Neon Postgres + VPS with a persistent volume**, all media on local disk. Copy `.env.example` → `.env.local` and fill it. | App boots with `DATABASE_URL` + `STORAGE_DRIVER=local` + `UPLOAD_DIR`; `.env.example` is committed |
| **1. Schema + seed** | Drizzle schema, migrations, seed from `src/data/*` | `drizzle-kit migrate` then `npm run db:seed` reproduces the demo catalogue |
| **2. Read path** | `src/lib/db/queries`, `"use cache"` + tags, server-render catalogue, book/authors/publishers/categories pages | No client provider reads catalogue data; pages prerender; tags invalidate |
| **3. Auth** | *Deferred — planned, not next.* Better Auth (`/api/auth/[...all]`), Google OAuth, email/password for admin, `roles`/`user_roles`, admin gate | Google sign-in returns a real session cookie; admin login works; `canRoleAccess()` reads DB |
| **4. Writes** | Server actions for every admin editor + `revalidateTag` | Editing a book in `/admin/books` updates `/books/<slug>` after revalidate |
| **5. Media** | `/api/uploads` (streamed), sharp derivatives, `ffmpeg` for audio/video, `media` table, `next/image` everywhere | No `<img>` for local uploads; no base64 in DB; video uploads survive a 200 MB file without OOM; LCP is `preload`ed |
| **6. Orders** | Checkout server action, price re-validation, stock decrement in a transaction | Tampering with a client price cannot change the order total |
| **7. Search + polish** | `pg_trgm` search, sitemap from DB, JSON-LD, observability | Search covers uploaded books; see [SEO.md](./SEO.md) |

### Acceptance checks for each phase

- `npx tsc --noEmit --pretty false`
- `npm run build`
- Playwright: open the changed route, check console for hydration errors
- `njordscan_scan .` / `semgrep` on new server code
- Confirm no secret landed in the client bundle (`DATABASE_URL` must never appear in
  `.next/static`)

### 9.1 Auth debt ledger - every `TODO(auth)` and how it closes

Phase 3 is deferred, so phases 1-2 and parts of 4-6 will ship code that assumes "someone is
already allowed to do this". That is acceptable **only** while it is tracked. The convention
is defined in `AGENTS.md` ("Accepted-risk workarounds must be tracked with `TODO(auth)`"):
every bypass carries a `// TODO(auth): ...` comment naming the replacement.

| # | Location | Bypass in place | Closes with |
| --- | --- | --- | --- |
| 1 | `src/app/api/uploads/route.ts` | **In place now.** Fail-closed: development writes are allowed, every production request gets `403` until the auth check exists. Marked `TODO(auth)`. | `requireAdmin()` at the top of the handler, before reading the body |
| 2 | `src/lib/actions/hero.ts` | **In place now.** `saveHeroContent` / `resetHeroContent` are callable by anyone. Marked `TODO(auth)`. | `requireAdmin()` before validation |
| 2 | `orders.user_id`, `reviews.user_id`, `audio_unlocks.user_id` | Nullable `text`, no FK | `references users(id)`, populated from `session.user.id` |
| 3 | `src/app/(storefront)/account/**` | Client-side demo state | `requireUser()` in the account layout, then delete the demo flag |
| 4 | `src/app/(admin)/admin/(panel)/layout.tsx` | Client `AdminAccessGate` only | Server `requireAdmin()`; keep the gate for UI only |
| 5 | `src/lib/admin-access.ts` | Role + permissions from localStorage | Read `roles` / `user_roles` / `role_permissions` from the DB |

Gate before any public deploy:

```powershell
grep -rn "TODO(auth)" src    # must return nothing
```

If it returns anything, the site is not shippable - regardless of how complete the features
look. Closing these is part of the auth task itself, not a follow-up ticket.

---

## 10. Risks and open questions

| Risk | Mitigation |
| --- | --- |
| Price tampering at checkout | Re-read prices server-side; ignore client totals |
| Admin password is demo-only (`demo1234` in localStorage) | Move to Better Auth before any real admin use; force password reset |
| Base64 uploads blow the 5 MB localStorage quota | Move to `media` + disk/R2; cap image size server-side |
| Bengali search quality | Start with `pg_trgm`; evaluate Meilisearch if 2-char queries matter |
| Vercel-style serverless host creeping back in | The decision is locked to a VPS with a persistent volume; Vercel cannot store 200 MB videos (§8.5) |
| Video storage filling the disk | Disk alarm + retention for `tmp/*.part`; decide a transcode/bitrate policy |
| Duplicate content: static book + uploaded book with same slug | `mergeBooks()` already dedupes by slug; in DB make `slug` unique and upsert |
| RSC payload bloating from large JSONB documents | Keep `long_description`/`highlights` as arrays and paginate reviews; never send `site-settings` to the client unless needed |

**Open questions to settle with the product owner**

1. ~~Vercel or VPS?~~ **Resolved:** Neon Postgres + VPS with persistent disk (§4).
2. Do customers get real accounts at launch, or is admin-only auth enough for v1?
3. Is multi-author support needed now, or is one `author_id` per book sufficient?
4. Do audiobooks need paid unlocks at launch, or can audio stay free/demo?
5. Video hosting: is 200 MB per file enough, and do you need transcoding to a web-safe
   bitrate (H.264/AAC) or will the admin always upload a ready MP4?