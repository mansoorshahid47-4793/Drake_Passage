import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getCategories, getProducts } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/products", "/certifications", "/services", "/about", "/insights", "/contact"];
  const categories = getCategories().map((c) => `/products/${c.slug}`);
  const products = getProducts().map((p) => `/products/${p.category}/${p.slug}`);
  return [...staticPaths, ...categories, ...products].map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));
}
