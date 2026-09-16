import Link from "next/link";
import type { Category } from "@/lib/types";

export function EnquiryCategoryList({ categories }: { categories: Category[] }) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
      {categories.map((c) => (
        <li key={c.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-control border border-line px-4 py-2">
          <span className="flex items-center gap-2">
            <Link href={`/products/${c.slug}`} className="inline-flex min-h-11 items-center font-semibold text-ink no-underline hover:text-teal">
              {c.name}
            </Link>
            <span className="rounded-full border border-line px-2 py-0.5 text-[12px] text-muted">On enquiry</span>
          </span>
          <Link href={`/contact?category=${c.slug}`} className="inline-flex min-h-11 items-center text-[15px] font-semibold text-teal-text underline underline-offset-[3px]">
            Get a quote<span className="sr-only"> for {c.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
