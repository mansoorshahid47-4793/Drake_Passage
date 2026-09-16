import { getCategories, getProductsByCategory } from "@/lib/catalog";
import type { DialItem } from "@/components/dial/types";

export function toDialItems(): DialItem[] {
  return getCategories().map((c) => {
    const products = getProductsByCategory(c.slug);
    return {
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      description: c.description,
      image: c.heroImage,
      productCount: products.length,
      subCategories: c.subCategories,
      products: products.map((p) => ({ slug: p.slug, name: p.name, ...(p.subCategory ? { subCategory: p.subCategory } : {}) })),
      tier: c.tier,
    };
  });
}
