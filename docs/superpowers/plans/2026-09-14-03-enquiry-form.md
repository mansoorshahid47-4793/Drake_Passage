# Enquiry Form Implementation Plan (Plan 3 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A working, accessible enquiry form that validates on the client and server, delivers email through a swappable provider (Web3Forms first), and never fails silently.

**Architecture:** Shared validation in `src/lib/enquiry.ts` used by both the client form and the `/api/enquiry` route handler. The route handler is the only server code; it checks a honeypot, rate-limits per IP, validates, and calls `sendEnquiry()` from `src/lib/email.ts`. The form is a client component; URL prefill is read with `useSearchParams` inside `Suspense` so the contact page stays static.

**Tech Stack:** Next.js route handler, `fetch` to Web3Forms, React client component, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-14-site-rebuild-design.md` §10 (and §11 accessibility). Requires Plan 1.

## Global Constraints

- Fields: full name, business email, company, phone/WhatsApp, category (from data), product (filtered by category, optional), destination country, quantity with unit, trade term (FOB/CIF), message, enquiry type (quote / sample / certificate).
- Visible labels above inputs; inline error under the field via `aria-describedby`; on failed submit focus moves to an error summary linking each field; loading → success (with WhatsApp fallback) or a specific error.
- Env vars only: `WEB3FORMS_ACCESS_KEY` (server). Keys never reach the client bundle.
- The contact page must remain statically prerendered (`npm run check:static` still passes).
- Rate limit: 5 submissions per IP per 10 minutes (in-memory; acceptable per-instance on Vercel).

---

## File structure

```
src/lib/enquiry.ts            types, ENQUIRY_TYPES, validateEnquiry()
src/lib/email.ts              sendEnquiry() → Web3Forms
src/lib/rateLimit.ts          allow(ip) sliding window
src/app/api/enquiry/route.ts  POST handler
src/components/contact/EnquiryForm.tsx      client form
src/components/contact/EnquiryFormLoader.tsx Suspense + useSearchParams prefill
src/app/contact/page.tsx      renders the loader in the #enquiry slot
tests next to each module
.env.example
```

---

### Task 1: Validation module

**Files:**
- Create: `src/lib/enquiry.ts`, `.env.example`
- Test: `src/lib/enquiry.test.ts`

**Interfaces:**
- Produces:
  - `ENQUIRY_TYPES = ["quote", "sample", "certificate"] as const`; `EnquiryType`.
  - `EnquiryInput { fullName; email; company; phone; category; product; destination; quantity; tradeTerm; message; enquiryType }` (all strings).
  - `validateEnquiry(input: Partial<EnquiryInput>, categorySlugs: string[]): { ok: true; value: EnquiryInput } | { ok: false; errors: Partial<Record<keyof EnquiryInput, string>> }`.
  - `ENQUIRY_FIELDS: (keyof EnquiryInput)[]` in display order.

- [ ] **Step 1: Write the failing test `src/lib/enquiry.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { validateEnquiry } from "@/lib/enquiry";

const good = {
  fullName: "Amina Khan", email: "amina@importco.ae", company: "ImportCo", phone: "+971 50 000 0000",
  category: "rice", product: "irri-6", destination: "United Arab Emirates", quantity: "2 x 40ft containers",
  tradeTerm: "CIF", message: "Please quote IRRI-6, 25kg PP bags, Jebel Ali.", enquiryType: "quote",
};
const cats = ["salt", "rice"];

