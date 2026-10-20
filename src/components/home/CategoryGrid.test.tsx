import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EnquiryCategoryList } from "@/components/ui/EnquiryCategoryList";
import { EnquiryCategoryGrid } from "@/components/ui/EnquiryCategoryGrid";
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

describe("EnquiryCategoryGrid", () => {
  it("renders a photo tile with an on-enquiry badge, product count and quote link per category", () => {
    const categories = getEnquiryCategories();
    const counts = Object.fromEntries(getCategories().map((c) => [c.slug, getProductsByCategory(c.slug).length]));
    render(<EnquiryCategoryGrid categories={categories} counts={counts} />);
    for (const c of categories) {
      expect(screen.getByRole("img", { name: `${c.name}: ${c.tagline}` })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: new RegExp(`^${c.name}`) })).toHaveAttribute("href", `/products/${c.slug}`);
      expect(screen.getByRole("link", { name: new RegExp(`^Get a quote\\s*for ${c.name}$`) })).toHaveAttribute("href", `/contact?category=${c.slug}`);
    }
    expect(screen.getAllByText("On enquiry")).toHaveLength(4);
  });

  it("does not badge primary categories", () => {
    const counts = Object.fromEntries(getCategories().map((c) => [c.slug, getProductsByCategory(c.slug).length]));
    render(<CategoryGrid categories={getPrimaryCategories()} counts={counts} />);
    expect(screen.queryByText("On enquiry")).toBeNull();
  });
});
