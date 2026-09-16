import { describe, it, expect } from "vitest";
import { getCategories, getCategory, getProducts, getProductsByCategory, getProduct, groupBySubCategory, getPrimaryCategories, getEnquiryCategories } from "@/lib/catalog";

describe("catalog accessors", () => {
  it("lists six categories in display order", () => {
    expect(getCategories().map((c) => c.slug)).toEqual(["salt", "rice", "potato", "onion", "tomato", "spices"]);
  });

  it("has unique product slugs and valid category references", () => {
    const products = getProducts();
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const categorySlugs = new Set(getCategories().map((c) => c.slug));
    for (const p of products) expect(categorySlugs.has(p.category)).toBe(true);
  });

  it("only allows FOB and CIF trade terms", () => {
    for (const p of getProducts()) {
      for (const t of p.supportedTradeTerms) expect(["FOB", "CIF"]).toContain(t);
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

  it("marks salt and rice as primary and the rest as on enquiry", () => {
    const tiers = Object.fromEntries(getCategories().map((c) => [c.slug, c.tier]));
    expect(tiers).toEqual({
      salt: "primary", rice: "primary",
      potato: "enquiry", onion: "enquiry", tomato: "enquiry", spices: "enquiry",
    });
  });

  it("getPrimaryCategories returns salt and rice in catalog order", () => {
    expect(getPrimaryCategories().map((c) => c.slug)).toEqual(["salt", "rice"]);
  });

  it("getEnquiryCategories returns potato, onion, tomato and spices in catalog order", () => {
    expect(getEnquiryCategories().map((c) => c.slug)).toEqual(["potato", "onion", "tomato", "spices"]);
  });
});
