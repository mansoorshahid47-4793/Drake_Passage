import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { getCategories, getProductsByCategory } from "@/lib/catalog";

describe("CategoryGrid", () => {
  it("renders a tile with a product count for every category, with no on-enquiry badges", () => {
    const categories = getCategories();
    const counts = Object.fromEntries(categories.map((c) => [c.slug, getProductsByCategory(c.slug).length]));
    render(<CategoryGrid categories={categories} counts={counts} />);
    expect(screen.getAllByRole("link").length).toBe(6);
    for (const c of categories) {
      expect(screen.getByRole("img", { name: `${c.name}: ${c.tagline}` })).toBeInTheDocument();
    }
    expect(screen.getByText("5 products")).toBeInTheDocument();
    expect(screen.queryByText("On enquiry")).toBeNull();
  });
});
