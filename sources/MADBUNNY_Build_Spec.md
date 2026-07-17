# MADBUNNY Storefront — Build Spec (v1)

**Status:** Planning complete. Phase 0 ready to execute.
**Companion doc:** `MADBUNNY_Web_Design_Guidelines.md` — that doc owns *how it looks*. This doc owns *how it's built and why*.

---

## 0. How to use this doc

Read this before any task in this repo.

Section 10 (Decision Log) exists because several things in this build **look like bugs and are not**. The serial field always fails. The stock counter is usually hidden. Prices have no cents. If you're about to "fix" one of those, read Section 10 first — the reasoning is attached to each one. If a decision looks wrong, raise it; don't silently correct it.

---

## 1. Goal

An ecommerce storefront for MADBUNNY — a character-IP lifestyle brand. Customers browse and buy paintings, toys, prints, stickers, and apparel.

v1 ships five routes: `/` (home), `/collectibles`, `/apparel`, `/about`, `/jointheclub`.

**Non-goals for v1:** search, customer accounts, wishlists, reviews, blog, multi-currency, working serial registration, 3D hero.

---

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSR/SSG for product SEO and OG meta. See D-01. |
| Styling | Tailwind CSS | — |
| Icons | lucide-react | — |
| Commerce | Shopify **Storefront API** (GraphQL) | Reads + cart only. Checkout is hosted. See D-03. |
| Checkout | Shopify hosted (`cart.checkoutUrl`) | **Do not build checkout.** See D-03. |
| Fonts | Geist Mono (self-hosted via `next/font`), Helvetica Neue | See D-05. |
| Display type | Splatink, as **inline SVG paths only** | Never as a webfont. See D-06. |
| Hosting | Vercel (assumed) | — |

**Originally planned as Vite SPA. Changed to Next.js.** See D-01. Do not revert.

---

## 3. Brand constraints

### Palette

Source of truth is **Brand Deck v2 (2026)**:

| Name | Hex |
|---|---|
| Black | `#151312` |
| Mad Red | `#FF402B` |
| Bunny White | `#FFF8F8` |
| Gun Metal | `#4D5257` |
| Bunny Pink | `#FFBFB4` |

> ⚠️ An older palette (`#FF0037` / `#ECECEC` / `#2C2C2C`) exists in earlier notes. **Deck v2 supersedes it.** Confirm with Gia if you see the old values anywhere.

Pure `#000000` / `#FFFFFF` never substitute for Black / Bunny White.

### Typography

| Role | Face | Delivery |
|---|---|---|
| Display headings | Splatink (Mans Greback) | **Inline SVG paths.** Never `@font-face`. |
| Nav, labels, captions, timestamps | Geist Mono | `next/font` self-hosted. OFL, free. |
| Body copy | Helvetica Neue | System stack w/ fallbacks |

### Voice

Short declarative sentences. **No exclamation marks.** No emojis. No corporate softness. Dry, understated. Specific over exaggerated. This applies to every string in the UI — error messages, button labels, empty states, alt text.

---

## 4. Assets

Delivered, optimized, ready to drop in `/public`. Do not re-encode.

```
public/
├── media/
│   ├── hero-360.webm            332 KB   VP9, no audio, 1920×1080, 24fps, 6.5s
│   ├── hero-360.mp4             540 KB   H.264 fallback, no audio
│   ├── hero-360-poster.webp      20 KB   frame 0
│   ├── bunny-metal.webp          80 KB   500px
│   ├── bunny-metal.avif          60 KB   500px
│   ├── bunny-metal@2x.webp      208 KB   1000px
│   └── bunny-metal@2x.avif      148 KB   1000px
└── products/
    ├── product-{1,2,3}.webp      ~16 KB  1000px, transparent
    └── product-{1,2,3}-thumb.webp ~8 KB  400px, transparent
```

