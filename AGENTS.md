<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project docs, tooling and SEO - read these first

Three project documents are authoritative for work beyond a one-line fix:

- `docs/ARCHITECTURE.md` - the database decision (Neon PostgreSQL 18 + Drizzle), full schema,
  Next.js 16 cache strategy (`"use cache"` / `cacheLife` / `cacheTag`), image pipeline,
  local file-upload design, and the phased migration from `localStorage`.
- `docs/SEO.md` - canonical / sitemap / robots rules, per-route metadata, JSON-LD,
  Core Web Vitals budget, AI-crawler policy, and the known SEO bugs.
- `docs/AGENT-TOOLING.md` - every installed skill and MCP server, with exact tool paths
  and when to use each.

### Auth is a later phase

Authentication is **not** implemented yet - the login form is still a client-side demo.
When it is built it will be self-hosted Better Auth with Google login; the decision and
rationale are in `docs/ARCHITECTURE.md` §3.6. Do not add `@neon/auth` / `NEON_AUTH_*`.
Do not build auth until the data-layer phases that precede it are done.

### Accepted-risk workarounds must be tracked with `TODO(auth)`

We are intentionally building APIs **before** auth exists. Anyone who takes a shortcut
around authentication must leave a grep-able marker so it cannot be forgotten:

```ts
// TODO(auth): dev-only guard - replace with requireAdmin() when Better Auth lands
```

Rules:

1. Every temporary auth bypass, dev-only token, hardcoded admin cookie, or nullable
   `user_id` gets a `TODO(auth)` comment with the reason and the replacement.
2. Every `TODO(auth)` must be gone **before any public deploy**. Non-empty means the site
   is not shippable, no matter how finished the features look.

   ```powershell
   Get-ChildItem src -Recurse -Include *.ts,*.tsx | Select-String 'TODO\(auth\)'
   ```

   (git-bash / CI: `grep -rn "TODO(auth)" src`.)

3. When Better Auth is implemented, closing every `TODO(auth)` is part of that task, not a
   follow-up. The full ledger, with the replacement for each entry, is
   `docs/ARCHITECTURE.md` §9.1.

#### Known deferred debt (reads as of Nov 2026)

| Item | Current state | Must become |
| --- | --- | --- |
| Media upload endpoint | Blocked in dev by a local-only guard; never public | `requireAdmin()` + per-kind MIME/size validation |
| `orders.user_id`, `reviews.user_id`, `audio_unlocks.user_id` | Nullable text, no FK | `references users(id)` with real values |
| `/account/**`, order history | Client-side demo only | Server session via `getSession()` |
| Admin panel writes | Client localStorage gate | Server role check in the admin layout |

On `AGENTS.md` / docs edits: `next dev` rewrites the block at the top of this file. Keep it,
and keep this section intact.

### Tooling is installed — use it, do not guess

- **Next.js APIs:** call the `next-devtools` MCP tool `nextjs_docs`, or read
  `node_modules/next/dist/docs/`. This is Next 16.4.6; training data is unreliable.
- **Library APIs:** use `context7` (`resolve-library-id` → `query-docs`).
- **UI verification:** use `playwright` to open the changed route and read
  `browser_console_messages` before declaring the work done.
- **Skills to load by task:**
  - `nextjs-seo` — metadata, sitemap, robots, canonical, structured data, OG images.
  - `nextjs-ship-ready` — any pre-deploy / production-readiness pass.
  - `vercel-react-best-practices` — RSC boundaries, providers, bundle, data fetching.
  - `security-best-practices` — auth, uploads, server actions, input handling.
  - `ui-ux-pro-max` / `frontend-design` / `ui-styling` — visual or component design work.
  - `web-design-guidelines` — UI/accessibility review.
- **After editing code that touches input, auth, uploads, secrets, config or deps:** run a
  secrets pass (gitleaks) plus a SAST pass (`semgrep`, `trivy` or `njordscan`). Report
  findings with severity, `file:line`, why it matters and the fix. Never paste secret
  values into the transcript.

### About

TalkNest BD is a Bengali-first demo bookstore and reader community built with Next.js App Router, React 19 and Tailwind CSS v4. Today there is no backend: cart, wishlist, orders, addresses, profile and audio unlocks live in browser `localStorage`. A PostgreSQL-backed architecture is designed and documented in `docs/ARCHITECTURE.md`; until it is implemented, do not assume a server, session, or database exists.

