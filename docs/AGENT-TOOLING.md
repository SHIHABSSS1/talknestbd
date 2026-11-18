# TalkNest BD — Agent Tooling & How To Use It

> Purpose: the installed skills, MCP servers and CLI scanners are **already configured on
> this machine**. Use them instead of guessing from training data. This file says which
> one to reach for, and when.

---

## 1. Skills — load with the `skill` tool

Load a skill *before* starting the work it covers. Skills inject instructions; they are
not documentation to skim afterwards.

| Skill ID | Use it for | TalkNest trigger |
| --- | --- | --- |
| `nextjs-ship-ready` | Production readiness: CWV, technical SEO, GEO, security headers, launch audit | "make it production ready", slow pages, poor Lighthouse, pre-deploy review |
| `nextjs-seo` | Metadata, OG images, sitemap/robots, canonicals, structured data, AI crawler policy | any route/metadata/sitemap change, indexing diagnosis |
| `vercel-react-best-practices` | React/Next performance: RSC boundaries, bundle size, data fetching, memoisation | writing or refactoring components, provider cleanup, hydration work |
| `web-design-guidelines` | UI review against Web Interface Guidelines | "review my UI", accessibility audit, design QA |
| `ui-ux-pro-max` | UI/UX intelligence: 192 palettes, 74 font pairs, 120 UX rules, 22 stacks | designing a new page/section, choosing colour/type/spacing |
| `ui-styling` | shadcn/ui + Tailwind + canvas visuals, dark mode, accessible components | building interface primitives, dialogs, forms, tables |
| `frontend-design` | Distinctive visual direction that avoids templated defaults | redesigning an existing surface, new landing page |
| `design-system` | Three-layer tokens, component specs, CSS variables | token architecture, systematic UI work |
| `brand` | Brand voice, messaging, consistency | copy tone, marketing assets, brand compliance |
| `banner-design` | Social/ad/hero/print banners | campaign creative, OG/hero artwork |
| `slides` / `design` | HTML presentations, logos, CIP, icons, social photos | pitch decks, logo/icon generation |
| `security-best-practices` | Language/framework secure-coding review (JS/TS, Python, Go) | auth, uploads, input handling, secrets, new server code |
| `modern-web-guidance` | Current HTML/CSS/JS platform guidance (dialogs, container queries, view transitions, forms, a11y) | front-end features where APIs changed recently |
| `opencode` | How OpenCode itself works: config, agents, MCP, SDK | tooling/harness questions |
| `report` | File an OpenCode bug with diagnostics | only when asked to report an OpenCode issue |

**Rule of thumb**

- Touching `src/app/**/page.tsx` metadata or `sitemap.ts` / `robots.ts` → `nextjs-seo`.
- Touching rendering, providers, data fetching, bundle → `vercel-react-best-practices`.
- Adding auth, uploads, server actions, payment-ish flows → `security-best-practices`.
- Any pre-deploy pass → `nextjs-ship-ready`.
- Visual redesign → `ui-ux-pro-max` + `frontend-design` (and `design-system` for tokens).

---

## 2. MCP servers — call through `execute`

These are already wired. Exact tool paths:

### next-devtools — version-accurate Next.js docs + live dev server

| Tool | When |
| --- | --- |
| `tools["next-devtools"].nextjs_docs` | **First stop** for any Next.js API question. Returns docs for *this* project's version (16.4.6), not training data. |
| `tools["next-devtools"].nextjs_index` | Discover running dev servers and their available MCP tools. Requires `npm run dev`. |
| `tools["next-devtools"].nextjs_call` | Call a tool on the running dev server (errors, logs, routes, build/compile status). |
| `tools["next-devtools"].browser_eval` | Project browser automation via the agent-browser CLI. |

Also read the bundled docs directly when needed:
`node_modules/next/dist/docs/` — e.g. `01-app/01-getting-started/08-caching.md`,
`03-api-reference/02-components/image.md`.

### context7 — current library docs

| Tool | When |
| --- | --- |
| `tools.context7["resolve-library-id"]` | Resolve a package name to a Context7 ID before querying. |
| `tools.context7["query-docs"]` | Fetch current API usage for React, Tailwind, Swiper, Drizzle, Better Auth, etc. |

