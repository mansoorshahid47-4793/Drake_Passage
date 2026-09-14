import { describe, it, expect } from "vitest";
import { categoryTitle, productTitle } from "@/lib/seo";
import { getCategory, getProduct } from "@/lib/catalog";

describe("seo titles", () => {
  it("builds commodity-neutral titles", () => {
    expect(categoryTitle(getCategory("rice")!)).toBe("Rice exporter in Pakistan");
    expect(productTitle(getProduct("rice", "irri-6")!, getCategory("rice")!)).toBe("IRRI-6 — Rice from Pakistan");
  });
});