### Commands

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npx tsc --noEmit --pretty false` (alias `npm run typecheck`) — type-check before deploying
- `npm run db:generate` — generate a SQL migration from `src/lib/db/schema.ts`
- `npm run db:migrate` — apply migrations to Neon (uses `DATABASE_URL_UNPOOLED`)
- `npm run db:seed` — seed `content_blocks` from `src/data` (safe to re-run)
- `npm run db:studio` — Drizzle Studio

### Database (Neon Postgres + Drizzle) — first slice is live

- `src/lib/db/index.ts` — postgres.js singleton, `prepare: false` (Neon pooler), `ssl: "require"`. Server-only.
- `src/lib/db/schema.ts` — `content_blocks(key, data jsonb, updated_at)`. One row per editable
  page document; zod validates the shape in `src/lib/*-schema.ts`, not in the database.
- `src/lib/db/queries/*.ts` — cached reads (`"use cache"` + `cacheLife` + `cacheTag`).
- `src/lib/actions/*.ts` — `"use server"` writes; call `updateTag(tag)` so the editor sees
  its own save immediately (never the deprecated single-arg `revalidateTag`).
- **Migrated so far:** the homepage hero. Row `content_blocks.key = 'hero'`, read by
  `src/app/(storefront)/page.tsx`, written from `/admin/sections/hero`. Everything else in
  `src/lib/*-content.ts` is still localStorage — migrate it the same way, one section at a
  time, using the hero as the reference implementation.
- **Uploads:** `POST /api/uploads` (base64 JSON, development only — production is
  fail-closed with a `TODO(auth)`) writes to `UPLOAD_DIR`; `GET /media/*` serves it.
  Never write into `public/`.
- **Next 16 trap:** `export const runtime` in a route file is rejected when
  `cacheComponents: true` (build error). Omit it — route handlers are already Node.

### Architecture

- `src/app` — routes. Dynamic pages await `params` / `searchParams` (Next 16 async APIs).
- `src/components` — small feature components grouped by domain (`books`, `cart`, `checkout`, `account`, `audio`, `video`, `services`, `stories`, `reviews`, `quiz`, `contact`, `layout`, `ui`).
- `src/data` — static demo content (books, authors, publishers, reviews, community, blog, legal).
- `src/lib` — shared logic: `store.tsx` (cart/wishlist), `orders.ts` (orders/addresses/profile), `audio.ts` (audio unlocks), `navigation.ts`, `types.ts`, `utils.ts`.
- `src/app/globals.css` — Tailwind v4 theme tokens, textures, animations and print styles.

### Conventions

- UI copy is Bengali-first; keep new user-facing text in Bengali.
- Use the existing palette/tokens (`forest-*`, `cream-*`, `gold-*`, `clay-*`) and the small UI primitives in `src/components/ui`.
- Prefer server components for static pages; add `"use client"` only for interaction/localStorage/browser APIs.
- Book covers are CSS-generated via `BookCover` (an optional uploaded `cover.imageSrc` is supported for admin-managed books); otherwise do not add external cover images.
- External demo media: Unsplash for editorial images, SoundHelix MP3s for audio, YouTube embeds for video.

### Unified book system (required design)

- There must be ONE book detail page at `/books/[slug]` used by EVERY book — static demo books, admin-uploaded books, and shelf books (e.g. Viral Books) alike. Never build a separate detail page or detail layout for a shelf.
- The admin book upload form must capture **all information the detail page displays** (title, subtitle, author, publisher, category, subcategory, price/old price, stock, pages, language, binding, published year, rating, description, long description, highlights, tags/audio info, cover theme or uploaded cover image). The slug is generated from the title.
- Locally uploaded books are stored in `localStorage` and merged with the static `src/data/books.ts` catalogue through one shared lookup (e.g. a `BookContentProvider` / `useAllBooks()` helper). Every book-facing surface (detail page, Viral Books shelf, category shelves/sliders, catalog, search) must resolve books through that shared lookup so an uploaded book appears everywhere.
- Shelf sections (Viral Books) are tag-based views into this unified catalogue: adding a book to a shelf uses the same full upload form as Admin → Books, the shelf tag (e.g. `viral`) is auto-selected and locked, and every book links to `/books/<slug>`.
- Keep demo disclaimers: uploads are browser-local only, nothing reaches a server.
- Keep demo disclaimers in checkout, receipts and forms — no real payments or server storage.
- Preserve this file and the Next.js agent-rules block above when editing.
