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
