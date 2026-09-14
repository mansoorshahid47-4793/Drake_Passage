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
- Real researched commodity content/specs for rice, potato, tomato, etc.
  (separate spec, after the client's full category list arrives).
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
type TradeTerm = "FOB" | "CIF" | "CFR" | "EXW";

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
  slug: string;            // "himalayan-pink-salt", "basmati-rice"
  name: string;
  category: string;        // "Salt", "Rice", "Potato", "Tomato", ...
  tagline: string;
  summary: string;
  heroImage: string;
  specs: ProductSpec[];
  packagingOptions: string[];
  supportedTradeTerms: TradeTerm[];
  certifications: Certification[]; // [] until verified docs exist
}
```

Products are grouped by `category` for the Products index and the homepage
dial; nothing in the UI hardcodes "salt/rice/potato" — it iterates the data.

## Site structure

| Route | Purpose |
|---|---|
| `/` | Hero, (later) Coverflow Dial, trust strip, CTAs |
| `/about` | Company story — rewritten to be commodity-neutral |
| `/products` | Index grid of all categories |
| `/products/[slug]` | Per-product detail page, driven by the data model |
| `/services` | Export services / logistics process (largely commodity-agnostic, ports forward) |
| `/blog` | Insights — structure ports forward, content unchanged for now |
| `/contact` | Quote/sample request form + WhatsApp + phone/email |

Shared layout: header nav, footer, floating WhatsApp bubble — ported from
the current site, updated only where copy is salt-specific.

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

- Full commodity list beyond Salt/Rice/Potato/Tomato (client to provide).
- Homepage Coverflow Dial implementation (design already agreed: drag/click
  through products, center item pops in 3D, click expands a detail card).
- Real, researched product content per commodity.
- Logo redesign direction.
- Real business email to replace the personal Gmail placeholder.
