import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "@/components/layout/Header";
import { getCategories } from "@/lib/catalog";

describe("Header", () => {
  it("shows both header CTAs and the primary nav", () => {
    render(<Header categories={getCategories()} />);
    expect(screen.getAllByRole("link", { name: "Chat on WhatsApp" }).length).toBeGreaterThan(0);
    const quoteLinks = screen.getAllByRole("link", { name: "Get a quote" });
    expect(quoteLinks).toHaveLength(2);
    quoteLinks.forEach((link) => expect(link).toHaveAttribute("href", "/contact"));
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Certifications" })).toHaveAttribute("href", "/certifications");
  });

  it("shows the two-tone wordmark on the home link", () => {
    render(<Header categories={getCategories()} />);
    const homeLink = screen.getByRole("link", { name: /home$/i });
    expect(homeLink).toHaveTextContent("Drake Passage");
    expect(screen.getByText("Drake")).toBeInTheDocument();
    expect(screen.getByText("Passage")).toBeInTheDocument();
  });
});
