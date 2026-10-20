import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductGroups, packGroups } from "@/components/products/ProductGroups";
import { getCategory, getProductsByCategory, groupBySubCategory } from "@/lib/catalog";

const groupsFor = (slug: string) => groupBySubCategory(getCategory(slug)!);
const shape = (slug: string) =>
  packGroups(groupsFor(slug)).map((r) => (r.kind === "full" ? r.group.products.length : r.groups.map((g) => g.products.length)));

describe("packGroups", () => {
  it("keeps 3+ groups full-width and packs runs of small groups together", () => {
    expect(shape("salt")).toEqual([4, [1, 1, 1, 1, 1, 1], 3]);
    expect(shape("rice")).toEqual([4, [1]]);
    expect(shape("potato")).toEqual([[1, 1]]);
    expect(shape("spices")).toEqual([3]);
  });
});

describe("ProductGroups", () => {
  it.each(["salt", "rice", "potato", "onion", "spices", "fruits"])("links every %s product once, under its sub-category heading", (slug) => {
    const { container } = render(<ProductGroups groups={groupsFor(slug)} categorySlug={slug} />);
    for (const p of getProductsByCategory(slug)) {
      expect(container.querySelectorAll(`a[href="/products/${slug}/${p.slug}"]`)).toHaveLength(1);
    }
    for (const g of groupsFor(slug)) {
      if (g.subCategory) expect(screen.getByRole("heading", { level: 2, name: g.subCategory })).toBeInTheDocument();
    }
  });

  it("renders a lone product as a wide feature card with its summary", () => {
    render(<ProductGroups groups={groupsFor("onion")} categorySlug="onion" />);
    expect(screen.getByText("View product details")).toBeInTheDocument();
  });
});
