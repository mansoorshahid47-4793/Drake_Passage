import { describe, it, expect } from "vitest";
import { getCategories, getCategory, getProducts, getProductsByCategory, getProduct, groupBySubCategory } from "@/lib/catalog";

describe("catalog accessors", () => {
  it("lists six categories in display order", () => {
    expect(getCategories().map((c) => c.slug)).toEqual(["salt", "rice", "potato", "onion", "spices", "fruits"]);
  });

  it("has unique product slugs and valid category references", () => {
    const products = getProducts();
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const categorySlugs = new Set(getCategories().map((c) => c.slug));
    for (const p of products) expect(categorySlugs.has(p.category)).toBe(true);
  });

  it("only allows FOB, CIF, CNF and Ex-Works trade terms", () => {
    for (const p of getProducts()) {
      for (const t of p.supportedTradeTerms) expect(["FOB", "CIF", "CNF", "Ex-Works"]).toContain(t);
    }
  });

  it("filters products by category and finds one by slug", () => {
    expect(getProductsByCategory("rice").length).toBe(5);
    expect(getProduct("rice", "irri-6")?.name).toBe("IRRI-6");
    expect(getProduct("rice", "red-potato")).toBeUndefined();
  });

  it("groups by sub-category in the category's declared order", () => {
    const groups = groupBySubCategory(getCategory("rice")!);
    expect(groups.map((g) => g.subCategory)).toEqual(["Basmati", "Non-Basmati"]);
    expect(groups[0].products.length).toBe(4);
  });

  it("puts products without a sub-category in a null group", () => {
    const groups = groupBySubCategory(getCategory("spices")!);
    expect(groups).toEqual([{ subCategory: null, products: getProductsByCategory("spices") }]);
  });

  it("gives every product written details: overview, origin, process, specs and packing", () => {
    for (const p of getProducts()) {
      expect(p.summary, p.slug).not.toMatch(/confirmed per enquiry/);
      expect(p.origin, p.slug).toBeTruthy();
      expect(p.process, p.slug).toBeTruthy();
      expect(p.specs.length, p.slug).toBeGreaterThan(0);
      expect(p.packagingOptions.length, p.slug).toBeGreaterThan(0);
    }
  });

  it("does not list ginger and does list Kinnow oranges under fruits", () => {
    expect(getProducts().some((p) => p.slug === "ginger")).toBe(false);
    expect(getProduct("fruits", "kinnow-orange")?.name).toBe("Kinnow orange");
  });
});
