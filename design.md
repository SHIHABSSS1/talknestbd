# TalkNest BD — Rokomari-Inspired Design System (Alpha)

> A vibrant, commerce-first storefront system adapted from Rokomari's measured
> visual language. This version is **English-first** and uses the shared tokens
> below across the storefront, account and checkout journeys.

## 1. Design Direction

TalkNest BD should feel like a busy, trustworthy Bangladeshi book marketplace:
clear product discovery, bold blue conversion points, white product surfaces and
small, bright promotional moments. The interface is flat and confident, not
decorative or editorial. Product covers and campaign colour blocks do the visual
work; shadows are rare and very soft.

**Principles**

- Lead with blue. Primary actions, the main navigation band and active states use
  brand blue.
- Keep the shopping grid quiet. White cards, grey hairlines, dark ink.
- Use colour blocking for campaigns, never heavy elevation.
- Use sharp-to-soft geometry: 4–8px cards, 4px buttons, pill-shaped search.
- English is the default language for every visible label and content string.
- Spend motion only where it helps discovery (hero, hover, carousels).

## 2. Colour Tokens

| Token | Value | Role |
|---|---|---|
| `primary` | `#4398FE` | Primary actions, links, selected states |
| `accent` | `#1877F2` | Main nav, hero, strong conversion surfaces |
| `canvas` | `#F9FAFB` | Page background |
| `surface` | `#FFFFFF` | Cards, header, menus |
| `ink` | `#1B1B1B` | Headings and primary text |
| `body` | `#333333` | Body copy and supporting text |
| `muted` | `#6B7280` | Metadata, helper copy, secondary labels |
| `hairline` | `#D0E2FF` | Blue-tinted dividers and input borders |
| `border` | `#E5E7EB` | Card and section hairlines |
| `accent-1` | `#37AAF7` | Sky-blue campaign tint |
| `accent-2` | `#BACDFF` | Periwinkle surface tint |
| `accent-3` | `#E1C0FF` | Lavender campaign tint |
| `accent-4` | `#96CADB` | Teal campaign tint |
| `accent-5` | `#96DB9D` | Mint success/campaign tint |
| `accent-6` | `#FF9900` | Deal / urgency accent |
| `neutral-1` | `#E5E7EB` | Mid neutral |
| `neutral-3` | `#F1F2F4` | Soft alternate surface |
| `neutral-4` | `#D9D9D9` | Disabled line / secondary button border |

### Light theme

- `bg`: `#F9FAFB`
- `surface`: `#FFFFFF`
- `surfaceRaised`: `#F1F2F4`
- `text`: `#1B1B1B`
- `textMuted`: `#6B7280`
- `border`: `#E5E7EB`
- `accent`: `#4398FE`
- `accentFg`: `#FFFFFF`
- `focusRing`: `#4398FE`

### Gradient

Use sparingly for decorated section backgrounds:

```css
linear-gradient(0deg, rgb(214, 235, 250), rgb(136, 162, 245))
```

## 3. Typography

**Family:** Roboto, with system sans-serif fallback.