Use it whenever the answer depends on a library API that may have changed. Do **not** use
it for this repo's own code or general programming concepts.

### playwright — real browser verification

| Tool | When |
| --- | --- |
| `tools.playwright.browser_navigate` | Open the changed route. |
| `tools.playwright.browser_snapshot` | Read the accessibility tree (preferred over screenshots for assertions). |
| `tools.playwright.browser_console_messages` | Catch hydration warnings and runtime errors. |
| `tools.playwright.browser_click` / `browser_find` / `browser_take_screenshot` | Interaction and visual checks. |

Never declare a frontend change done without opening it in a browser.

### Security scanners

| Server | Tools | Use |
| --- | --- | --- |
| `semgrep` | `semgrep_scan`, `semgrep_scan_with_custom_rule`, `semgrep_scan_supply_chain`, `semgrep_findings` | SAST on new server code, OWASP-style patterns, dependency/supply-chain checks |
| `trivy` | `scan_filesystem`, `scan_repository`, `scan_image`, `findings_list` | Dependencies, secrets, IaC/config, container images |
| `njordscan` | `njordscan_scan`, `njordscan_explain`, `njordscan_list_rules` | Next.js/React/Vite-specific rules with plain-English fixes |

Use `njordscan_explain` on any rule ID you do not understand. Run a scan after editing code
that handles input, auth, uploads, secrets, config or dependencies.

### CLI only (no MCP server)

```powershell
# Secrets — staged changes before a commit (output is redacted)
& "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe\gitleaks.exe" git --staged --redact

# Secrets — a specific untracked folder (never point at a repo root with node_modules/.next)
& "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe\gitleaks.exe" dir .\uploads --redact

# Trivy filesystem
& "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\AquaSecurity.Trivy_Microsoft.Winget.Source_8wekyb3d8bbwe\trivy.exe" fs --scanners vuln,secret,misconfig .

# Semgrep
& "$env:APPDATA\Python\Python312\Scripts\semgrep.exe" scan --config auto .

# NjordScan
& "$env:APPDATA\Python\Python312\Scripts\njordscan.exe" scan .
```

Only scan code and paths the user owns or is authorised to scan.

---

## 3. Standard workflow for a change

1. **Understand** — read the relevant file(s). Do not assume the Next.js version behaves
   like training data.
2. **Check docs** — `nextjs_docs` for framework APIs, `context7` for libraries,
   `node_modules/next/dist/docs/` when offline.
3. **Load the matching skill** (§1) before writing.
4. **Implement** — smallest change that follows existing patterns and design tokens.
5. **Verify**
   - `npx tsc --noEmit --pretty false`
   - `npm run build` (routing, config, rendering changes)
   - Playwright: open the route, read console messages, confirm no hydration errors
   - Scanner pass for data-handling changes (§2)
6. **Report** — file paths, what changed, what you checked, what is still open.

---

## 4. Version-specific traps in this project (learned, not guessed)

- Next.js is **16.4.6** — `params` / `searchParams` are Promises and must be `await`ed.
- `cacheComponents: true` + `partialPrefetching: true` are on. Use `"use cache"` +
  `cacheLife` + `cacheTag`; `revalidateTag(tag, profile)` takes a second argument.
- `images.qualities` is **required** in Next 16 (default `[75]`).
- The `<Image priority>` prop is **deprecated** in v16 — use `preload`.
- All user-facing copy is **Bengali-first**; keep new strings in Bengali.
- Book covers are CSS-generated unless an image was uploaded. Do not introduce external
  cover URLs.
- There is one book detail page: `/books/[slug]`. Never add a shelf-specific detail page.
- Checkout, receipts and forms must keep the "demo / no real payment / browser-local data"
  disclaimer until a real backend exists.

---

## 5. Do not

- Do not add a dependency without need; the current runtime is deliberately small.
- Do not call `fetch("/api/...")` from the client for catalogue data — use RSC/queries.
- Do not store base64 blobs in `localStorage` or Postgres when a `media` record + file is
  the right shape.
- Do not put `"use cache"` on anything that reads cookies, session or per-user data.
- Do not edit `.next/`, `node_modules/`, or generated TypeScript build info.
- Do not paste secrets into the transcript; scanners redact by default.