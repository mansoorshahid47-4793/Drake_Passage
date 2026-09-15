import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, it, expect } from "vitest";
import { ProductDial } from "@/components/dial/ProductDial";
import type { DialItem } from "@/components/dial/types";

// Vitest globals are off in this repo, so Testing Library cannot auto-register cleanup.
afterEach(cleanup);

const items: DialItem[] = ["salt", "rice", "potato", "onion", "tomato", "spices"].map((slug, i) => ({
  slug, name: slug[0].toUpperCase() + slug.slice(1), tagline: `${slug} tagline`, image: `/images/categories/${slug}.svg`,
  productCount: i + 1, subCategories: slug === "rice" ? ["Basmati", "Non-Basmati"] : [],
  products: [{ slug: `${slug}-a`, name: `${slug} A`, ...(slug === "rice" ? { subCategory: "Basmati" } : {}) }],
}));

describe("ProductDial", () => {
  it("announces the center item and moves with controls and arrow keys", async () => {
    const user = userEvent.setup();
    render(<ProductDial items={items} />);
    const region = screen.getByRole("region", { name: "Product categories" });
    expect(screen.getByRole("status")).toHaveTextContent("1 of 6, Salt");
    await user.click(screen.getByRole("button", { name: "Next category" }));
    expect(screen.getByRole("status")).toHaveTextContent("2 of 6, Rice");
    region.focus();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("status")).toHaveTextContent("6 of 6, Spices");
  });

  it("marks offsets so CSS can position items", () => {
    render(<ProductDial items={items} />);
    expect(screen.getByTestId("dial-item-salt")).toHaveAttribute("data-offset", "0");
    expect(screen.getByTestId("dial-item-rice")).toHaveAttribute("data-offset", "1");
    expect(screen.getByTestId("dial-item-spices")).toHaveAttribute("data-offset", "-1");
    expect(screen.getByTestId("dial-item-onion")).toHaveAttribute("data-offset", "hidden");
  });

  it("selecting the center item opens the panel; selecting a side item centers it", async () => {
    const user = userEvent.setup();
    render(<ProductDial items={items} />);
    await user.click(screen.getByRole("button", { name: /Rice/ }));
    expect(screen.getByRole("status")).toHaveTextContent("2 of 6, Rice");
    expect(screen.queryByRole("region", { name: "Rice details" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Rice/ }));
    const panel = screen.getByRole("region", { name: "Rice details" });
    expect(panel).toHaveTextContent("Basmati");
    expect(screen.getByRole("link", { name: "Get a quote for rice" })).toHaveAttribute("href", "/contact?category=rice");
    expect(screen.getByRole("link", { name: "See all rice" })).toHaveAttribute("href", "/products/rice");
  });
});
