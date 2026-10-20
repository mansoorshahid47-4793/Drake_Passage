import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

type Group = { subCategory: string | null; products: Product[] };

export type GroupRow = { kind: "full"; group: Group } | { kind: "packed"; groups: Group[] };

// Consecutive single-product groups share one grid so each doesn't take a row to itself.
export function packGroups(groups: Group[]): GroupRow[] {
  const rows: GroupRow[] = [];
  for (const group of groups) {
    const last = rows.at(-1);
    if (group.products.length > 1) rows.push({ kind: "full", group });
    else if (last?.kind === "packed") last.groups.push(group);
    else rows.push({ kind: "packed", groups: [group] });
  }
  return rows;
}

export type CellLayout = { lgSpan: 2 | 3 | 6; smWide: boolean };

// Cards sit in a 3-up row on lg (a 6-column grid, span 2) and 2-up on sm. Cards in a
// trailing partial row stretch to fill it: two leftovers take half each, one leftover
// takes the whole row as a wide card. Full rows are untouched.
export function cellLayout(index: number, total: number): CellLayout {
  const remLg = total % 3;
  const inLastLgRow = remLg > 0 && index >= total - remLg;
  const lgSpan = !inLastLgRow ? 2 : remLg === 1 ? 6 : 3;
  const smWide = total % 2 === 1 && index === total - 1;
  return { lgSpan, smWide };
}

const LG_SPAN = { 2: "lg:col-span-2", 3: "lg:col-span-3", 6: "lg:col-span-6" } as const;
const cellClass = ({ lgSpan, smWide }: CellLayout) => `${LG_SPAN[lgSpan]}${smWide ? " sm:col-span-2" : ""}`;
const cx = (...c: (string | false)[]) => c.filter(Boolean).join(" ");

function ProductCard({ product, categorySlug, layout }: { product: Product; categorySlug: string; layout: CellLayout }) {
  const sm = layout.smWide;
  const lg = layout.lgSpan === 6;
  const smOnly = sm && !lg;
  const sizes = layout.lgSpan === 3 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
  return (
    <Link
      href={`/products/${categorySlug}/${product.slug}`}
      className={cx("block no-underline text-ink group", sm && "sm:grid sm:grid-cols-2 sm:gap-6", lg && "lg:grid lg:grid-cols-3 lg:gap-6", smOnly && "lg:block")}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-navy">
        <Image src={product.images[0]} alt={`${product.name}: ${product.tagline}`} fill sizes={sizes} className="object-cover" />
      </div>
      <div
        className={cx(
          "mt-3",
          sm && "sm:mt-0 sm:flex sm:flex-col sm:justify-center sm:rounded-tile sm:border sm:border-line sm:bg-white sm:p-6",
          lg && "lg:mt-0 lg:col-span-2 lg:flex lg:flex-col lg:justify-center lg:rounded-tile lg:border lg:border-line lg:bg-white lg:p-10",
          smOnly && "lg:mt-3 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0",
        )}
      >
        <h3 className="m-0 text-[1.25rem] group-hover:text-teal">{product.name}</h3>
        <p className="m-0 text-muted text-[15px]">{product.tagline}</p>
        {(sm || lg) && (
          <div className={cx("hidden", sm && "sm:block", lg && "lg:block", smOnly && "lg:hidden")}>
            <p className="mt-4 mb-0 text-[15px]">{product.summary}</p>
            <span className="mt-4 inline-block font-semibold text-teal-text underline underline-offset-[3px]">View product details</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function GroupHeading({ group }: { group: Group }) {
  return group.subCategory ? <h2 className="text-[1.6rem]">{group.subCategory}</h2> : null;
}

export function ProductGroups({ groups, categorySlug }: { groups: Group[]; categorySlug: string }) {
  return packGroups(groups).map((row) => {
    if (row.kind === "full") {
      const g = row.group;
      return (
        <section key={g.subCategory ?? "all"} className="mt-12">
          <GroupHeading group={g} />
          <ul className="mt-4 grid list-none gap-6 p-0 m-0 sm:grid-cols-2 lg:grid-cols-6">
            {g.products.map((p, i) => {
              const layout = cellLayout(i, g.products.length);
              return (
                <li key={p.slug} className={cellClass(layout)}><ProductCard product={p} categorySlug={categorySlug} layout={layout} /></li>
              );
            })}
          </ul>
        </section>
      );
    }

    return (
      <div key={row.groups.map((g) => g.subCategory ?? "all").join("|")} className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-6">
        {row.groups.map((g, i) => {
          const layout = cellLayout(i, row.groups.length);
          const p = g.products[0];
          return (
            <section key={g.subCategory ?? "all"} className={cellClass(layout)}>
              <GroupHeading group={g} />
              <div className={g.subCategory ? "mt-4" : undefined}><ProductCard product={p} categorySlug={categorySlug} layout={layout} /></div>
            </section>
          );
        })}
      </div>
    );
  });
}
