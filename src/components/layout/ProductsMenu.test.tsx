import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ProductsMenu } from "@/components/layout/ProductsMenu";
import { getCategories } from "@/lib/catalog";

describe("ProductsMenu", () => {
  it("opens on click, lists categories, closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ProductsMenu categories={getCategories()} />);
    const trigger = screen.getByRole("button", { name: "Products" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Rice" })).toHaveAttribute("href", "/products/rice");
    expect(screen.getByRole("link", { name: "All products" })).toHaveAttribute("href", "/products");
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
