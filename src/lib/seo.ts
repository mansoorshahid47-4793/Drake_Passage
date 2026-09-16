import type { Category, Product } from "@/lib/types";

export function categoryTitle(category: Category): string {
  return `${category.seoName ?? category.name} exporter in Pakistan`;
}

export function productTitle(product: Product): string {
  return `${product.name} from Pakistan`;
}

export function lowerFirst(s: string): string {
  return s.length ? s[0].toLowerCase() + s.slice(1) : s;
}
