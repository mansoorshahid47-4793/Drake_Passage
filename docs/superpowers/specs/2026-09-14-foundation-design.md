# Drake Passage — Foundation Design

## Context

Drake Passage Pvt Limited is pivoting from a single-commodity Himalayan pink
salt export site (live at `https://drakepassagepvtltd.vercel.app/`) into a
multi-commodity export/import brand. Confirmed initial commodities: **Salt,
Rice, Potato, Tomato**, with more to be added by the client over time. The
company name ("Drake Passage") and current logo mark stay for now; a logo
refresh is a separate, later sub-project.

This is a ground-up rebuild — no source repo for the current site is
available to us, so this is a new Next.js project, not an edit to existing
code.

This document covers only the **Foundation** sub-project: the technical
backbone (repo, data model, site structure, routing, and a working contact
channel) that the homepage 3D product dial, real commodity content, and logo
refresh will be built on top of in later specs.

Client-supplied references for competitive/design direction: ZEH Co
International (zehcointernational.com), Bhandari Foods (bhandarifoods.com),
HAG Commodities (hagcommodities.com) — all Pakistan-based multi-commodity
exporters. Full visual-style takeaways are deferred to the later visual
design spec; the structural takeaways (per-category nav, header WhatsApp CTA,
dedicated Certifications page) are folded into this spec below.

### Findings from auditing the live site

