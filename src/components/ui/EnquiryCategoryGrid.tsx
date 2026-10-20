import Link from "next/link";
import type { Category } from "@/lib/types";
import { CategoryTile } from "@/components/ui/CategoryTile";

export function EnquiryCategoryGrid({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((c) => (
        <li key={c.slug}>
          <CategoryTile category={c} productCount={counts[c.slug] ?? 0} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          <Link href={`/contact?category=${c.slug}`} className="inline-flex min-h-11 items-center text-[15px] font-semibold text-teal-text underline underline-offset-[3px]">
            Get a quote<span className="sr-only"> for {c.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
