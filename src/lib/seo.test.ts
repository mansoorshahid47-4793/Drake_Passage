import { describe, it, expect } from "vitest";
import { categoryTitle, productTitle } from "@/lib/seo";
import { getCategory, getProduct } from "@/lib/catalog";

describe("seo titles", () => {
  it("builds keyword-focused titles for the primary lines", () => {
    expect(categoryTitle(getCategory("rice")!)).toBe("Basmati rice exporter in Pakistan");
    expect(categoryTitle(getCategory("salt")!)).toBe("Himalayan salt exporter in Pakistan");
    expect(categoryTitle(getCategory("spices")!)).toBe("Spice exporter in Pakistan");
    expect(productTitle(getProduct("rice", "irri-6")!)).toBe("IRRI-6 from Pakistan");
  });
});
