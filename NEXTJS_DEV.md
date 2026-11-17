# Next.js development workflow (TalkNest BD)

This project runs Next.js 16 (App Router), React 19 and Tailwind CSS v4. The
rules in `AGENTS.md` are authoritative — keep user-facing UI copy Bengali-first.

## Use the connected MCP servers

- **next-devtools** — call `nextjs_docs` for version-matched Next.js docs before
  using framework APIs, and `nextjs_index` + `nextjs_call` to inspect the
  running dev server (errors, logs, routes, compilation issues). Requires
  `npm run dev` to be running.
- **context7** — fetch current docs for React, Tailwind, Swiper and other
  libraries instead of relying on training data.
- **playwright** — verify changed pages in a real browser (snapshot, click,
  console messages) before declaring frontend work done.

## Before finishing a change

1. `npx tsc --noEmit --pretty false`
2. `npm run build` for changes that affect routing, config or rendering.
3. Prefer server components; add `"use client"` only for interaction or
   browser APIs. Dynamic pages `await` `params` / `searchParams`.
4. Keep demo disclaimers in checkout, receipts and forms — there is no backend;
   data lives in `localStorage`.
