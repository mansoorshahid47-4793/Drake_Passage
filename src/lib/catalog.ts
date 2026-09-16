import { categories, products } from "@/data/catalog";
import type { Category, Product } from "@/lib/types";

export const ENQUIRY_NOTE = "Supplied on enquiry. Tell us the grade, quantity and destination and we will quote.";

export function getCategories(): Category[] {
  return categories;
}

export function getPrimaryCategories(): Category[] {
  return categories.filter((c) => c.tier === "primary");
}

export function getEnquiryCategories(): Category[] {
  return categories.filter((c) => c.tier === "enquiry");
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProducts(): Product[] {
  return products;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getProduct(categorySlug: string, slug: string): Product | undefined {
  return products.find((p) => p.category === categorySlug && p.slug === slug);
}

export function groupBySubCategory(category: Category): { subCategory: string | null; products: Product[] }[] {
  const inCategory = getProductsByCategory(category.slug);
  const groups: { subCategory: string | null; products: Product[] }[] = category.subCategories
    .map((subCategory) => ({ subCategory, products: inCategory.filter((p) => p.subCategory === subCategory) }))
    .filter((g) => g.products.length > 0);
  const ungrouped = inCategory.filter((p) => !p.subCategory || !category.subCategories.includes(p.subCategory));
  if (ungrouped.length > 0) groups.push({ subCategory: null, products: ungrouped });
  return groups;
}
