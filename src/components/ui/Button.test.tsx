import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders a link when href is given", () => {
    render(<Button href="/contact">Get a quote</Button>);
    expect(screen.getByRole("link", { name: "Get a quote" })).toHaveAttribute("href", "/contact");
  });
  it("renders a button otherwise", () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });
  it("opens external links in a new tab safely", () => {
    render(<Button href="https://wa.me/1" external variant="whatsapp">Chat on WhatsApp</Button>);
    const link = screen.getByRole("link", { name: "Chat on WhatsApp" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
