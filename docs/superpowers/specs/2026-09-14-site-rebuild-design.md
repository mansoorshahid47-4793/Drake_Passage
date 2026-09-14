# Drake Passage — Site Rebuild Design Spec

Status: reviewed design, ready for implementation planning.
Scope: the full site rebuild. Sections 1–6 are the Foundation (build first);
sections 7–12 layer design, pages, the product dial, forms, SEO and QA on top.
Deferred entirely: commodity copywriting research (own spec) and the logo
refresh (own track).

## 1. Context

Drake Passage Pvt Limited (Kasur, Punjab, Pakistan) is pivoting from a
single-commodity Himalayan pink salt export site
(`https://drakepassagepvtltd.vercel.app/`) into a multi-commodity export
company. The company name stays. A logo refresh is in scope as a separate
track; the client supplied a reference (`docs/brand-references/
logo-reference-dp-monogram.jpg`): a "D/P" monogram forming a sailboat on
waves, navy + teal.

This is a ground-up rebuild — no source for the current site is available —
in Next.js on Vercel, deployed from a new GitHub repo.

Client-supplied competitor references: ZEH Co International, Bhandari Foods,
HAG Commodities (all Pakistan multi-commodity exporters). Patterns adopted
from them: category-driven nav, a WhatsApp button in the header, a dedicated
Certifications page, full-bleed real commodity photography.

### Audit findings on the live site

- All copy, metadata and imagery are salt-specific. Full rewrite required.
- Direct load or refresh of `/about`, `/products`, `/contact` returns a Vercel
  `404: NOT_FOUND`; only in-app clicks reach them. Breaks shared links and SEO.
- The enquiry form POSTs to `api.emailjs.com` and gets **HTTP 412**; the UI
  shows no error. Every enquiry is silently lost today.
- WhatsApp works: floating bubble plus `wa.me/923047409567` deep link with a
  prefilled message. Preserve.
- Form labels are placeholder-only (accessibility gap). Fix.
- Visual tells to leave behind: tracked ALL-CAPS eyebrow labels, arrow-suffixed
  buttons, the scrolling marquee bar, six identical rounded process cards.

## 2. Confirmed business data (client-supplied)

**Catalog** — a flat product list with `category` and optional `subCategory`:

| Category | Sub-categories / varieties |
|---|---|
| Salt | Edible Salt, Cooking & Grilling, Table Products, Kitchen Products, Salt Lamps, Wellness Products, Home & Decor, Industrial Products |
| Rice | Basmati (1121 Steam — Single/Double, 1847, 1509 Sella); Non-Basmati (IRRI-6) |
| Potato | Red, White |
| Onion | — |
| Tomato | — |
| Spices | Turmeric Powder, Red Chilli Powder |

**Certifications** — ISO 9001 · Halal · Certificate of Origin · Certificate
of Analysis (COA) · SGS Inspection · Phytosanitary Certificate. The site lists
these as **"available on request"** (name + what it covers + "Request a copy"
link to the enquiry form); no scans or certificate numbers are published.

**Trade terms:** FOB or CIF only.
**Payment:** new buyers 100% advance; repeat buyers 70% advance, 30% against
BL copy.
**Samples:** dispatched by DHL or Leopard Courier only (replaces "DHL/FedEx").
**Contact:** +92 304 740 9567 (phone/WhatsApp) · `mansoorshahid47@gmail.com`
(keep until the client provides a business address) · Kasur, Punjab ·
Mon–Sat 09:00–18:00 PKT.

## 3. Goals and non-goals

Goals: every route statically generated and directly loadable; a data-driven
catalog where adding a commodity is adding data; a working, accessible
enquiry form that delivers email; the homepage product dial; a distinct,
modern visual identity built from the reference logo; AA accessibility;
strong Core Web Vitals; sound SEO.

Non-goals for this spec: CMS or admin UI; multilingual UI (English only;
structure should not block adding Urdu/Arabic later); blog authoring
workflow; analytics beyond a placeholder hook; the logo artwork itself;
commodity copy (structure and placeholders only — real copy comes from the
content spec).

## 4. Architecture