describe("validateEnquiry", () => {
  it("accepts a complete enquiry and trims strings", () => {
    const r = validateEnquiry({ ...good, fullName: "  Amina Khan " }, cats);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.fullName).toBe("Amina Khan");
  });
  it("reports one message per invalid required field", () => {
    const r = validateEnquiry({ ...good, fullName: "A", email: "nope", category: "gold", tradeTerm: "EXW", message: "short", enquiryType: "x" }, cats);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["category", "email", "enquiryType", "fullName", "message", "tradeTerm"]);
      expect(r.errors.email).toBe("Enter a valid email address");
    }
  });
  it("allows company, phone and product to be empty", () => {
    const r = validateEnquiry({ ...good, company: "", phone: "", product: "" }, cats);
    expect(r.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm test` → FAIL.

- [ ] **Step 3: Create `src/lib/enquiry.ts`**

```ts
export const ENQUIRY_TYPES = ["quote", "sample", "certificate"] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
export const TRADE_TERMS = ["FOB", "CIF"] as const;

export interface EnquiryInput {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  category: string;
  product: string;
  destination: string;
  quantity: string;
  tradeTerm: string;
  message: string;
  enquiryType: string;
}

export const ENQUIRY_FIELDS: (keyof EnquiryInput)[] = [
  "enquiryType", "fullName", "email", "company", "phone", "category", "product", "destination", "quantity", "tradeTerm", "message",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ValidationResult =
  | { ok: true; value: EnquiryInput }
  | { ok: false; errors: Partial<Record<keyof EnquiryInput, string>> };

export function validateEnquiry(input: Partial<EnquiryInput>, categorySlugs: string[]): ValidationResult {
  const v = Object.fromEntries(ENQUIRY_FIELDS.map((k) => [k, (input[k] ?? "").toString().trim()])) as EnquiryInput;
  const errors: Partial<Record<keyof EnquiryInput, string>> = {};

  if (!(ENQUIRY_TYPES as readonly string[]).includes(v.enquiryType)) errors.enquiryType = "Choose what you are asking for";
  if (v.fullName.length < 2) errors.fullName = "Enter your full name";
  if (!EMAIL.test(v.email)) errors.email = "Enter a valid email address";
  if (!categorySlugs.includes(v.category)) errors.category = "Choose a product category";
  if (v.destination.length < 2) errors.destination = "Enter the destination country or port";
  if (v.quantity.length < 1) errors.quantity = "Enter the quantity, for example 2 x 40ft containers";
  if (!(TRADE_TERMS as readonly string[]).includes(v.tradeTerm)) errors.tradeTerm = "Choose FOB or CIF";
  if (v.message.length < 10) errors.message = "Add a few details so we can quote accurately";
  if (v.message.length > 4000) errors.message = "Keep the message under 4000 characters";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: v };
}
```

- [ ] **Step 4: Create `.env.example`**

```
# Web3Forms access key (create at web3forms.com with the recipient email; the key decides the recipient)
WEB3FORMS_ACCESS_KEY=
# Public site URL for sitemap/robots/OG
NEXT_PUBLIC_SITE_URL=https://drakepassagepvtltd.vercel.app
```

- [ ] **Step 5: Run tests** — `npm test` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/enquiry.ts src/lib/enquiry.test.ts .env.example
git commit -m "feat(enquiry): shared validation"
```

---

### Task 2: Email provider, rate limit and route handler

**Files:**
- Create: `src/lib/email.ts`, `src/lib/rateLimit.ts`, `src/app/api/enquiry/route.ts`
- Test: `src/lib/rateLimit.test.ts`, `src/app/api/enquiry/route.test.ts`

**Interfaces:**
- Produces:
  - `sendEnquiry(value: EnquiryInput): Promise<{ ok: true } | { ok: false; reason: string }>`
  - `allow(key: string, now = Date.now()): boolean` (5 per 600 000 ms)
  - `POST /api/enquiry` JSON body = `EnquiryInput & { botcheck?: string }` → `200 { ok: true }` | `400 { ok: false, errors }` | `429 { ok: false, error }` | `502 { ok: false, error }`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/rateLimit.test.ts
import { describe, it, expect } from "vitest";
import { allow, _reset } from "@/lib/rateLimit";

describe("rateLimit", () => {
  it("allows five then blocks within the window, then allows after it", () => {
    _reset();
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(allow("1.1.1.1", t + i)).toBe(true);
    expect(allow("1.1.1.1", t + 10)).toBe(false);
    expect(allow("2.2.2.2", t + 10)).toBe(true);
    expect(allow("1.1.1.1", t + 600_001)).toBe(true);
  });
});
```

```ts
// src/app/api/enquiry/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { _reset } from "@/lib/rateLimit";

vi.mock("@/lib/email", () => ({ sendEnquiry: vi.fn(async () => ({ ok: true })) }));
import { sendEnquiry } from "@/lib/email";
import { POST } from "@/app/api/enquiry/route";

const good = {
  fullName: "Amina Khan", email: "amina@importco.ae", company: "", phone: "", category: "rice", product: "",
  destination: "UAE", quantity: "1 container", tradeTerm: "FOB", message: "Please quote IRRI-6 in 25kg bags.", enquiryType: "quote",
};
const req = (body: unknown, ip = "9.9.9.9") =>
  new Request("http://localhost/api/enquiry", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) });

describe("POST /api/enquiry", () => {
  beforeEach(() => { _reset(); vi.mocked(sendEnquiry).mockClear(); });

  it("sends a valid enquiry", async () => {
    const res = await POST(req(good));
    expect(res.status).toBe(200);
    expect(sendEnquiry).toHaveBeenCalledOnce();
  });
  it("returns field errors for an invalid body", async () => {
    const res = await POST(req({ ...good, email: "bad" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors.email).toBeDefined();
    expect(sendEnquiry).not.toHaveBeenCalled();
  });
  it("silently accepts bots that fill the honeypot", async () => {
    const res = await POST(req({ ...good, botcheck: "spam" }));
    expect(res.status).toBe(200);
    expect(sendEnquiry).not.toHaveBeenCalled();
  });
  it("rate limits the sixth request from one IP", async () => {
    for (let i = 0; i < 5; i++) await POST(req(good, "5.5.5.5"));
    const res = await POST(req(good, "5.5.5.5"));
    expect(res.status).toBe(429);
  });
});
```

- [ ] **Step 2: Run to verify they fail** — `npm test` → FAIL.

- [ ] **Step 3: Create `src/lib/rateLimit.ts`**

```ts
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

export function allow(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) { hits.set(key, recent); return false; }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function _reset() { hits.clear(); }
```

- [ ] **Step 4: Create `src/lib/email.ts`**

```ts
import type { EnquiryInput } from "@/lib/enquiry";

export async function sendEnquiry(v: EnquiryInput): Promise<{ ok: true } | { ok: false; reason: string }> {
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) return { ok: false, reason: "WEB3FORMS_ACCESS_KEY is not set" };

  const subject = `${v.enquiryType === "sample" ? "Sample request" : v.enquiryType === "certificate" ? "Certificate request" : "Quote request"}: ${v.category}${v.product ? ` / ${v.product}` : ""}`;
  const body = {
    access_key: key,
    subject,
    from_name: "Drake Passage website",
    name: v.fullName,
    email: v.email,
    company: v.company,
    phone: v.phone,
    category: v.category,
    product: v.product,
    destination: v.destination,
    quantity: v.quantity,
    trade_term: v.tradeTerm,
    message: v.message,
  };

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { success?: boolean; message?: string };
    return data.success ? { ok: true } : { ok: false, reason: data.message ?? `Provider returned ${res.status}` };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "Network error" };
  }
}
```

- [ ] **Step 5: Create `src/app/api/enquiry/route.ts`**

```ts
import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/enquiry";
import { sendEnquiry } from "@/lib/email";
import { allow } from "@/lib/rateLimit";
import { getCategories } from "@/lib/catalog";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Try again in a few minutes or use WhatsApp." }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 }); }

  if (typeof body.botcheck === "string" && body.botcheck.length > 0) return NextResponse.json({ ok: true });

  const result = validateEnquiry(body as Record<string, string>, getCategories().map((c) => c.slug));
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });

  const sent = await sendEnquiry(result.value);
  if (!sent.ok) {
    console.error("enquiry delivery failed:", sent.reason);
    return NextResponse.json({ ok: false, error: "We could not send your enquiry. Please try again or message us on WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Run tests** — `npm test` → PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/email.ts src/lib/rateLimit.ts src/lib/rateLimit.test.ts src/app/api
git commit -m "feat(enquiry): route handler with honeypot, rate limit and Web3Forms delivery"
```

---

### Task 3: Client form with validation states and prefill

**Files:**
- Create: `src/components/contact/EnquiryForm.tsx`, `src/components/contact/EnquiryFormLoader.tsx`
- Modify: `src/app/contact/page.tsx`
- Test: `src/components/contact/EnquiryForm.test.tsx`

**Interfaces:**
- Consumes: `validateEnquiry`, `ENQUIRY_TYPES`, `TRADE_TERMS` from `@/lib/enquiry`; `whatsAppUrl` from `@/lib/whatsapp`.
- Produces: `<EnquiryForm categories={{slug,name,products:{slug,name}[]}[]} initial={Partial<EnquiryInput>} />`; `<EnquiryFormLoader categories />` (reads `?category=&product=&inquiry=`; `inquiry=sample|certificate` maps to `enquiryType`).

- [ ] **Step 1: Write the failing test `EnquiryForm.test.tsx`**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EnquiryForm } from "@/components/contact/EnquiryForm";

const categories = [
  { slug: "rice", name: "Rice", products: [{ slug: "irri-6", name: "IRRI-6" }] },
  { slug: "salt", name: "Salt", products: [] },
];

describe("EnquiryForm", () => {
  beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });

  it("shows an error summary and inline errors on empty submit, and focuses the summary", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{}} />);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
    expect(summary).toHaveTextContent("Enter your full name");
    const name = screen.getByLabelText("Full name");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Enter your full name");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("prefills from initial values and filters products by category", () => {
    render(<EnquiryForm categories={categories} initial={{ category: "rice", product: "irri-6", enquiryType: "sample" }} />);
    expect(screen.getByLabelText("Product category")).toHaveValue("rice");
    expect(screen.getByLabelText("Product (optional)")).toHaveValue("irri-6");
    expect(screen.getByLabelText("What are you asking for?")).toHaveValue("sample");
  });

  it("submits valid data and shows success", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{ category: "rice" }} />);
    await user.type(screen.getByLabelText("Full name"), "Amina Khan");
    await user.type(screen.getByLabelText("Business email"), "amina@importco.ae");
    await user.type(screen.getByLabelText("Destination country or port"), "Jebel Ali");
    await user.type(screen.getByLabelText("Quantity"), "1 x 40ft");
    await user.selectOptions(screen.getByLabelText("Trade term"), "CIF");
    await user.type(screen.getByLabelText("Message"), "Please quote IRRI-6 in 25kg bags.");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Enquiry sent"));
    expect(fetch).toHaveBeenCalledWith("/api/enquiry", expect.objectContaining({ method: "POST" }));
  });

  it("shows the server error and a WhatsApp fallback when delivery fails", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: false, error: "We could not send your enquiry." }), { status: 502 }));
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{ category: "rice" }} />);
    await user.type(screen.getByLabelText("Full name"), "Amina Khan");
    await user.type(screen.getByLabelText("Business email"), "amina@importco.ae");
    await user.type(screen.getByLabelText("Destination country or port"), "Jebel Ali");
    await user.type(screen.getByLabelText("Quantity"), "1 x 40ft");
    await user.selectOptions(screen.getByLabelText("Trade term"), "FOB");
    await user.type(screen.getByLabelText("Message"), "Please quote IRRI-6 in 25kg bags.");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not send your enquiry.");
    expect(screen.getByRole("link", { name: "Send it on WhatsApp instead" })).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm test` → FAIL.

- [ ] **Step 3: Create `EnquiryForm.tsx`**

```tsx
"use client";

import { useId, useRef, useState } from "react";
import { ENQUIRY_FIELDS, ENQUIRY_TYPES, TRADE_TERMS, validateEnquiry, type EnquiryInput } from "@/lib/enquiry";
import { whatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

export type FormCategory = { slug: string; name: string; products: { slug: string; name: string }[] };

type Errors = Partial<Record<keyof EnquiryInput, string>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed"; message: string };

const LABELS: Record<keyof EnquiryInput, string> = {
  enquiryType: "What are you asking for?",
  fullName: "Full name",
  email: "Business email",
  company: "Company (optional)",
  phone: "Phone or WhatsApp (optional)",
  category: "Product category",
  product: "Product (optional)",
  destination: "Destination country or port",
  quantity: "Quantity",
  tradeTerm: "Trade term",
  message: "Message",
};

const TYPE_LABELS: Record<(typeof ENQUIRY_TYPES)[number], string> = { quote: "A price quote", sample: "A sample", certificate: "A copy of a certificate" };

const empty: EnquiryInput = { enquiryType: "quote", fullName: "", email: "", company: "", phone: "", category: "", product: "", destination: "", quantity: "", tradeTerm: "", message: "" };

export function EnquiryForm({ categories, initial }: { categories: FormCategory[]; initial: Partial<EnquiryInput> }) {
  const [values, setValues] = useState<EnquiryInput>({ ...empty, ...initial });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const fid = (k: keyof EnquiryInput) => `${id}-${k}`;
  const eid = (k: keyof EnquiryInput) => `${id}-${k}-error`;
  const products = categories.find((c) => c.slug === values.category)?.products ?? [];

  const set = (k: keyof EnquiryInput, v: string) => {
    setValues((s) => ({ ...s, [k]: v, ...(k === "category" ? { product: "" } : {}) }));
  };

  const validateField = (k: keyof EnquiryInput) => {
    const r = validateEnquiry(values, categories.map((c) => c.slug));
    setErrors((e) => ({ ...e, [k]: r.ok ? undefined : r.errors[k] }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const r = validateEnquiry(values, categories.map((c) => c.slug));
    if (!r.ok) {
      setErrors(r.errors);
      setStatus({ kind: "idle" });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    const botcheck = (form.elements.namedItem("botcheck") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...r.value, botcheck }) });
      const data = (await res.json()) as { ok: boolean; error?: string; errors?: Errors };
      if (res.ok && data.ok) { setStatus({ kind: "sent" }); return; }
      if (data.errors) { setErrors(data.errors); setStatus({ kind: "idle" }); requestAnimationFrame(() => summaryRef.current?.focus()); return; }
      setStatus({ kind: "failed", message: data.error ?? "We could not send your enquiry." });
    } catch {
      setStatus({ kind: "failed", message: "We could not send your enquiry. Check your connection and try again." });
    }
  };

  const errorList = ENQUIRY_FIELDS.filter((k) => errors[k]);
  const field = (k: keyof EnquiryInput, control: React.ReactNode) => (
    <div>
      <label htmlFor={fid(k)} className="mb-1 block font-semibold">{LABELS[k]}</label>
      {control}
      {errors[k] && <p id={eid(k)} className="mt-1 mb-0 text-[15px] text-danger">{errors[k]}</p>}
    </div>
  );
  const inputClass = "w-full min-h-11 rounded-control border border-line bg-white px-3 py-2 aria-[invalid=true]:border-danger";
  const a11y = (k: keyof EnquiryInput) => ({ id: fid(k), "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? eid(k) : undefined });

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-tile border border-success bg-white p-6">
        <h2 className="text-success">Enquiry sent</h2>
        <p className="mt-2">We reply within one business day. For anything urgent, message us on WhatsApp.</p>
        <div className="mt-4"><Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button></div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {errorList.length > 0 && (
        <div ref={summaryRef} role="alert" tabIndex={-1} className="rounded-control border border-danger bg-white p-4">
          <p className="m-0 font-semibold">Check these fields</p>
          <ul className="mt-2 mb-0 list-disc pl-5">
            {errorList.map((k) => <li key={k}><a href={`#${fid(k)}`} className="text-danger">{errors[k]}</a></li>)}
          </ul>
        </div>
      )}
      {status.kind === "failed" && (
        <div role="alert" className="rounded-control border border-danger bg-white p-4">
          <p className="m-0">{status.message}</p>
          <p className="mt-2 mb-0"><a href={whatsAppUrl(`Enquiry: ${values.category} ${values.product}`.trim())} target="_blank" rel="noopener noreferrer">Send it on WhatsApp instead</a></p>
        </div>
      )}

      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" defaultValue="" />

      {field("enquiryType", (
        <select {...a11y("enquiryType")} value={values.enquiryType} onChange={(e) => set("enquiryType", e.target.value)} className={inputClass}>
          {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
        </select>
      ))}
      <div className="grid gap-5 sm:grid-cols-2">
        {field("fullName", <input {...a11y("fullName")} value={values.fullName} onChange={(e) => set("fullName", e.target.value)} onBlur={() => validateField("fullName")} autoComplete="name" className={inputClass} />)}
        {field("email", <input {...a11y("email")} type="email" value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => validateField("email")} autoComplete="email" className={inputClass} />)}
        {field("company", <input {...a11y("company")} value={values.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" className={inputClass} />)}
        {field("phone", <input {...a11y("phone")} type="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" className={inputClass} />)}
        {field("category", (
          <select {...a11y("category")} value={values.category} onChange={(e) => set("category", e.target.value)} onBlur={() => validateField("category")} className={inputClass}>
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        ))}
        {field("product", (
          <select {...a11y("product")} value={values.product} onChange={(e) => set("product", e.target.value)} disabled={products.length === 0} className={inputClass}>
            <option value="">{products.length ? "Any product in this category" : "Choose a category first"}</option>
            {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        ))}
        {field("destination", <input {...a11y("destination")} value={values.destination} onChange={(e) => set("destination", e.target.value)} onBlur={() => validateField("destination")} className={inputClass} />)}
        {field("quantity", <input {...a11y("quantity")} value={values.quantity} onChange={(e) => set("quantity", e.target.value)} onBlur={() => validateField("quantity")} placeholder="e.g. 2 x 40ft containers or 25 MT" className={inputClass} />)}
        {field("tradeTerm", (
          <select {...a11y("tradeTerm")} value={values.tradeTerm} onChange={(e) => set("tradeTerm", e.target.value)} onBlur={() => validateField("tradeTerm")} className={inputClass}>
            <option value="">Choose FOB or CIF</option>
            {TRADE_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        ))}
      </div>
      {field("message", <textarea {...a11y("message")} value={values.message} onChange={(e) => set("message", e.target.value)} onBlur={() => validateField("message")} rows={5} className={inputClass} />)}
      <Button type="submit" disabled={status.kind === "sending"}>{status.kind === "sending" ? "Sending…" : "Send enquiry"}</Button>
    </form>
  );
}
```

- [ ] **Step 4: Create `EnquiryFormLoader.tsx`**

```tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EnquiryForm, type FormCategory } from "./EnquiryForm";

function Inner({ categories }: { categories: FormCategory[] }) {
  const sp = useSearchParams();
  const inquiry = sp.get("inquiry");
  const initial = {
    category: sp.get("category") ?? "",
    product: sp.get("product") ?? "",
    enquiryType: inquiry === "sample" || inquiry === "certificate" ? inquiry : "quote",
    message: inquiry === "certificate" && sp.get("name") ? `Please send a copy of: ${sp.get("name")}` : "",
  };
  return <EnquiryForm categories={categories} initial={initial} />;
}

export function EnquiryFormLoader({ categories }: { categories: FormCategory[] }) {
  return (
    <Suspense fallback={<EnquiryForm categories={categories} initial={{}} />}>
      <Inner categories={categories} />
    </Suspense>
  );
}
```

- [ ] **Step 5: Modify `src/app/contact/page.tsx`** — build `FormCategory[]` on the server and replace the placeholder paragraph in `#enquiry`:

```tsx
import { EnquiryFormLoader } from "@/components/contact/EnquiryFormLoader";
import { getCategories, getProductsByCategory } from "@/lib/catalog";
```
```tsx
  const formCategories = getCategories().map((c) => ({
    slug: c.slug, name: c.name, products: getProductsByCategory(c.slug).map((p) => ({ slug: p.slug, name: p.name })),
  }));
```
```tsx
        <section id="enquiry" aria-label="Enquiry form" className="lg:col-span-7">
          <h2 className="mb-6">Send your requirement</h2>
          <EnquiryFormLoader categories={formCategories} />
        </section>
```

- [ ] **Step 6: Run tests, build, static guard** — `npm test` → PASS. `npm run build && npm run check:static` → `/contact` still prerendered; `/api/enquiry` listed as a dynamic route (ƒ).

- [ ] **Step 7: Real delivery check** — put a real `WEB3FORMS_ACCESS_KEY` in `.env.local` (never commit), `npm run dev`, submit a test enquiry, confirm it arrives at the recipient inbox; submit an invalid one and confirm the summary receives focus.

- [ ] **Step 8: Commit**

```bash
git add src/components/contact src/app/contact/page.tsx
git commit -m "feat(enquiry): accessible form with prefill, validation states and delivery"
```

---

## Self-review

- Spec §10 coverage: fields and prefill (Task 3), visible labels / inline errors / summary focus / loading / success with WhatsApp fallback / specific error (Task 3), honeypot + rate limit + server validation (Task 2), Web3Forms behind `sendEnquiry()` (Task 2), keys only in env (Tasks 1–2), contact page stays static via `useSearchParams` in `Suspense` (Task 3).
- Types: `EnquiryInput` keys used identically in `LABELS`, `ENQUIRY_FIELDS`, validation and the route; `FormCategory` produced by the page matches the form prop.
- Trade terms restricted to FOB/CIF in both validation and the select.
