import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { getCategories, getProducts } from "@/lib/catalog";
import { ORIGIN_PHOTOS } from "@/data/origin";

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

  it("every origin photo src exists on disk", () => {
    for (const photo of ORIGIN_PHOTOS) {
      const filePath = path.join(process.cwd(), "public", photo.src);
      expect(existsSync(filePath), `${photo.src} (origin photo: ${photo.id})`).toBe(true);
    }
  });

  it("no heroImage or product image is an .svg placeholder", () => {
    for (const category of getCategories()) {
      expect(category.heroImage.endsWith(".svg"), `${category.heroImage} (category: ${category.slug})`).toBe(false);
    }
    for (const product of getProducts()) {
      for (const image of product.images) {
        expect(image.endsWith(".svg"), `${image} (product: ${product.slug})`).toBe(false);
      }
    }
  });
});