- Next.js App Router, TypeScript, React. Tailwind CSS with design tokens
  defined once as CSS variables and mapped into the Tailwind theme.
- Static generation for every route; `generateStaticParams` for product and
  category pages. One route handler (`/api/enquiry`) is the only server
  code. `next build` output must list every page as static.
- Fonts via `next/font` (self-hosted, zero layout shift). Images via
  `next/image` (AVIF/WebP, explicit dimensions, `priority` only above the fold).
- Content: typed data files under `/data` read through one thin
  `lib/catalog.ts` module (pages never import data files directly), so a CMS
  can replace the source later without touching pages.
- Motion: CSS transforms/transitions plus a small amount of React state. No
  WebGL/three.js. One optional dependency for spring physics (Framer Motion)
  if plain CSS transitions prove insufficient for the dial — decide in the
  plan, not ad hoc.
- Hosting: Vercel project linked to a new GitHub repo; preview deploy per
  PR; env vars for the email provider key.

## 5. Data model

```ts
type TradeTerm = "FOB" | "CIF";

interface ProductSpec { label: string; value: string; }   // "Grain length", "8.3 mm+"

interface Certification { name: string; verified: true; documentUrl?: string; }

interface Category {
  slug: string;            // "rice"
  name: string;            // "Rice"
  tagline: string;         // one line for the dial
  heroImage: string;
  subCategories: string[]; // display order for grouping; may be []
}

interface Product {
  slug: string;            // "basmati-1121-steam-single"
  name: string;
  category: string;        // Category.slug
  subCategory?: string;    // "Basmati" | "Salt Lamps" | "Red" ...
  tagline: string;
  summary: string;
  images: string[];        // first is primary; all same aspect ratio
  specs: ProductSpec[];
  packagingOptions: string[];
  moq?: string;
  supportedTradeTerms: TradeTerm[];
  certifications: Certification[];   // [] until verified docs exist
}
```

Company-level data (contact, hours, certifications, payment terms, courier
options) lives in `/data/company.ts` and feeds header, footer, Contact,
Services and Certifications pages from one place.

## 6. Information architecture

| Route | Purpose |
|---|---|
| `/` | Hero with product dial, proof strip, categories, export process, terms, sample kit, final CTA |
| `/products` | All categories, then products grouped by category and sub-category |
| `/products/[category]` | Category page: intro, sub-category groups, product list |
| `/products/[category]/[slug]` | Product detail: gallery, spec table, packaging, terms, quote CTA |
| `/certifications` | The six certifications, what each covers, "available on request" with a request link |
| `/services` | Export process, trade and payment terms, sample dispatch, logistics |
| `/about` | Company story rewritten commodity-neutral (origin regions, sourcing, team) |
| `/insights` | Articles index (structure only; content later). Old `/blog` redirects here |
| `/contact` | Enquiry form, WhatsApp, phone, email, office, hours |

Header: logo · Products (dropdown listing categories from data) · Certifications
· Export Services · About · Insights · Contact · **WhatsApp** button ·
**Get a quote** button. Both CTAs visible on mobile (WhatsApp as icon button,
quote as text). Floating WhatsApp bubble on every page, bottom-right, 56px.

Footer: contact block from `company.ts`, category links, certifications
links, legal line. No E-Catalog link until a new multi-commodity PDF exists.

## 7. Design system

**Direction.** A trading house, not a startup and not a luxury brand. Calm,
navy-anchored, with teal as the only signal color. Real photographs of the
commodities do the emotional work; the interface stays quiet so the product
dial can be the one bold moment.

**Color tokens** (light theme only for v1):

| Token | Hex | Use |
|---|---|---|
| `--navy` | `#0B2545` | primary surfaces (header on scroll, dark bands), headings on light |
| `--teal` | `#0F8286` | CTAs, links, focus ring, dial highlight — 4.6:1 on white |
| `--teal-bright` | `#22B8BC` | decorative only (wave motif, icons on navy) — never as text on white |
| `--salt` | `#F4F7F6` | page background |
| `--ink` | `#14202E` | body text |
| `--line` | `#D5DCDA` | borders, table rules |
| `--muted` | `#5B6B7A` | secondary text — 4.9:1 on `--salt` |
| `--danger` | `#B42318` | form errors |
| `--success` | `#1B7F4C` | form success |

