import type { Category } from "@/lib/types";
import { CategoryTile } from "@/components/ui/CategoryTile";

export function CategoryGrid({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <CategoryTile key={c.slug} category={c} productCount={counts[c.slug] ?? 0} />
      ))}
    </div>
  );
}