**`hero-360` loops seamlessly.** Verified: last→first frame delta (13.7 mean) is *smaller* than a normal frame step (21.2). No trim, no crossfade, no JS loop hack. `loop` attribute is sufficient.

**Product images are placeholders.** All three are the Bunny Black toy. They currently stand in for Mad Red, Gun Metal, and three 48-inch paintings. Correct on screen, wrong in fact. Must not ship to production.

---

## 5. Shopify

### 5.1 Metafield definitions

Create these **before** entering any product.

| Key | Level | Type |
|---|---|---|
| `custom.year` | Product | Integer |
| `custom.dimensions_metric` | Product | Single line text |
| `custom.dimensions_in` | Product | Single line text |
| `custom.scale` | Product | Single line text |
| `custom.tier` | Product | Single line text |
| `custom.medium` | **Variant** | Single line text |
| `custom.edition_size` | **Variant** | Integer |

> 🔴 **Every definition must be set to "Storefront API access: read."**
> If you miss this, the field exists, holds your data, and returns `null` to the site **with no error**. This is the single most likely thing to burn an afternoon.

`medium` and `edition_size` are **variant-level** because the three toy colorways have different mediums and independent edition runs of 33 each. Paintings carry theirs on their single default variant. See D-07.

### 5.2 Catalog — 4 products, 6 grid cards

**Product A — `Madbunny "Hello, World" Collectible`**
`year: 2026` · `dimensions_metric: 41 x 25 x 70 mm` · `dimensions_in: 1.6 x 1 x 2.75 in` · `scale: 100%` · `tier: Drop`
Option: `Color`

| Variant | `medium` | `edition_size` | Price |
|---|---|---|---|
| Bunny Black | Bunny Black paint on resin | 33 | $35 |
| Mad Red | Mad Red paint on resin | 33 | $35 |
| Gun Metal | Gun Metal paint on resin | 33 | $35 |

**Products B–D — paintings.** All share:
`year: 2026` · `dimensions_metric: 122 x 122 cm` · `dimensions_in: 48 x 48 in` · `scale: —` · `tier: Fine Art Edition` · `medium: Acrylic on wood` · `edition_size: 1`

| Title | Price | Inventory |
|---|---|---|
| MADOBANI | $6,400 | 1 |
| Mad 8 | $8,800 | 1 |
| Black Crescent | $7,800 | **0 (Sold)** |

Black Crescent is deliberately sold — it's the fixture for the sold-state work.

Collections: `collectibles` (A–D), `apparel` (empty in v1).

### 5.3 Admin setup checklist

- [ ] Create the 7 metafield definitions at the correct level
- [ ] Set **Storefront API access: read** on all 7
- [ ] Create Product A with a `Color` option and 3 variants
- [ ] Set per-variant `medium` and `edition_size`
- [ ] Set Product A inventory: 33 per variant
- [ ] Create Products B, C, D
- [ ] Set Black Crescent inventory to 0
- [ ] Upload placeholder images to all 4 products
- [ ] Create `collectibles` and `apparel` collections
- [ ] Create a Storefront API access token; put it in `.env.local`

---

## 6. Architecture

### 6.1 Product modal — intercepting routes

**The modal must own a URL.** Non-negotiable. See D-02.

```
app/
  collectibles/
    page.tsx                    grid
    [handle]/page.tsx           full product page
    @modal/
      (.)[handle]/page.tsx      intercepted → modal over grid
```

- Click a card → intercepted route → modal renders over the still-mounted grid
- Direct visit / refresh / shared link / crawler → full page at the same URL
- Both read the same product data and render the same detail component
- Back button closes the modal, not the page

**Variant-per-card:** Product A is one product but renders **three** grid cards, one per colorway. Each links to `/collectibles/hello-world?variant={id}`. This matches the mock (three cards in the top row) while keeping the data model correct. See D-08.

### 6.2 Data loading

Fetch **full product detail for every product in the collection query.** Not just card data.

