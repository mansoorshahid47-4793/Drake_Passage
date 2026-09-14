import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "@/components/layout/Header";
import { getCategories } from "@/lib/catalog";

describe("Header", () => {
  it("shows both header CTAs and the primary nav", () => {
    render(<Header categories={getCategories()} />);
    expect(screen.getAllByRole("link", { name: "Chat on WhatsApp" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Get a quote" })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Certifications" })).toHaveAttribute("href", "/certifications");
  });
});
