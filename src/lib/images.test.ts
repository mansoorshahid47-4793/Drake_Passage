import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { getCategories, getProducts } from "@/lib/catalog";

describe("catalog images", () => {
  it("every category heroImage exists on disk", () => {
    for (const category of getCategories()) {
      const filePath = path.join(process.cwd(), "public", category.heroImage);
      expect(existsSync(filePath), `${category.heroImage} (category: ${category.slug})`).toBe(true);
    }
  });

  it("every product's first image exists on disk", () => {
    for (const product of getProducts()) {
      const filePath = path.join(process.cwd(), "public", product.images[0]);
      expect(existsSync(filePath), `${product.images[0]} (product: ${product.slug})`).toBe(true);
    }
  });
});