The catalog is tiny (4 products). Prefetching everything means the modal opens with zero loading state — instant, no spinner. This is what makes it feel like a designed object instead of a web page.

This only works because the catalog is small. Past roughly 50 products, switch to fetch-on-click. Revisit then, not before.

### 6.3 Cart

Storefront API `cart` mutations → redirect to `cart.checkoutUrl`.

We do not build a checkout, handle payment, or touch card data. Shopify's hosted checkout gives PCI compliance, tax, Shop Pay, fraud screening, and international duties for free.

---

## 7. Page specs

### 7.1 `/` — Home

Landing page, not a gate — the nav is present on it.

- Nav: `COLLECTIBLES · APPAREL · [bunny mark] · ABOUT · JOIN THE CLUB` + Instagram icon. Bunny mark → `/`.
- Center: `bunny-metal` as a static `<img>` in a `<HeroBunny />` component
- `[ CLICK TO ENTER ]` → `/collectibles`
- Left: `NEW YORK, USA` / `DETROIT, USA` / live time
- Right: `SEOUL, KR` / live time
- Footer: `© 2026 Madbunny. All rights reserved.`

**3D is deferred.** `<HeroBunny />` wraps a static image so the R3F swap later touches one file. Don't inline the `<img>` into the page.

**Timezone counters — read this:**

- Derive time **and** offset label from `Intl.DateTimeFormat` with `America/New_York` and `Asia/Seoul`. Never hardcode the offset.
- NY and Detroit are the same zone (Eastern) and flip between GMT-5 and GMT-4 twice a year. Seoul is GMT+9 year-round, no DST.
- The mock reads `17 56 GMT-5` / `06 56 GMT+9`. **Those numbers are 13 hours apart, which is GMT-4.** The mock's label is wrong. Do not copy it.
- Must be **client-only** with a stable SSR placeholder, or React throws a hydration mismatch.

### 7.2 `/collectibles`

- Hero: `hero-360` video loop. `muted playsInline loop preload="metadata"` + poster. Static poster under `prefers-reduced-motion`. Left: `[ Hello, world ] collection`. Right: `available in limited numbers.`
- Splatink SVG heading: `Collectibles`
- 3-col square grid, 6 cards
- Card caption, three lines:
  ```
  {title}, {year}
  {medium}
  {dimensions_metric} / {dimensions_in}
  ```
- Click → modal (§6.1)

### 7.3 `/apparel`

Same spine as `/collectibles` + variant selection (size, colorway). Roughly 25% of the work — it reuses everything. Empty collection in v1; build the page, it renders zero cards.

### 7.4 `/about`

Static. Splatink SVG heading `About Madbunny` + `THE FOUNDING STORY`. Founder copy + two photos. No commerce.

### 7.5 `/jointheclub`

**Left — serial registration.** Field renders, accepts input, always rejects.

```ts
// Returns false unconditionally in v1. This is correct — see D-04.
// v2 swaps this body only. Everything around it is real.
async function validateSerial(code: string): Promise<boolean> {
  return false;
}
```

Rejection message, exactly: **`Not a valid serial.`**
No exclamation mark. Build the form, route, rate limiting, and error rendering for real.

**Right — email capture.** Functional.

Client → own API route (server-side) → **two** writes:
1. Shopify `customerCreate` with marketing consent — the real, sendable list
2. Append row to Google Sheet via **service account** (GCP service account, JSON key in env, sheet shared with the service account email)

A Sheet is a record, not a mailing list — you cannot send a drop announcement from a spreadsheet. Shopify is the list; the Sheet is Gia's working view. See D-09.

**Required on this endpoint:** honeypot field, IP rate limit, server-side email validation. A public POST that writes to a spreadsheet will be found by bots.

Never put Sheets or Shopify credentials in the browser. Never use an Apps Script public URL.

---

## 8. Modal content

### Collectibles / Fine Art Edition

