<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## TalkNest BD project guide

### About

TalkNest BD is a Bengali-first demo bookstore and reader community built with Next.js App Router, React 19 and Tailwind CSS v4. There is no backend: cart, wishlist, orders, addresses, profile and audio unlocks live in browser `localStorage`.

### Commands

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npx tsc --noEmit --pretty false` — type-check (run this before deploying)

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
