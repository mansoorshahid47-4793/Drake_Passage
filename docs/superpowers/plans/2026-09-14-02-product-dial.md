# Product Dial Implementation Plan (Plan 2 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The homepage "Coverflow Dial": a keyboard-, touch- and screen-reader-usable 3D category selector whose center item expands into a panel of sub-categories and product links.

**Architecture:** A client component `ProductDial` receives plain serialisable `DialItem[]` from the server page (no data imports on the client). Position/rotation are pure CSS transforms driven by one `index` in a small hook; reduced motion disables the 3D via a CSS media query. The expanded panel is ordinary DOM after the dial, so it is readable in order.

**Tech Stack:** React client component, CSS 3D transforms (`perspective`, `rotateY`), Pointer Events, Vitest + Testing Library. No animation library, no WebGL.

**Spec:** `docs/superpowers/specs/2026-09-14-site-rebuild-design.md` §9 (and §7 motion tokens, §11 accessibility). Requires Plan 1 complete.

## Global Constraints

- No autoplay. Motion only in response to the user.
- Durations from tokens: `var(--dur-dial)` = 420ms for position changes; `var(--dur-component)` = 280ms for the panel.
- Center item scale 1.0; neighbours 0.82 / rotateY ±28° / opacity 0.6; third-order 0.7 / opacity 0.3; further items hidden (`visibility: hidden`).
- Reduced motion: no rotation or scaling; items swap instantly.
- Controls 44×44 minimum; region is keyboard operable; live region announces "N of 6, Name".
- Container reserves height per breakpoint (no CLS). Only the initial center image has `priority`.
- Same token/copy rules as Plan 1 (sentence case, no arrows in labels, no all-caps).

---

## File structure

```
src/components/dial/
  types.ts              DialItem type (serialisable)
  useDialState.ts       index + next/prev/goTo with wrap-around, offset math
  ProductDial.tsx       region, stage, controls, live region, panel toggle
  DialItemCard.tsx      one positioned item (image + name)
  CategoryPanel.tsx     expanded content for the center item
  dial.css              stage/transform rules incl. reduced-motion override
  useDialState.test.ts  ProductDial.test.tsx
src/lib/dial.ts         toDialItems(): builds DialItem[] on the server
src/app/page.tsx        renders <ProductDial items={...}> in the Hero slot
```

---

### Task 1: Dial types, state hook and offset math

**Files:**
- Create: `src/components/dial/types.ts`, `src/components/dial/useDialState.ts`, `src/lib/dial.ts`
- Test: `src/components/dial/useDialState.test.ts`, `src/lib/dial.test.ts`

**Interfaces:**
- Produces:
  - `DialItem { slug; name; tagline; image; productCount; subCategories: string[]; products: { slug; name; subCategory?: string }[] }`
  - `useDialState(count: number, initial = 0): { index; next(); prev(); goTo(i) }`
  - `relativeOffset(i: number, index: number, count: number): number` (shortest signed distance)
  - `toDialItems(): DialItem[]` (server only; uses `@/lib/catalog`)

- [ ] **Step 1: Create `types.ts`**

```ts
export interface DialItem {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  productCount: number;
  subCategories: string[];
  products: { slug: string; name: string; subCategory?: string }[];
}
```

- [ ] **Step 2: Write the failing tests**

```ts
// useDialState.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useDialState, relativeOffset } from "@/components/dial/useDialState";

describe("relativeOffset", () => {
  it("returns the shortest signed distance around the ring", () => {
    expect(relativeOffset(0, 0, 6)).toBe(0);
    expect(relativeOffset(1, 0, 6)).toBe(1);
    expect(relativeOffset(5, 0, 6)).toBe(-1);
    expect(relativeOffset(3, 0, 6)).toBe(3);
    expect(relativeOffset(4, 0, 6)).toBe(-2);
  });
});

describe("useDialState", () => {
  it("wraps in both directions and jumps with goTo", () => {
    const { result } = renderHook(() => useDialState(6));
    expect(result.current.index).toBe(0);
    act(() => result.current.prev());
    expect(result.current.index).toBe(5);
    act(() => result.current.next());
    act(() => result.current.next());
    expect(result.current.index).toBe(1);
    act(() => result.current.goTo(4));
    expect(result.current.index).toBe(4);
  });
});
```