| Slot | Source |
|---|---|
| Images | `media.nodes[]` — 3 |
| Title | `title` |
| Year | `custom.year` |
| Medium | variant `custom.medium` |
| Dimensions | `custom.dimensions_metric` + `custom.dimensions_in` |
| Edition | variant `custom.edition_size` → renders `Edition of 33` |
| Price | `priceRange.minVariantPrice` — **no cents** |
| Availability | `availableForSale` → `Available` / `Sold` |
| Color swatches | `options` → `Color` (Product A only) |
| Action | `Add to cart` |

`Edition of 33`, not `1 of 33`. `1 of 33` labels a specific physical unit; no unit is chosen on a product page. See D-10.

### Apparel

Adds: size pill row (sold-out sizes struck through), price updates on variant selection, `Add to cart` disabled until size chosen. Fit/fabric copy goes in `descriptionHtml`, not metafields. See D-11.

### Behaviour

| Rule | Value |
|---|---|
| Stock counter | **Hidden unless ≤ 3**, then `2 left`. See D-12. |
| Sold pieces | Stay live. Full modal, images intact, `Sold` replaces price, no button. See D-13. |
| Mobile | **No modal.** Route straight to the full product page. Same URL. See D-14. |
| Prices | No cents. `$35`, `$6,400`. |

---

## 9. Phases

**Phase 0 — Foundations.** No UI. Next.js scaffold, Tailwind + brand tokens, Geist Mono, assets into `/public`, Shopify Admin setup, Storefront client, first real query returning real data.

**Phase 1 — `/`.** Shell (nav, footer, mark→home), `<HeroBunny />` static, timezone counters, reduced-motion handling.

**Phase 2 — `/collectibles`.** The big one. Entire commerce spine: collection grid, intercepting-route modal, cart drawer, checkout handoff, sold state, variant-per-card.

**Phase 3 — `/apparel`.** Phase 2's spine + variants.

**Phase 4 — `/about`.** Static.

**Phase 5 — `/jointheclub`.** Two forms, one API route.

**Phase 6 — Ship requirements.** Privacy policy, terms, shipping, returns, 404, SEO metadata, OG images.

Phase 6 is not garnish. **Shopify checkout requires a refund and privacy policy**, and collecting emails without a privacy policy is a legal problem in several places MADBUNNY's customers live. The current footer has a copyright line and nothing else.

---

## 10. Decision log

Read before "fixing" anything.

**D-01 — Next.js, not Vite SPA.** Original plan was Vite + React SPA. A client-rendered SPA means product pages index slowly and unreliably, and shared links have no OG meta — they look like nothing in an Instagram DM. For a drop brand where DMs are the distribution channel, that's fatal. Same React 18 + TS + Tailwind + lucide-react; nothing lost.

**D-02 — The modal owns a URL.** Component state (`setOpen(true)`) would be simpler and is wrong. Without a URL: collectors can't share a piece, the back button closes the whole page, and Google indexes zero products.

**D-03 — Never build checkout.** Hosted Shopify checkout = PCI compliance, tax, Shop Pay, fraud screening, international duties, free.

**D-04 — `validateSerial()` always returns false. This is not a bug.** Serials are real and coming, but the generation and tracking system isn't built. The field is scaffolding so v2 is a one-function swap, not a redesign. Rejection copy is `Not a valid serial.` — no exclamation mark (brand rule), cold rather than chirpy (that's the point).
> ⚠️ **Open, non-code:** serial *format* is a manufacturing decision and must be locked before the first collection is produced — likely before v2. (a) Where does it live physically — object, box, or insert card? Box-only means a resold piece loses its identity. (b) Sequential `MB-001` is guessable; someone runs the first 500 in an afternoon. Needs entropy + checksum + a pre-generated list. Cheap now, impossible after 500 units are engraved.
> Note: an edition of 33 already numbers every unit. The edition number and the serial may be the same object — there may be less to invent than it looks.

