"use client";

import Link from "next/link";
import type { DialItem } from "./types";
import { ENQUIRY_NOTE } from "@/lib/catalog";

const MAX_LINKS = 6;

type Group = { label: string | null; products: DialItem["products"] };

// At most six product links across the whole panel, in sub-category order, then any
// product whose sub-category is missing or unknown. A group that gets none of the six
// is omitted; chips still list every sub-category.
function groupProducts(item: DialItem): Group[] {
  const known = new Set(item.subCategories);
  const ordered: Group[] = item.subCategories.length
    ? [
        ...item.subCategories.map((s) => ({ label: s, products: item.products.filter((p) => p.subCategory === s) })),
        { label: null, products: item.products.filter((p) => !p.subCategory || !known.has(p.subCategory)) },
      ]
    : [{ label: null, products: item.products }];
  const groups: Group[] = [];
  let remaining = MAX_LINKS;
  for (const g of ordered) {
    if (remaining <= 0) break;
    const products = g.products.slice(0, remaining);
    if (!products.length) continue;
    remaining -= products.length;
    groups.push({ label: g.label, products });
  }
  return groups;
}

export function CategoryPanel({ item }: { item: DialItem }) {
  const lower = item.name.toLowerCase();
  const ctas = (
    <div className="mt-2 flex flex-wrap gap-4">
      <Link href={`/products/${item.slug}`} className="font-semibold">See all {lower}</Link>
      <Link href={`/contact?category=${item.slug}`} className="font-semibold">Get a quote for {lower}</Link>
    </div>
  );

  if (item.tier === "enquiry") {
    return (
      <section
        id={`dial-panel-${item.slug}`}
        aria-label={`${item.name} details`}
        className="mt-6 rounded-tile border border-line bg-white p-6 opacity-100 transition-opacity duration-[var(--dur-component)] ease-out starting:opacity-0 motion-reduce:transition-none"
      >
        <p className="m-0 mb-4 rounded-control bg-salt px-4 py-3 text-[15px]">{ENQUIRY_NOTE}</p>
        {ctas}
      </section>
    );
  }

  const groups = groupProducts(item);
  return (
    <section
      id={`dial-panel-${item.slug}`}
      aria-label={`${item.name} details`}
      className="mt-6 rounded-tile border border-line bg-white p-6 opacity-100 transition-opacity duration-[var(--dur-component)] ease-out starting:opacity-0 motion-reduce:transition-none"
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
            {g.products.map((p) => (
              <li key={p.slug}><Link href={`/products/${item.slug}/${p.slug}`}>{p.name}</Link></li>
            ))}
          </ul>
        </div>
      ))}
      {ctas}
    </section>
  );
}