```ts
// src/lib/dial.test.ts
import { describe, it, expect } from "vitest";
import { toDialItems } from "@/lib/dial";

describe("toDialItems", () => {
  it("produces one serialisable item per category with products", () => {
    const items = toDialItems();
    expect(items.map((i) => i.slug)).toEqual(["salt", "rice", "potato", "onion", "tomato", "spices"]);
    const rice = items[1];
    expect(rice.productCount).toBe(5);
    expect(rice.subCategories).toEqual(["Basmati", "Non-Basmati"]);
    expect(rice.products.find((p) => p.slug === "irri-6")?.subCategory).toBe("Non-Basmati");
    expect(JSON.parse(JSON.stringify(items))).toEqual(items);
  });
});
```

- [ ] **Step 3: Run to verify they fail** — `npm test` → FAIL, modules not found.

- [ ] **Step 4: Create `useDialState.ts`**

```ts
"use client";

import { useCallback, useState } from "react";

export function relativeOffset(i: number, index: number, count: number): number {
  let d = i - index;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

export function useDialState(count: number, initial = 0) {
  const [index, setIndex] = useState(initial);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  return { index, next, prev, goTo };
}
```

- [ ] **Step 5: Create `src/lib/dial.ts`**

```ts
import { getCategories, getProductsByCategory } from "@/lib/catalog";
import type { DialItem } from "@/components/dial/types";

export function toDialItems(): DialItem[] {
  return getCategories().map((c) => {
    const products = getProductsByCategory(c.slug);
    return {
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      image: c.heroImage,
      productCount: products.length,
      subCategories: c.subCategories,
      products: products.map((p) => ({ slug: p.slug, name: p.name, ...(p.subCategory ? { subCategory: p.subCategory } : {}) })),
    };
  });
}
```

- [ ] **Step 6: Run tests** — `npm test` → PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/dial src/lib/dial.ts src/lib/dial.test.ts
git commit -m "feat(dial): item type, state hook and server mapper"
```

---

### Task 2: Dial stage, item cards, controls and live region

**Files:**
- Create: `src/components/dial/dial.css`, `DialItemCard.tsx`, `ProductDial.tsx`
- Test: `src/components/dial/ProductDial.test.tsx`

**Interfaces:**
- Produces: `<ProductDial items={DialItem[]} />` (client). `data-offset` attribute on each item (`-2..2` or `"hidden"`) drives CSS.

- [ ] **Step 1: Write the failing test `ProductDial.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ProductDial } from "@/components/dial/ProductDial";
import type { DialItem } from "@/components/dial/types";

const items: DialItem[] = ["salt", "rice", "potato", "onion", "tomato", "spices"].map((slug, i) => ({
  slug, name: slug[0].toUpperCase() + slug.slice(1), tagline: `${slug} tagline`, image: `/images/categories/${slug}.svg`,
  productCount: i + 1, subCategories: slug === "rice" ? ["Basmati", "Non-Basmati"] : [],
  products: [{ slug: `${slug}-a`, name: `${slug} A`, ...(slug === "rice" ? { subCategory: "Basmati" } : {}) }],
}));