```css
font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

| Role | Size | Weight | Line height | Use |
|---|---|---|---|---|
| Hero | 40–52px | 700 | 1.08 | Home hero only |
| Heading XL | 30px | 700 | 1.2 | Page titles |
| Heading LG | 24px | 700 | 1.25 | Large section titles |
| Heading MD | 22px | 700 | 1.35 | Default section title |
| Heading SM | 18px | 700 | 1.3 | Card groups |
| Heading XS | 16px | 700 | 1.5 | Card headings |
| Body MD | 16px | 400 | 1.5 | Primary copy |
| Body SM | 14px | 400 | 1.5 | Product metadata |
| Body Strong | 14px | 500 | 1.43 | Labels, tabs |
| Caption | 12px | 400 | 1.5 | Metadata |
| Caption XS | 11px | 400 | 1.5 | Stock, timestamps |

**Rules**

- Headings are always 700.
- Letter-spacing stays at `0`.
- Only weights 300, 400, 500 and 700 are used.
- Section titles stay around 22px; the hero is the only oversized display.

## 4. Spacing, Radius, Elevation

**Spacing scale:** 4 / 8 / 12 / 16 / 20 / 32 / 48 / 64 / 96px.

**Radius**

| Token | Value | Use |
|---|---|---|
| `none` | `0px` | Flat promotional blocks |
| `xs` | `4px` | Buttons, book covers, badges |
| `sm` | `8px` | Cards, panels, menu surfaces |
| `full` | `9999px` | Search inputs, pills, avatars |

**Elevation**

- Default cards: `1px` hairline border, no shadow.
- Sticky header: `0 1px 0 rgba(17, 24, 39, 0.06)`.
- Hover only: `0 8px 24px rgba(17, 24, 39, 0.08)`.
- Never use dark, large cast shadows.

## 5. Core Components

### Buttons

- **Primary:** blue (`accent`), white text, 4px radius, 40–44px tall, 14–16px
  bold label.
- **Secondary:** white, `1px` neutral border, ink text, 4px radius, 40px tall.
- **Ghost:** transparent, ink text, blue hover surface.
- Focus ring: 2px `primary` offset by 2px.

### Search

Pill-shaped white input with a blue-tinted hairline. Search action sits inside on
the right and uses primary blue.

### Product card

White surface, 1px neutral border, 4–8px radius, 8px padding, CSS-generated book
cover, small blue discount/badge, title, author, orange rating, dark price and a
blue square add-to-cart action. Hover lifts the cover slightly—not the card.

### Navigation

Two tiers:

1. Utility strip — small dark text on canvas or light blue.
2. Main header — white surface, logo, pill search, account/wishlist/cart.
3. Category strip — bold blue bar with white navigation links.

Mobile uses a hamburger drawer and fixed bottom tab bar.

### Promotional blocks

Use solid `accent-2`, `accent-3`, `accent-5`, `accent-6` or the blue gradient.
Text is ink or white, corners are 0–8px, and decorative rings are optional but
must be low contrast.

## 6. Section Patterns

- **Hero:** category rail + large campaign panel + stacked promo cards.
- **Category discovery:** circular/tile category icons with counts.
- **Deals:** tabbed deal header, countdown, dense horizontal product grid.
- **Book rails:** section header with blue marker, 6-column product grid, see-all
  action. Alternate white and soft-grey backgrounds.
- **Editorial promos:** flat blue / mint / orange panels with a single clear CTA.
- **Community:** author portraits, reviews and story cards on white.
- **Footer:** blue newsletter band above a deep navy link area.

## 7. Responsive Rules

| Viewport | Grid | Navigation | Section padding |
|---|---|---|---|
| 375px | 2 product columns | Hamburger + bottom tabs | 16px |
| 768px | 3 product columns | Hamburger or compact nav | 24px |
| 1024px | 4 product columns | Full nav + category rail | 32px |
| 1280px+ | 5–6 product columns | Full nav | 32px |

Typography does not need to shrink below 14px for body copy. Keep touch targets
at least 40px high.

## 8. Accessibility

- Minimum 4.5:1 contrast for body copy; blue buttons use white text.
- Visible 2px focus ring on all interactive elements.
- Never rely on colour alone for deal status; pair with labels.
- Respect `prefers-reduced-motion` for hero and hover motion.
- Meaningful alt text for editorial imagery; CSS book covers keep their title
  and author in the accessible DOM.

## 9. Do / Don't

**Do**

- Use bold blue for the single most important action in each viewport.
- Use white cards and grey hairlines for the catalogue.
- Use orange only for ratings, countdowns and limited-time urgency.
- Keep product imagery central and metadata concise.
- Keep all UI copy in English and use `৳` for prices.

**Don't**

- Don't add large, dark shadows or glassmorphism.
- Don't use more than one decorative accent in the same section.
- Don't use serif or script typefaces.
- Don't use Bengali numerals or Bengali UI copy in this English-first build.
- Don't add multi-layer gradients to product cards.

## 10. Implementation Map

| Area | Source |
|---|---|
| Theme tokens | `src/app/globals.css` |
| Typography and metadata | `src/app/layout.tsx` |
| Header / mobile navigation | `src/components/layout/Header.tsx`, `MobileBottomNav.tsx` |
| Book cards | `src/components/books/BookCard.tsx`, `BookCover.tsx` |
| Home sections | `src/components/home/*` |
| Navigation labels | `src/lib/navigation.ts` |
| Catalogue content | `src/data/*` |

## 11. Homepage Composition

The storefront follows Rokomari's discovery-heavy rhythm:

1. Three-column hero: category rail, rotating campaign carousel and promo cards.
2. Trust strip with delivery, buyback, authenticity and wholesale benefits.
3. Flat category discovery tiles.
4. Best-seller rail.
5. Blue buyback campaign panel.
6. New-arrivals rail.
7. Free-delivery and wholesale promo pair.
8. Trending-books rail.
9. Dark audiobook feature with waveform preview.
10. Sunnah essentials.
11. Pre-loved books panel.
12. International-books rail.
13. Author and publisher discovery.
14. Student-books rail.
15. Reader reviews.
16. Video and quiz pair.
17. Reader stories and sharing call to action.

Sections alternate white, `canvas` and deep-blue surfaces so the page stays visually busy
without relying on shadows or decorative gradients.

