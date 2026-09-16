import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ProductsMenu } from "@/components/layout/ProductsMenu";
import { getCategories } from "@/lib/catalog";

describe("ProductsMenu", () => {
  it("opens on click, lists categories in two groups, closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ProductsMenu categories={getCategories()} />);
    const trigger = screen.getByRole("button", { name: "Products" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Primary lines")).toBeInTheDocument();
    expect(screen.getByText("On enquiry")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Rice" })).toHaveAttribute("href", "/products/rice");
    expect(screen.getByRole("link", { name: "Potato" })).toHaveAttribute("href", "/products/potato");
    expect(screen.getByRole("link", { name: "All products" })).toHaveAttribute("href", "/products");
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("does not render the group labels as links", async () => {
    const user = userEvent.setup();
    render(<ProductsMenu categories={getCategories()} />);
    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(screen.queryByRole("link", { name: "Primary lines" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "On enquiry" })).not.toBeInTheDocument();
  });
});
