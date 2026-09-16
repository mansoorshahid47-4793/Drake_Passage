import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MobileNav } from "@/components/layout/MobileNav";
import { getCategories } from "@/lib/catalog";

describe("MobileNav", () => {
  it("opens, moves focus into the panel, and returns focus to the trigger on Escape", async () => {
    const user = userEvent.setup();
    render(<MobileNav categories={getCategories()} />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    const panel = screen.getByRole("dialog", { name: "Site menu" });
    expect(panel).toHaveFocus();
    expect(screen.getByText("Primary lines")).toBeInTheDocument();
    expect(screen.getByText("On enquiry")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Rice" })).toHaveAttribute("href", "/products/rice");
    expect(screen.getByRole("link", { name: "Potato" })).toHaveAttribute("href", "/products/potato");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
  });
});
