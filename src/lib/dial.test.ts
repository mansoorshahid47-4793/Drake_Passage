import { describe, it, expect } from "vitest";
import { toDialItems } from "@/lib/dial";

describe("toDialItems", () => {
  it("produces one serialisable item per category with products", () => {
    const items = toDialItems();
    expect(items.map((i) => i.slug)).toEqual(["salt", "rice", "potato", "onion", "tomato", "spices"]);
    const rice = items[1];
    expect(rice.productCount).toBe(5);
    expect(rice.subCategories).toEqual(["Basmati", "Non-Basmati"]);
    expect(rice.products.find((p) => p.slug === "irri-6")?.subCategory).toBe("Non-Basmati");
    expect(typeof rice.description).toBe("string");
    expect(rice.description.length).toBeGreaterThan(0);
    expect(JSON.parse(JSON.stringify(items))).toEqual(items);
  });

  it("maps the category tier through to each dial item", () => {
    const items = toDialItems();
    expect(items.find((i) => i.slug === "salt")?.tier).toBe("primary");
    expect(items.find((i) => i.slug === "rice")?.tier).toBe("primary");
    for (const slug of ["potato", "onion", "tomato", "spices"]) {
      expect(items.find((i) => i.slug === slug)?.tier).toBe("enquiry");
    }
  });
});