describe("ProductDial", () => {
  it("announces the center item and moves with controls and arrow keys", async () => {
    const user = userEvent.setup();
    render(<ProductDial items={items} />);
    const region = screen.getByRole("region", { name: "Product categories" });
    expect(screen.getByRole("status")).toHaveTextContent("1 of 6, Salt");
    await user.click(screen.getByRole("button", { name: "Next category" }));
    expect(screen.getByRole("status")).toHaveTextContent("2 of 6, Rice");
    region.focus();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("status")).toHaveTextContent("6 of 6, Spices");
  });

  it("marks offsets so CSS can position items", () => {
    render(<ProductDial items={items} />);
    expect(screen.getByTestId("dial-item-salt")).toHaveAttribute("data-offset", "0");
    expect(screen.getByTestId("dial-item-rice")).toHaveAttribute("data-offset", "1");
    expect(screen.getByTestId("dial-item-spices")).toHaveAttribute("data-offset", "-1");
    expect(screen.getByTestId("dial-item-onion")).toHaveAttribute("data-offset", "hidden");
  });

  it("selecting the center item opens the panel; selecting a side item centers it", async () => {
    const user = userEvent.setup();
    render(<ProductDial items={items} />);
    await user.click(screen.getByRole("button", { name: /Rice/ }));
    expect(screen.getByRole("status")).toHaveTextContent("2 of 6, Rice");
    expect(screen.queryByRole("region", { name: "Rice details" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Rice/ }));
    const panel = screen.getByRole("region", { name: "Rice details" });
    expect(panel).toHaveTextContent("Basmati");
    expect(screen.getByRole("link", { name: "Get a quote for rice" })).toHaveAttribute("href", "/contact?category=rice");
    expect(screen.getByRole("link", { name: "See all rice" })).toHaveAttribute("href", "/products/rice");
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm test` → FAIL.

- [ ] **Step 3: Create `dial.css`**

```css
.dial-stage {
  position: relative;
  height: 340px;
  perspective: 1100px;
  overflow: hidden;
}
@media (min-width: 768px) { .dial-stage { height: 420px; } }
@media (min-width: 1024px) { .dial-stage { height: 460px; } }

.dial-item {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(62%, 320px);
  translate: -50% -50%;
  transform-style: preserve-3d;
  transition: transform var(--dur-dial) cubic-bezier(0.2, 0.7, 0.2, 1), opacity var(--dur-dial) ease-out;
  will-change: transform;
}
.dial-item[data-offset="0"]  { transform: translateX(0) scale(1) rotateY(0deg); opacity: 1; z-index: 5; }
.dial-item[data-offset="1"]  { transform: translateX(46%) scale(0.82) rotateY(-28deg); opacity: 0.6; z-index: 4; }
.dial-item[data-offset="-1"] { transform: translateX(-46%) scale(0.82) rotateY(28deg); opacity: 0.6; z-index: 4; }
.dial-item[data-offset="2"]  { transform: translateX(80%) scale(0.7) rotateY(-36deg); opacity: 0.3; z-index: 3; }
.dial-item[data-offset="-2"] { transform: translateX(-80%) scale(0.7) rotateY(36deg); opacity: 0.3; z-index: 3; }
.dial-item[data-offset="hidden"] { visibility: hidden; opacity: 0; transform: scale(0.6); }

.dial-item[data-offset="0"] .dial-card { box-shadow: 0 24px 48px -16px rgba(11, 37, 69, 0.45); }

@media (prefers-reduced-motion: reduce) {
  .dial-item { transition: none; }
  .dial-item[data-offset="1"], .dial-item[data-offset="-1"],
  .dial-item[data-offset="2"], .dial-item[data-offset="-2"] { transform: none; opacity: 0; visibility: hidden; }
  .dial-item[data-offset="0"] { transform: none; }
}
```

- [ ] **Step 4: Create `DialItemCard.tsx`**

```tsx
"use client";

import Image from "next/image";
import type { DialItem } from "./types";

type Props = {
  item: DialItem;
  offset: number | "hidden";
  position: number;
  total: number;
  isCenter: boolean;
  expanded: boolean;
  priority: boolean;
  onSelect: () => void;
};

export function DialItemCard({ item, offset, position, total, isCenter, expanded, priority, onSelect }: Props) {
  return (
    <div
      className="dial-item"
      data-offset={String(offset)}
      data-testid={`dial-item-${item.slug}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${position} of ${total}, ${item.name}`}
      aria-hidden={offset === "hidden" || undefined}
    >
      <button
        type="button"
        onClick={onSelect}
        tabIndex={isCenter ? 0 : -1}
        aria-expanded={isCenter ? expanded : undefined}
        aria-controls={isCenter ? `dial-panel-${item.slug}` : undefined}
        className="dial-card block w-full overflow-hidden rounded-tile bg-navy text-left text-salt cursor-pointer"
      >
        <div className="relative aspect-[4/3]">
          <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 320px, 62vw" priority={priority} className="object-cover" />
        </div>
        <div className="px-4 py-3">
          <span className="block font-display text-xl font-semibold">{item.name}</span>
          <span className="block text-salt/80 text-[15px]">{item.productCount} {item.productCount === 1 ? "product" : "products"}</span>
        </div>
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Create `ProductDial.tsx`** (panel is added in Task 3; keep the `CategoryPanel` import out until then)

```tsx
"use client";

import { useRef, useState } from "react";
import "./dial.css";
import type { DialItem } from "./types";
import { DialItemCard } from "./DialItemCard";
import { relativeOffset, useDialState } from "./useDialState";

const SWIPE_PX = 40;

export function ProductDial({ items }: { items: DialItem[] }) {
  const count = items.length;
  const { index, next, prev, goTo } = useDialState(count);
  const [expanded, setExpanded] = useState(false);
  const dragStart = useRef<number | null>(null);
  const current = items[index];

  const move = (fn: () => void) => { setExpanded(false); fn(); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); move(next); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); move(prev); }
    else if (e.key === "Home") { e.preventDefault(); move(() => goTo(0)); }
    else if (e.key === "End") { e.preventDefault(); move(() => goTo(count - 1)); }
  };

  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (dx <= -SWIPE_PX) move(next);
    else if (dx >= SWIPE_PX) move(prev);
  };

  return (
    <section aria-label="Product categories" aria-roledescription="carousel" className="w-full" tabIndex={0} onKeyDown={onKeyDown}>
      <div className="dial-stage touch-pan-y select-none" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (dragStart.current = null)}>
        {items.map((item, i) => {
          const d = relativeOffset(i, index, count);
          const offset: number | "hidden" = Math.abs(d) <= 2 ? d : "hidden";
          return (
            <DialItemCard
              key={item.slug}
              item={item}
              offset={offset}
              position={i + 1}
              total={count}
              isCenter={d === 0}
              expanded={expanded}
              priority={i === 0}
              onSelect={() => (d === 0 ? setExpanded((v) => !v) : move(() => goTo(i)))}
            />
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button type="button" onClick={() => move(prev)} aria-label="Previous category" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy text-navy hover:bg-navy hover:text-salt cursor-pointer">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4l-6 6 6 6" /></svg>
        </button>
        <p role="status" aria-live="polite" className="m-0 min-w-[10ch] text-center text-[15px] text-muted">
          {index + 1} of {count}, {current.name}
        </p>
        <button type="button" onClick={() => move(next)} aria-label="Next category" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy text-navy hover:bg-navy hover:text-salt cursor-pointer">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 4l6 6-6 6" /></svg>
        </button>
      </div>
      <p className="mt-2 text-center text-muted text-[15px]">{current.tagline}</p>
      {expanded && <div id={`dial-panel-${current.slug}`} />}
    </section>
  );
}
```

- [ ] **Step 6: Run tests** — first two tests PASS; the third fails at the panel assertions (expected until Task 3).

- [ ] **Step 7: Commit**

```bash
git add src/components/dial
git commit -m "feat(dial): stage, item cards, controls and live region"
```

---

### Task 3: Category panel and homepage integration

**Files:**
- Create: `src/components/dial/CategoryPanel.tsx`
- Modify: `src/components/dial/ProductDial.tsx` (render the panel), `src/app/page.tsx` (use the dial in the hero)

**Interfaces:**
- Produces: `<CategoryPanel item={DialItem} />` rendered as `region` labelled "{Name} details".

- [ ] **Step 1: Create `CategoryPanel.tsx`**

```tsx
"use client";

import Link from "next/link";
import type { DialItem } from "./types";

export function CategoryPanel({ item }: { item: DialItem }) {
  const groups = item.subCategories.length
    ? item.subCategories.map((s) => ({ label: s, products: item.products.filter((p) => p.subCategory === s) })).filter((g) => g.products.length)
    : [{ label: null, products: item.products }];
  const lower = item.name.toLowerCase();
  return (
    <section
      id={`dial-panel-${item.slug}`}
      aria-label={`${item.name} details`}
      className="mt-6 rounded-tile border border-line bg-white p-6 transition-opacity duration-[var(--dur-component)]"
    >
      {item.subCategories.length > 0 && (
        <ul className="m-0 mb-4 flex list-none flex-wrap gap-2 p-0">
          {item.subCategories.map((s) => (
            <li key={s} className="rounded-control border border-line px-3 py-1 text-[15px]">{s}</li>
          ))}
        </ul>
      )}
      {groups.map((g) => (
        <div key={g.label ?? "all"} className="mb-4">
          {g.label && <p className="m-0 mb-1 font-semibold">{g.label}</p>}
          <ul className="m-0 grid list-none gap-x-6 gap-y-1 p-0 sm:grid-cols-2">
            {g.products.slice(0, 6).map((p) => (
              <li key={p.slug}><Link href={`/products/${item.slug}/${p.slug}`}>{p.name}</Link></li>
            ))}
          </ul>
        </div>
      ))}
      <div className="mt-2 flex flex-wrap gap-4">
        <Link href={`/products/${item.slug}`} className="font-semibold">See all {lower}</Link>
        <Link href={`/contact?category=${item.slug}`} className="font-semibold">Get a quote for {lower}</Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Modify `ProductDial.tsx`** — import `CategoryPanel` and replace the last line inside the section:

```tsx
import { CategoryPanel } from "./CategoryPanel";
```
```tsx
      {expanded && <CategoryPanel item={current} />}
```

- [ ] **Step 3: Run tests** — `npm test` → all dial tests PASS.

- [ ] **Step 4: Modify `src/app/page.tsx`** — replace the `CategoryGrid` inside `<Hero>` with the dial, keep the grid lower on the page:

```tsx
import { ProductDial } from "@/components/dial/ProductDial";
import { toDialItems } from "@/lib/dial";
```
```tsx
      <Hero>
        <ProductDial items={toDialItems()} />
      </Hero>
      <ProofStrip />
      <section className="py-20">
        <Container>
          <h2>What we export</h2>
          <div className="mt-10"><CategoryGrid categories={categories} counts={counts} /></div>
        </Container>
      </section>
```
(keep the rest of the page as in Plan 1).

- [ ] **Step 5: Manual review** — `npm run dev`: drag/swipe on a phone-width viewport; Tab to the region, arrows move it; Enter on the center card opens the panel; VoiceOver/NVDA reads "2 of 6, Rice"; toggle OS reduced motion → items swap without rotation. Confirm no layout shift on load (stage height fixed). Take screenshots at 375 and 1440 and compare to spec §9.

- [ ] **Step 6: Build and guard** — `npm run build && npm run check:static` → PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/dial src/app/page.tsx
git commit -m "feat(dial): category panel and homepage integration"
```

---

## Self-review

- Spec §9 coverage: layout math (dial.css), prev/next + keyboard + swipe (Task 2), no autoplay (nothing timed), panel with chips/links/CTAs (Task 3), a11y roles and live region (Task 2), reduced motion (dial.css), fixed stage height and single `priority` image (Task 2).
- Types: `DialItem` shape matches `toDialItems()` output and `CategoryPanel` usage; `relativeOffset` semantics tested; `data-offset` values match the CSS selectors.
- Deliberate scope: the `CategoryGrid` stays on the page as the visual list for scanners; it is no longer the hero slot.