**D-05 — Geist Mono.** The mocks introduced a monospace as a third face. Geist Mono is OFL, free, self-hosts via `next/font`. No license, no FOUT, no third-party request.

**D-06 — Splatink as SVG only.** Total display type on the site: `Collectibles`, `Apparel`, `About Madbunny`, `Join club Madbunny`. Four headings. Outlined SVG = no annual webfont license, no font file served, no FOUT, pixel-perfect kerning.
> ⚠️ **Outlining does not launder the license.** Greback's free Splatink is personal-use only. A commercial **desktop** license is still required — it's one-time rather than an annual pageview-metered webfont subscription, and it's the correct license for artwork-as-logo. Confirm it's held before these ship.

**D-07 — `medium` and `edition_size` are variant-level.** The three colorways have different mediums and independent runs of 33 each. A product-level field can't hold three values. Every Shopify product has ≥1 variant, so paintings work identically.

**D-08 — Variant-per-card.** Three colorways = one product, three cards. Matches the mock; keeps one product to maintain, per-colorway inventory, and a working swatch selector.

**D-09 — Shopify customer *and* Sheet.** A Sheet can't send email and doesn't record consent. Both writes, one route. Otherwise it's a migration later.

**D-10 — `Edition of 33`, not `1 of 33`.** `1 of 33` labels a physical unit. No unit is chosen on a product page.

**D-11 — Fit/fabric in `descriptionHtml`, not metafields.** Dropped for v1 velocity. `descriptionHtml` is already in the query and already renders — type the fit note into it. Structured fields are for filtering and sorting; that's not needed yet. Fit drives apparel returns, so the information should exist even if the field doesn't.

**D-12 — Stock counter hidden above 3.** A permanent `8 remaining` reads like Shopify. A number that only appears when it's nearly gone reads like the object is leaving. Same data, opposite feeling.

**D-13 — Sold pieces stay live.** Most of the catalog eventually. A wall of sold work is proof, and proof moves the next drop.

**D-14 — No modal on mobile.** A modal on a 380px screen is a full page with extra steps. Same URL, so it costs nothing.

**D-15 — 3D deferred.** The hero was specced as a cursor-driven R3F model with a real extruded mesh, texture maps, and an HDRI. Deferred to get scaffolding up. `<HeroBunny />` isolates the swap.
> Requires, when resumed: bunny silhouette as **true vector paths** (the current file is a raster PNG in an SVG wrapper — 1.7 MB of base64, zero paths, cannot be extruded); metal surface as texture maps (base color, **roughness** — roughness is what sells chrome); an HDRI env map. R3F loads dynamically, desktop only, static PNG fallback for mobile and `prefers-reduced-motion`.

---

## 11. Open

**Blocking nothing right now:**
- Is the `Core` tier dead, or just absent from these six? Tier is a raw string driving card treatment — lock it to fixed choices so `Fine Art Edition` and `Fine art edition` can't diverge.
- Splatink desktop license held?

**Blocks production, not development:**
- Real photography: Mad Red, Gun Metal, 3 paintings
- Apparel: hero shoot (the reference is Stüssy campaign photography — not usable), product shots, real catalog
- `/jointheclub` left image (the reference is a fashion campaign photo — not usable)
- Legal copy: privacy, terms, shipping, returns
- Google Sheet + GCP service account
- Art shipping: 48-inch paintings need crating and insured freight. Shopify flat rates won't cover it. Consider inquiry-only for Fine Art Edition rather than buy-now.

---

## 12. Copy fixes carried in

Corrected from the mocks — do not reintroduce:

| Mock | Correct |
|---|---|
| `FROM DETRIOT` | Detroit |
| `Madobany` | **MADOBANI** |
| `48 x 48 in)` | stray paren removed |
| `17 56 GMT-5` | derive from `Intl` — the mock's label is wrong |
| `Color: Multi-color` on paintings | dropped — paintings carry `medium`, not a color option |
