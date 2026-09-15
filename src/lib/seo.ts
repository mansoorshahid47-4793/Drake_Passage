import type { Category, Product } from "@/lib/types";

export function categoryTitle(category: Category): string {
  return `${category.name} exporter in Pakistan`;
}

export function productTitle(product: Product, category: Category): string {
  return `${product.name} — ${category.name} from Pakistan`;
}