White (`#FFFFFF`) for cards/tables on `--salt`; `--salt` text on `--navy`.
No gold, no cream/terracotta, no gradients as decoration.

**Type.** Fraunces (display; weights 500/600; optical size on) for h1–h3 and
pull numbers; Source Sans 3 (400/600, tabular numerals enabled) for body, UI,
tables. Scale (desktop / mobile): h1 56/36, h2 40/28, h3 26/22, body 18/17,
small 15, line-height 1.15 display / 1.55 body. Max measure 70ch. Sentence
case everywhere; no all-caps tracked labels; no monospace for data.

**Spacing and layout.** 12-column grid, 1280px max, 24px gutters (16px on
mobile). Section rhythm 96px desktop / 64px mobile. Radius: 4px on inputs
and buttons, 12px on image tiles, none on tables. Shadows only on the dial's
center item and the sticky header.

**Components.** Buttons (primary teal/white, secondary outline navy, WhatsApp
uses WhatsApp green `#25D366` with navy text — the one brand-external color);
inputs with visible labels above, 44px min height; spec table (zebra-free,
rules from `--line`, tabular figures); category tile (photo, name, count,
sub-category chips); certification row (name, what it covers, "Request a copy"
link); process step (numbered — this is a real sequence).

**Motion.** One orchestrated page-load moment: hero copy settles, then the
dial's center item comes forward. Everything else moves only in response to
the user (dial navigation, dropdown, panel expand, form states). Durations
from tokens: 160ms micro, 280ms component, 420ms dial; ease-out on entry,
faster on exit. `prefers-reduced-motion`: no 3D, no page-load sequence,
instant state swaps.

**Imagery.** Full-bleed photographs of the actual commodities (salt crystals,
basmati grains, red/white potatoes, onions, tomatoes, turmeric/chilli powder)
and of packing/loading where available. No stock handshakes, globes or
container-ship clichés. Every image has alt text describing the product.

## 8. Homepage

Order (Trust & Authority pattern): hero → proof → categories → process →
terms → sample kit → final CTA.

1. **Hero.** Asymmetric: headline and one-paragraph summary left (5 cols),
   product dial right (7 cols); stacked on mobile with the dial after the
   headline. Draft headline options for the content spec: "Salt, rice and
   fresh produce from Pakistan, packed to your spec" / "From the Khewra mines
   and the Punjab plains to your port". CTAs: "Get a quote" (teal), "Chat on
   WhatsApp" (green). No stat counters — nothing invented.
2. **Proof strip.** The six certifications as a single row of name + one-line
   scope, marked "available on request" (no logos or scans), plus office
   location and hours.
3. **Categories.** Six photo tiles from data, each linking to its category page.
4. **How an order works.** Numbered steps: enquiry → quote (FOB/CIF) → sample
   (DHL/Leopard) → contract and advance → quality checks and documents →
   shipment → balance against BL copy (repeat buyers).
5. **Terms at a glance.** Navy band: trade terms, payment terms, sample
   courier options. Plain text, two columns.
6. **Sample kit.** Generalised from the current "Sample Box": request samples
   of any category; dispatched by DHL or Leopard.
7. **Final CTA + footer.**

## 9. Product dial (agreed: Coverflow Dial)

- Component `ProductDial` (client). Items = the six categories from data
  (category-level, not individual SKUs), each with image, name, tagline.
- Layout: center item scale 1.0 and forward; neighbours at 0.82 scale,
  rotated ±28° on Y, 60% opacity; third-order items 0.7 scale, 30% opacity;
  others hidden. Container reserves fixed height per breakpoint (no CLS).
- Controls: previous/next buttons (44×44, always visible), keyboard arrows
  when the region has focus, pointer drag/swipe with snap to nearest item.
  No autoplay.
- Selecting the center item expands a panel below the dial (not a modal):
  sub-category chips, up to six product links, "See all {category}" and
  "Get a quote for {category}" (prefills `/contact?category=...`).
