# TalkNest BD — SEO Rules

> Companion to [ARCHITECTURE.md](./ARCHITECTURE.md). Read before adding or changing a route,
> a metadata block, a sitemap entry, or a page that should rank.
>
> Scope: technical SEO, metadata, structured data, Core Web Vitals and AI/answer-engine
> discoverability (GEO) for `src/app`.

---

## 0. Current state (scanned Nov 2026)

| Area | Status | Evidence |
| --- | --- | --- |
| Root metadata | Present | `src/app/layout.tsx` — title template, description, OG, Twitter, `metadataBase` |
| Per-page metadata | Present on most routes | `export const metadata` / `generateMetadata` in ~50 pages |
| Canonical URLs | **Broken** | `alternates: { canonical: "/" }` in root layout is inherited by every page |
| `robots.ts` | Present | Blocks `/admin`, `/account`, `/cart`, `/checkout`, `/orders` |
| `sitemap.ts` | Present but **incomplete** | Only static routes; no `/books/[slug]`, `/blogs/[slug]`, authors, publishers, categories |
| JSON-LD structured data | **Missing** | No `application/ld+json` anywhere |
| OG images | **Missing** | No `opengraph-image.tsx`; only text OG tags |
| Images | **Unoptimized** | 40+ plain `<img>`; no `next/image` |
| Uploaded books | **Not indexable** | They live in `localStorage`; `generateMetadata` only reads `src/data/books` |
| Fonts | **Bengali falls back** | `Roboto({ subsets: ["latin"] })` in a Bengali-first site |
| Search page | Indexable + in sitemap | Should usually be `noindex` |

---

## 1. P0 — fix before any SEO work depends on this app

### 1.1 Remove the global canonical override

**Problem.** `src/app/layout.tsx` sets:

```ts
alternates: { canonical: "/" },
```

Next.js merges metadata down the route tree. Every page that does not explicitly set
`alternates` — which is almost all of them — therefore tells Google *"the canonical
version of this page is the homepage."* That is a site-wide de-indexing risk.

**Fix.** Delete `alternates` from the root layout and set it per route with an absolute URL
built from `SITE_URL`:

```ts
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "All Books",
  description: "...",
  alternates: { canonical: `${SITE_URL}/books` },
};
```

For dynamic routes:

```ts
alternates: { canonical: `${SITE_URL}/books/${book.slug}` },
```

Rule: **every indexable route declares exactly one absolute canonical.**

### 1.2 Sitemap must list real URLs, not just sections

`src/app/sitemap.ts` currently lists 29 static paths and nothing else. Every product page
is invisible to the sitemap.

Required additions:

- `/books/[slug]` (published books)
- `/blogs/[slug]`
- `/authors/[slug]`, `/publishers/[slug]`, `/category/[slug]`
- `/sunnah-items/[slug]`
- Remove `/search` (and `/cart`, `/checkout`) — those are not landing pages.

Also set a real `lastModified` per entity (`updated_at`), not `new Date()` for everything.
Constant `lastModified` teaches crawlers the value is meaningless.

```ts
lastModified: book.updatedAt,
changeFrequency: "weekly",
priority: 0.8,
```

Once the DB exists (§ARCHITECTURE), build the sitemap from queries, not from `src/data`.
Keep it under 50 000 URLs per file; split with `generateSitemaps()` if it grows.

### 1.3 The uploaded-book indexing gap

`/books/[slug]/page.tsx` does this:

```ts
export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug })); // static demo only
}

export async function generateMetadata({ params }) {
  const book = getBook(slug);          // src/data/books only
  if (!book) return { title: "Books" }; // uploaded books get the WRONG title
}
```

Two consequences:

1. An admin-uploaded book is a client-side route; crawlers see the fallback shell.
2. Its metadata title becomes `"Books | TalkNest BD"` with the site description.

**Fix (short term, still localStorage):** keep the server-renderable static catalogue
indexable; accept that uploads are demo-only and keep their pages `noindex` until they
are server-backed.

**Fix (target):** resolve books from Postgres in `generateStaticParams` +
`generateMetadata`, so every published book is a real, indexable URL. This is the main
reason the unified-book rule in `AGENTS.md` needs a database.

### 1.4 `noindex` for utility routes

Add to every non-marketing route:

