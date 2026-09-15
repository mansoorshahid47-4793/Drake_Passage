import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { getCategories, getProductsByCategory } from "@/lib/catalog";

describe("CategoryGrid", () => {
  it("renders one tile per category with product counts", () => {
    const categories = getCategories();
    const counts = Object.fromEntries(categories.map((c) => [c.slug, getProductsByCategory(c.slug).length]));
    render(<CategoryGrid categories={categories} counts={counts} />);
    expect(screen.getAllByRole("link").length).toBe(6);
    expect(screen.getByText("5 products")).toBeInTheDocument();
  });
});
