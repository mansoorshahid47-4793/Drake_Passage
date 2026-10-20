import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

type Group = { subCategory: string | null; products: Product[] };

export type GroupRow = { kind: "full"; group: Group } | { kind: "packed"; groups: Group[] };

// Groups of three or more products keep their own full-width grid. Consecutive groups of
// one or two products share a grid so they fill rows together instead of each leaving
// empty columns beside it.
export function packGroups(groups: Group[]): GroupRow[] {
  const rows: GroupRow[] = [];
  for (const group of groups) {
    const last = rows.at(-1);
    if (group.products.length >= 3) rows.push({ kind: "full", group });
    else if (last?.kind === "packed") last.groups.push(group);
    else rows.push({ kind: "packed", groups: [group] });
  }
  return rows;
}

function ProductCard({ product, categorySlug, sizes }: { product: Product; categorySlug: string; sizes: string }) {
  return (
    <Link href={`/products/${categorySlug}/${product.slug}`} className="block no-underline text-ink group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-navy">
        <Image src={product.images[0]} alt={`${product.name}: ${product.tagline}`} fill sizes={sizes} className="object-cover" />
      </div>
      <h3 className="mt-3 text-[1.25rem] group-hover:text-teal">{product.name}</h3>
      <p className="m-0 text-muted text-[15px]">{product.tagline}</p>
    </Link>
  );
}

function FeatureCard({ product, categorySlug }: { product: Product; categorySlug: string }) {
  return (
    <Link href={`/products/${categorySlug}/${product.slug}`} className="grid gap-6 no-underline text-ink group sm:grid-cols-2 lg:grid-cols-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-navy">
        <Image src={product.images[0]} alt={`${product.name}: ${product.tagline}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center rounded-tile border border-line bg-white p-6 lg:col-span-2 lg:p-10">
        <h3 className="m-0 group-hover:text-teal">{product.name}</h3>
        <p className="mt-2 mb-0 text-muted">{product.tagline}</p>
        <p className="mt-4 mb-0 text-[15px]">{product.summary}</p>
        <span className="mt-6 font-semibold text-teal-text underline underline-offset-[3px]">View product details</span>
      </div>
    </Link>
  );
}

function GroupHeading({ group }: { group: Group }) {
  return group.subCategory ? <h2 className="text-[1.6rem]">{group.subCategory}</h2> : null;
}

const GRID_LIST = "mt-4 grid list-none gap-6 p-0 m-0";

export function ProductGroups({ groups, categorySlug }: { groups: Group[]; categorySlug: string }) {
  return packGroups(groups).map((row) => {
    if (row.kind === "full") {
      const g = row.group;
      return (
        <section key={g.subCategory ?? "all"} className="mt-12">
          <GroupHeading group={g} />
          <ul className={`${GRID_LIST} sm:grid-cols-2 lg:grid-cols-3`}>
            {g.products.map((p) => (
              <li key={p.slug}><ProductCard product={p} categorySlug={categorySlug} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" /></li>
            ))}
          </ul>
        </section>
      );
    }

    const cells = row.groups.reduce((n, g) => n + g.products.length, 0);
    const key = row.groups.map((g) => g.subCategory ?? "all").join("|");

    if (cells === 1) {
      const g = row.groups[0];
      return (
        <section key={key} className="mt-12">
          <GroupHeading group={g} />
          <ul className={GRID_LIST}>
            <li><FeatureCard product={g.products[0]} categorySlug={categorySlug} /></li>
          </ul>
        </section>
      );
    }

    const twoUp = cells === 2;
    const sizes = twoUp ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
    return (
      <div key={key} className={`mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 ${twoUp ? "" : "lg:grid-cols-3"}`}>
        {row.groups.map((g) => (
          <section key={g.subCategory ?? "all"} className={g.products.length === 2 ? "sm:col-span-2" : undefined}>
            <GroupHeading group={g} />
            <ul className={`${GRID_LIST} ${g.products.length === 2 ? "sm:grid-cols-2" : ""}`}>
              {g.products.map((p) => (
                <li key={p.slug}><ProductCard product={p} categorySlug={categorySlug} sizes={sizes} /></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  });
}
