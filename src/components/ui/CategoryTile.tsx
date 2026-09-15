import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryTile({ category, productCount }: { category: Category; productCount: number }) {
  return (
    <Link href={`/products/${category.slug}`} className="group block no-underline text-ink">
      <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-navy">
        <Image src={category.heroImage} alt={`${category.name}: ${category.tagline}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="group-hover:text-teal transition-colors duration-[var(--dur-micro)]">{category.name}</h3>
        <span className="text-muted text-[15px]">{productCount} {productCount === 1 ? "product" : "products"}</span>
      </div>
      <p className="text-muted text-[15px]">{category.tagline}</p>
    </Link>
  );
}
