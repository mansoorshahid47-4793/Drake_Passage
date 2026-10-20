import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EnquiryCategoryList } from "@/components/ui/EnquiryCategoryList";
import { getCategories, getPrimaryCategories, getEnquiryCategories, getProductsByCategory } from "@/lib/catalog";

describe("CategoryGrid", () => {
  it("renders two primary category tiles with product counts", () => {
    const categories = getPrimaryCategories();
    const counts = Object.fromEntries(getCategories().map((c) => [c.slug, getProductsByCategory(c.slug).length]));
    render(<CategoryGrid categories={categories} counts={counts} />);
    expect(screen.getAllByRole("link").length).toBe(2);
    expect(screen.getByText("5 products")).toBeInTheDocument();
  });
});

describe("EnquiryCategoryList", () => {
  it("renders a link and a quote link for each on-enquiry category", () => {
    const categories = getEnquiryCategories();
    render(<EnquiryCategoryList categories={categories} />);
    expect(categories.length).toBe(4);
    for (const c of categories) {
      expect(screen.getByRole("link", { name: c.name })).toHaveAttribute("href", `/products/${c.slug}`);
    }
    expect(screen.getAllByRole("link", { name: /^Get a quote/ })).toHaveLength(4);
    expect(screen.getAllByText("On enquiry")).toHaveLength(4);
  });
});