```ts
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

Applies to: `/search`, `/cart`, `/checkout`, `/login`, `/account/**`, `/orders/**`,
`/wishlist`, `/admin/**`, `/stories/share`.

`robots.txt` disallow only prevents crawling, **not indexing** if something links to the
page — the meta tag is the reliable signal. Do both.

### 1.5 Bengali font subset

```ts
const roboto = Roboto({ subsets: ["latin"], weight: [...], variable: "--font-roboto" });
```

Roboto has no Bengali glyphs. All Bengali copy currently renders in an unpredictable
system fallback, which changes metrics per device (CLS) and can look broken on some
platforms.

**Fix.** Load a Bengali face via `next/font` and put it first in the stack:

```ts
import { Hind_Siliguri } from "next/font/google";

const bengali = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});
```

Then in `globals.css`: `font-family: var(--font-bengali), var(--font-roboto), sans-serif;`
Keep Latin headlines on Roboto if that is the design intent, but ensure Bengali text
never falls through to an unloaded font. Verify with DevTools → Rendered Fonts.

---

## 2. P1 — metadata rules per route type

### 2.1 Global (root layout)

- `metadataBase: new URL(SITE_URL)` — already correct; keep it so relative canonicals and
  OG URLs resolve.
- Title template `%s | TalkNest BD` — already correct. Never repeat the brand in a page
  title.
- `openGraph.locale` — currently `en_BD`. For a Bengali-first storefront use `bn_BD` and
  add `alternateLocale: ["en_BD"]`. (OG locale format is `language_TERRITORY`.)
- `twitter.card` — keep `summary_large_image`; add a real image (§2.4).

### 2.2 Titles and descriptions

| Field | Rule |
| --- | --- |
| `title` | 45–60 chars, unique, front-load the entity name (`মিসির আলি অমনিবাস ১`) |
| `description` | 120–160 chars, unique, includes author/category/price context where relevant |
| No description | Never ship an empty or duplicated description; fall back to a templated one |
| Keyword stuffing | Do not add a `keywords` array with 50 terms; it is ignored by Google |

For book pages:

```
title:       `${book.title} — ${book.author}`
description: `${book.title} by ${book.author}. ${book.subtitle ?? ""} ৳${price}. Published by ${publisher}.`
```

### 2.3 Dynamic routes — required metadata

| Route | Title | Description | Canonical | OG type |
| --- | --- | --- | --- | --- |
| `/books/[slug]` | Book — Author | Book description | `/books/<slug>` | `book` / `article` |
| `/blogs/[slug]` | Post title | Excerpt | `/blogs/<slug>` | `article` |
| `/authors/[slug]` | Author name | Bio (first 155 chars) | `/authors/<slug>` | `profile` |
| `/publishers/[slug]` | Publisher name | Tagline/description | `/publishers/<slug>` | `website` |
| `/category/[slug]` | Category name | Category description | `/category/<slug>` | `website` |
| `/sunnah-items/[slug]` | Item name | Description | `/sunnah-items/<slug>` | `product` |
| Static pages | Unique per page | Unique per page | Absolute | `website` |

Also set `openGraph.url` and `openGraph.images` explicitly on dynamic routes. Inheriting a
generic image hurts click-through.

### 2.4 Open Graph images

Next.js can generate these per route with `opengraph-image.tsx` (uses `ImageResponse`).
Do this instead of shipping one static OG image for the whole site.

- One for the site (brand + tagline).
- One for books (cover colours / CSS `BookCover` motif + title + author + price).
- One for blog posts (title + category + date).

Constraints: 1200×630, < 8 MB, no remote fonts unless embedded, keep text short, and test
with the Facebook Sharing Debugger and X Card Validator.

### 2.5 Breadcrumbs

Most pages already render a visual `<Breadcrumb>`. Mirror it in structured data (§3.5) and
keep the URL hierarchy consistent with the visible trail.

---

## 3. Structured data (JSON-LD)

There is none today. Add it server-side (never via `dangerouslySetInnerHTML` on user
input). Render one `<script type="application/ld+json">` per graph.

```tsx
<script
  type="application/ld+json"
  // JSON.stringify of a server-built object; escape "<" to prevent </script> breakout
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
/>
```

### 3.1 Site-wide — root layout

`Organization` + `WebSite` with a `SearchAction` (enables the sitelinks search box):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://talknestbd.com/#org",
      "name": "TalkNest BD",
      "url": "https://talknestbd.com",
      "logo": "https://talknestbd.com/icon.svg",
      "sameAs": ["https://facebook.com/...", "https://youtube.com/..."]
    },
    {
      "@type": "WebSite",
      "@id": "https://talknestbd.com/#site",
      "url": "https://talknestbd.com",
      "name": "TalkNest BD",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://talknestbd.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
```

### 3.2 Book page — `Book` + `Offer`

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "{{title}}",
  "author": { "@type": "Person", "name": "{{author}}" },
  "publisher": { "@type": "Organization", "name": "{{publisher}}" },
  "isbn": "{{isbn_if_available}}",
  "numberOfPages": {{pages}},
  "inLanguage": "bn",
  "bookFormat": "https://schema.org/Paperback",
  "image": "{{absolute_cover_url}}",
  "description": "{{description}}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": {{rating}},
    "reviewCount": {{reviewCount}}
  },
  "offers": {
    "@type": "Offer",
    "price": "{{price}}",
    "priceCurrency": "BDT",
    "availability": "https://schema.org/InStock",
    "url": "{{absolute_book_url}}"
  }
}
```

Rules:

- `aggregateRating` only when `reviewCount > 0`. Fake or zero-count ratings are a manual
  action risk.
- `priceCurrency: "BDT"`, price as a string, no `৳` symbol inside the value.
- `availability` must reflect real stock (`InStock` / `OutOfStock`).
- Do not emit `Offer` for an unpublished/draft book.

### 3.3 Blog — `BlogPosting`

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{title}}",
  "image": ["{{absolute_og_image}}"],
  "datePublished": "{{iso}}",
  "dateModified": "{{iso}}",
  "author": { "@type": "Person", "name": "{{author}}" },
  "publisher": { "@type": "Organization", "name": "TalkNest BD" },
  "mainEntityOfPage": "{{absolute_url}}"
}
```

Dates must be ISO 8601 (`2026-11-18T10:00:00+06:00`), not the display strings currently
stored in `src/data/blog.ts`.

### 3.4 Author — `Person`

`name`, `description`, `image`, `url`, and `sameAs` social links if known.

### 3.5 Everywhere — `BreadcrumbList`

Emit on book, blog, category, author, publisher and legal pages. It is cheap and improves
how the URL appears in results.

### 3.6 Validation

- Google Rich Results Test on the deployed URL (not localhost).
- Schema Markup Validator for syntax.
- Keep the JSON-LD in the server-rendered HTML — check with `curl` / view-source, not the
  React tree.

---

## 4. Core Web Vitals (SEO ranking input)

### 4.1 LCP

- The hero image is the LCP element on `/` and campaign pages.
- Use `next/image` with `preload` (Next 16: `priority` is deprecated) and a real
  `width`/`height` or `fill` + `sizes`.
- Serve AVIF/WebP; pre-generate on upload (see ARCHITECTURE §7).
- Do not lazy-load the hero. Do lazy-load everything below the fold (default).
- Avoid a client hydration gate in front of the hero. Today the hero is provider-fed and
  renders after mount — that alone can push LCP past 2.5 s on mobile.

### 4.2 CLS

- Reserve space for every image (aspect-ratio box or `width`/`height`).
- Reserve space for the header; the sticky header must not change height on hydration.
- Load a Bengali font with `display: "swap"` and a matching fallback metric.
- Never inject a banner/promo above existing content after paint.

### 4.3 INP

- `src/app/layout.tsx` nests ~20 context providers. Each one re-renders consumers and
  delays interactivity. Collapse them (ARCHITECTURE §6.6).
- Code-split the admin panel (`AudioEditor.tsx` is 61 KB, `SellUsedBooksEditor.tsx` 57 KB).
  Admin routes should not be in the storefront bundle.
- Debounce search input; do not run a full catalogue filter on every keystroke.
- Prefer CSS transitions over JS animation loops.

### 4.4 Budget

| Metric | Target (mobile p75) |
| --- | --- |
| LCP | < 2.5 s |
| INP | < 200 ms |
| CLS | < 0.1 |
| TTFB | < 0.8 s |
| JS transferred (storefront first load) | < 200 KB gzip |

Measure with Lighthouse mobile + CrUX/PageSpeed Insights on the deployed URL, not dev mode.

---

## 5. Crawling, indexing and AI answer engines (GEO)

### 5.1 robots.ts

- Keep the current disallow list (`/admin`, `/account`, `/cart`, `/checkout`, `/orders`)
  and add `/search` once it is `noindex` (belt and braces).
- `host:` is a Yandex directive that expects a bare hostname. Either drop it or use
  `talknestbd.com` without the scheme.
- Do **not** block CSS/JS. Google renders pages; blocking assets degrades indexing.
- Allow AI crawlers explicitly if you want citations (see 5.3). The current `*` rule
  already allows them, but being explicit documents intent.

### 5.2 Rendering reality

Large parts of the storefront are client-rendered from `localStorage`. Googlebot runs JS,
but:

- It needs the data to exist for *its* session. `localStorage` is per-browser, so an
  uploaded book simply does not exist for the crawler.
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot) generally **do not execute JavaScript**.
  They see the server HTML only.

Therefore: **anything that must be found in search or cited by an AI answer must be in the
server-rendered HTML.** That means moving catalogue reads to Server Components + Postgres
(ARCHITECTURE §6), not just adding meta tags.

### 5.3 AI crawler policy

| Bot | Purpose | Suggested |
| --- | --- | --- |
| `GPTBot` | OpenAI training/crawl | Allow (discovery) |
| `OAI-SearchBot` | ChatGPT search citations | Allow |
| `ClaudeBot`, `anthropic-ai` | Anthropic | Allow |
| `PerplexityBot` | Perplexity citations | Allow |
| `CCBot` | Common Crawl | Your call; allow for reach |
| `Google-Extended` | Gemini training | Your call |

Optional but useful: publish `/llms.txt` with the shop's canonical description, key
collections and policies. It is a convention, not a standard — treat it as a bonus.

### 5.4 Content that earns citations

- A unique 2–4 sentence factual summary on each category page (what the shelf is, who it is
  for, delivery/buyback terms).
- Consistent business facts: name, address, phone, delivery zones, return window — repeated
  in `Organization` schema and on `/contact`, `/return-policy`.
- Real dates on blog posts (`datePublished`), updated when edited.
- Avoid identical boilerplate across 25 product pages; templated descriptions get filtered.

---

## 6. Per-page SEO checklist

Before marking a page done:

- [ ] Exactly one absolute canonical (`alternates.canonical`)
- [ ] Unique `<title>` ≤ 60 chars, brand only via the template
- [ ] Unique description 120–160 chars
- [ ] `openGraph.url`, `openGraph.title`, `openGraph.images` set
- [ ] `twitter.card` inherited; a real image exists
- [ ] One `<h1>` matching the page intent; logical `h2`/`h3` outline
- [ ] Internal links use `<Link>` and descriptive anchor text (not "click here")
- [ ] Images use `next/image` with `alt`, dimensions/`sizes`, lazy except LCP
- [ ] JSON-LD present and valid (book/blog/author/breadcrumb as applicable)
- [ ] Utility page? `robots: { index: false }`
- [ ] Added to `sitemap.ts` **only** if it should rank
- [ ] Server HTML contains the primary content (check with `curl`, not just the browser)
- [ ] No console/hydration errors in Playwright
- [ ] Lighthouse mobile: LCP < 2.5 s, CLS < 0.1, INP < 200 ms

---

## 7. Verification commands

```powershell
# Build and type-check
npx tsc --noEmit --pretty false
npm run build

# What a crawler actually gets (server HTML, no JS)
curl.exe -s http://localhost:3000/books/misir-ali-omnibus-1 | Select-String -Pattern "<title>|<link rel=\"canonical\"|application/ld\+json"

# Sitemap / robots
curl.exe -s http://localhost:3000/sitemap.xml
curl.exe -s http://localhost:3000/robots.txt
```

External checks after deploy:

- Google Rich Results Test — JSON-LD
- PageSpeed Insights — CWV on the real URL
- Facebook Sharing Debugger / X Card Validator — OG image and title
- `site:talknestbd.com` in Google after indexing

---

## 8. Known SEO bugs to track

| # | Severity | Issue | File |
| --- | --- | --- | --- |
| 1 | Critical | Global `canonical: "/"` inherited by all pages | `src/app/layout.tsx` |
| 2 | High | Sitemap omits every dynamic entity URL | `src/app/sitemap.ts` |
| 3 | High | Uploaded books are not server-rendered / metadata says "Books" | `src/app/(storefront)/books/[slug]/page.tsx` |
| 4 | High | `/search` indexable and listed in sitemap | `src/app/(storefront)/search/page.tsx`, `sitemap.ts` |
| 5 | Medium | Bengali text has no Bengali font loaded | `src/app/layout.tsx` |
| 6 | Medium | No JSON-LD anywhere | all routes |
| 7 | Medium | No per-page OG images | all routes |
| 8 | Medium | `openGraph.locale` is `en_BD` on a Bengali-first site | `src/app/layout.tsx` |
| 9 | Low | Blog share URL hardcodes `https://talknestbd.com` instead of `SITE_URL` | `src/app/(storefront)/blogs/[slug]/page.tsx` |
| 10 | Low | `robots.ts` `host` includes the scheme | `src/app/robots.ts` |