- Entire copy (hero, About, product catalog, meta titles) is salt-specific
  ("Himalayan Pink Salt from Pakistan," "Mined at the source... Khewra Salt
  Mines"). This needs a full content rewrite, not incremental edits.
- **Routing bug:** direct navigation or refresh on `/about`, `/products`, or
  `/contact` returns a Vercel `404: NOT_FOUND`. Only in-app client-side nav
  clicks reach those pages. Breaks shared links, bookmarks, and SEO indexing.
- **Contact form is broken:** "Send your requirement" POSTs to
  `api.emailjs.com/api/v1.0/email/send-form` and receives an **HTTP 412**
  (invalid/misconfigured key). The UI shows no error — submissions silently
  vanish. This is a live business risk (lost leads) independent of the
  redesign.
- WhatsApp integration works today: a floating chat bubble site-wide plus a
  `wa.me` deep link with a prefilled message (`+92 304 740 9567`). This is
  worth preserving as-is.
- Contact email currently shown is a personal Gmail
  (`mansoorshahid47@gmail.com`). Per the client: keep as-is until they
  provide a real business address.
- No certifications should be invented. The current "COA Available / Food
  Safety Documented" badges are salt-specific claims; per the client, new
  copy states only verified certifications/documents, with placeholders left
  visibly marked otherwise.

## Goals

1. A Next.js project, deployable to Vercel, that statically generates every
   route (fixes the 404-on-direct-load bug).
2. A typed, data-driven product/category model that lets the client's
   growing commodity list (salt, rice, potato, tomato, and future items) be
   added as data, not code changes.
3. Site structure (Home, About, Products index + detail, Export Services,
   Insights, Contact) with shared layout (nav, footer, WhatsApp bubble)
   ported forward, content-neutral placeholders where real copy isn't
   written yet (real copy is a later spec).
4. A contact form that actually delivers submissions, with visible
   success/error feedback, replacing the broken EmailJS wiring. WhatsApp
   deep link and floating bubble preserved.
5. A build-time check that would have caught the 404 regression.

## Non-goals (deferred to later specs)

- The homepage 3D Coverflow Dial product selector (separate spec).
- Real researched commodity content/specs per item in the confirmed catalog
  (separate spec).
- Logo redesign (separate, parallel sub-project).
- Any CMS/backend for non-developer content editing.
- Analytics, blog/Insights content authoring workflow.

## Architecture

- **Framework:** Next.js (App Router), TypeScript, React.
- **Rendering:** Static generation for all routes (`generateStaticParams` for
  product detail pages). No server runtime requirements for v1 — this keeps
  hosting simple and directly fixes the direct-URL 404 bug, whose root cause
  is routes that aren't being prerendered/exported correctly on the current
  deployment.
- **Styling:** Tailwind CSS (fast to build a real design system on top of in
  the next spec, widely understood, works cleanly with Vercel).
- **Hosting:** Vercel, connected to a new GitHub repo (to be created).
- **Content:** No CMS. Product/category data lives in typed TypeScript data
  files in-repo (`/data/products/*.ts`). Adding a commodity is adding a data
  object; the door stays open to swap in a headless CMS later without
  changing page components, since pages will read from a thin data-access
  module rather than importing data files directly.

## Data model

```ts
type TradeTerm = "FOB" | "CIF";

interface ProductSpec {
  label: string;   // e.g. "Grade", "Grain size", "Broken %"
  value: string;
}

interface Certification {
  name: string;
  verified: true;         // only verified certs are ever added
  documentUrl?: string;
}

interface Product {
  slug: string;             // "1121-steam-single", "salt-lamp-natural-pink"
  name: string;
  category: string;         // top-level commodity: "Salt", "Rice", "Potato", "Onion", "Spices", ...
  subCategory?: string;     // use-case/variety grouping within a category —
                             // e.g. Salt: "Edible Salt" | "Cooking & Grilling" |
                             // "Table Products" | "Kitchen Products" | "Salt Lamps" |
                             // "Wellness" | "Home & Decor" | "Industrial";
                             // Rice: "Basmati" | "Non-Basmati"; Potato: "Red" | "White"
  tagline: string;
  summary: string;
  heroImage: string;
  specs: ProductSpec[];
  packagingOptions: string[];
  supportedTradeTerms: TradeTerm[];
  certifications: Certification[]; // [] until verified docs exist
}
```

Products are grouped by `category` (and, within a category, by `subCategory`
where present) for the Products index, per-category nav dropdown, and the
homepage dial; nothing in the UI hardcodes "salt/rice/potato" — it iterates
the data. This stays a flat list (no rigid multi-level tree), so the client
can add a new category, a new subCategory, or a one-off product at any time
without a schema change.

### Confirmed initial catalog (client-supplied)

| Category | Sub-categories / varieties |
|---|---|
| Salt | Edible Salt, Cooking & Grilling, Table Products, Kitchen Products, Salt Lamps, Wellness Products, Home & Decor, Industrial Products |
| Rice | Basmati (1121 Steam — Single/Double, 1847, 1509 Sella) and Non-Basmati (IRRI-6) |
| Potato | Red, White |
| Onion | — |
| Tomato | — |
| Spices | Turmeric Powder, Red Chilli Powder |

### Confirmed certifications (client-supplied, for `/certifications`)

1. ISO 9001
2. Halal Certification
3. Certificate of Origin
4. Certificate of Analysis (COA)
5. SGS Inspection
6. Phytosanitary Certificate

These are recorded as verified per the client, but publishing on the live
page still needs the actual certificate documents/numbers from the client
(scans or reference numbers) — the spec captures *which* certifications
exist, not the documents themselves.

## Site structure

| Route | Purpose |
|---|---|
| `/` | Hero, (later) Coverflow Dial, trust strip, CTAs |
| `/about` | Company story — rewritten to be commodity-neutral |
| `/products` | Index grid of all categories |
| `/products/[slug]` | Per-product detail page, driven by the data model |
| `/certifications` | Dedicated page for verified certifications/documents (see confirmed list below), per the "verified only" rule |
| `/services` | Export services / logistics process (largely commodity-agnostic, ports forward) |
| `/blog` | Insights — structure ports forward, content unchanged for now |
| `/contact` | Quote/sample request form + WhatsApp + phone/email |

Reference audit (ZEH Co, Bhandari Foods, HAG Commodities — all Pakistan
multi-commodity exporters) surfaced two structural patterns worth adopting
now rather than retrofitting later:

- **Per-category nav:** the header "Products" nav is category-driven (a
  dropdown listing each `category` from the data model — Salt, Rice, Potato,
  Tomato, ...) rather than a single flat link, so it scales with the
  client's growing commodity list without a nav redesign.
- **Header CTAs, not just a floating bubble:** the header includes a
  "WhatsApp Us" button next to "Get a Quote," in addition to (not instead
  of) the floating WhatsApp bubble. Both link to the same `wa.me` deep link.

Shared layout: header nav (with the category dropdown and dual CTAs above),
footer, floating WhatsApp bubble — ported from the current site, updated
only where copy is salt-specific.

## Contact form fix

- Fields carried forward: full name, business email, company, phone/
  WhatsApp, product (select, populated from the data model), destination,
  quantity, trade term, message.
- Submission handled by a Next.js server route (not a client-only
  third-party call), using a transactional email provider (e.g. Resend) to
  deliver to `mansoorshahid47@gmail.com`. If the client prefers to keep
  EmailJS, an alternative is reconfiguring it with a valid key — either way,
  the important fix is server-side delivery plus visible success/error
  state, so a failure is never silent again.
- WhatsApp floating bubble and `wa.me` deep link (with prefilled message)
  ported as-is.

## Testing

- `next build` must succeed and produce a static page for every route,
  including every `/products/[slug]`. This is a direct regression test for
  the 404 bug class.
- Manual pass before handoff: direct-load (not click-through) every nav
  route in a fresh browser tab; submit a real test enquiry and confirm it
  arrives by email.

## Open items for later specs

- Homepage Coverflow Dial implementation (design already agreed: drag/click
  through products, center item pops in 3D, click expands a detail card).
- Real, researched product content per commodity (grades, packaging, MOQ,
  Incoterms per item in the confirmed initial catalog above).
- Logo redesign: client supplied a reference
  (`docs/brand-references/logo-reference-dp-monogram.jpg`) — a "D/P"
  monogram built into a sailboat-on-waves shape, navy + teal. Direction for
  the later logo spec, not Foundation.
- Real business email to replace the personal Gmail placeholder.