- Accessibility: region with `aria-roledescription="carousel"`, each item a
  labelled group ("3 of 6, Potato"), a polite live region announcing the
  current item, focus stays on the control that was used, panel content is
  in DOM order after the dial. Reduced motion: no rotation or scaling —
  items swap instantly, or on the smallest screens render as a plain
  two-column tile grid.
- Performance: `next/image` at 4:3, `priority` on the initial center image
  only; transforms only (no width/height animation); pause pointer listeners
  when off-screen.

## 10. Enquiry form and email

Fields: full name, business email, company, phone/WhatsApp, category
(select from data), product (select filtered by category, optional),
destination country, quantity with unit, trade term (FOB/CIF), message,
enquiry type (quote / sample). `?category=` and `?inquiry=sample` prefill.

Behaviour: labels visible above inputs; validation on blur plus on submit;
inline error under the field via `aria-describedby`; on failed submit, focus
moves to an error summary that links to each field; submit shows loading,
then a success state with a WhatsApp fallback link, or a specific error.
Honeypot field and per-IP rate limit in the route handler.

Delivery: `/api/enquiry` route handler → email provider. Default provider is
Web3Forms (delivers to any address without domain verification — the client
has no custom domain yet); switch to Resend once a domain exists. Provider
lives behind one `sendEnquiry()` function so the swap is one file. Recipient
and keys come from env vars, never from the client bundle.

## 11. SEO, performance, accessibility

- Metadata API per page; `generateMetadata` for category and product pages;
  titles and descriptions commodity-neutral ("Drake Passage — Salt, rice and
  fresh produce exporters, Pakistan"). OpenGraph image per page type.
  `sitemap.xml`, `robots.txt`, canonical URLs, JSON-LD `Organization` on the
  home page and `Product` on product pages. `/blog` → `/insights` redirect.
- Targets: Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility; CLS < 0.1;
  LCP is the hero image or headline, not the dial.
- WCAG 2.2 AA: 4.5:1 text contrast, visible focus (teal ring, 2px offset),
  skip link, 44px targets, keyboard-complete dial and dropdown, reduced
  motion honoured, no information by color alone.
- Breakpoints verified at 375, 768, 1024, 1440; no horizontal scroll.

## 12. Testing and QA

- `next build` succeeds and lists every route (including each category and
  product) as static — regression guard for the 404 class.
- Direct-load every nav route in a fresh tab. Refresh on a product page.
- Keyboard-only pass: header dropdown, dial, form. Screen-reader spot check
  of the dial announcements and form errors.
- Reduced-motion pass with the OS setting on.
- Submit a real enquiry and confirm the email arrives; submit an invalid one
  and confirm the error summary and inline errors.
- Screenshots at the four breakpoints reviewed against this spec.
- axe (or equivalent) reports no serious/critical issues.

## 13. Implementation phases and model routing

1. **Scaffold** — repo, Next.js, Tailwind tokens, fonts, data model with the
   confirmed catalog, layout shell (header/footer/WhatsApp), all routes with
   structural placeholders, static build check. *Sonnet.*
2. **Pages** — home (without dial), products index/category/detail,
   certifications, services, about, insights, contact layout. *Sonnet.*
3. **Product dial** — interaction, accessibility, reduced motion. *Fable/Opus
   (interaction-heavy; review with screenshots).*
4. **Enquiry form + email route** — validation, states, Web3Forms, rate
   limit. *Sonnet.*
5. **SEO, performance, accessibility QA** — section 11/12 checklist. *Sonnet.*
6. **Deploy** — GitHub repo, Vercel project, env vars, preview + production.
   *Sonnet with the Vercel plugin.*
7. **Content spec** (separate): researched copy and specs per product,
   photography list. *Sonnet with web research; Fable to edit copy.*
8. **Logo refresh** (separate track): concepts from the reference monogram.
   *Image tooling (brandkit/Higgsfield) then Fable to select and adapt.*

## 14. Open items

- Custom domain: does the client own one? Affects email provider choice and
  final URLs.
- Real business email to replace the Gmail placeholder.
- Product photography: client-supplied or licensed stock of the actual
  commodities (no generic imagery).
- Company founding year and any other facts for About (nothing invented).
- New multi-commodity catalog PDF (the old salt catalog link is dropped).
