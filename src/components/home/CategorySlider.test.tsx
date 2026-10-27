import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CategorySlider, type Slide } from "@/components/home/CategorySlider";

const slides: Slide[] = [
  { slug: "salt", kicker: "Himalayan", title: "Pink salt", tagline: "Salt tagline", image: "/images/categories/salt.jpg" },
  { slug: "rice", kicker: "Pakistani", title: "Basmati rice", tagline: "Rice tagline", image: "/images/categories/rice.jpg" },
  { slug: "fruits", kicker: "Sweet", title: "Fruits", tagline: "Fruit tagline", image: "/images/categories/fruits.jpg" },
];

// Hidden slides have no computed accessible name, so look them up by label.
const slide = (title: string) => document.querySelector(`[aria-roledescription="slide"][aria-label$=", ${title}"]`)!;

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: reduce && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
}

describe("CategorySlider", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows the first slide with Discover and quote links to its category", () => {
    mockReducedMotion(false);
    render(<CategorySlider slides={slides} />);
    expect(slide("Pink salt")).not.toHaveAttribute("aria-hidden", "true");
    expect(slide("Basmati rice")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "Discover" })).toHaveAttribute("href", "/products/salt");
    expect(screen.getByRole("link", { name: "Get a quote" })).toHaveAttribute("href", "/contact?category=salt");
  });

  it("autoplays to the next slide and wraps around", () => {
    mockReducedMotion(false);
    render(<CategorySlider slides={slides} />);
    act(() => vi.advanceTimersByTime(6000));
    expect(slide("Basmati rice")).not.toHaveAttribute("aria-hidden", "true");
    act(() => vi.advanceTimersByTime(12000));
    expect(slide("Pink salt")).not.toHaveAttribute("aria-hidden", "true");
  });

  it("jumps to a slide from its dot and marks the dot current", () => {
    mockReducedMotion(false);
    render(<CategorySlider slides={slides} />);
    fireEvent.click(screen.getByRole("button", { name: "Show Fruits" }));
    expect(slide("Fruits")).not.toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Show Fruits" })).toHaveAttribute("aria-current", "true");
  });

  it("stops autoplay when paused", () => {
    mockReducedMotion(false);
    render(<CategorySlider slides={slides} />);
    fireEvent.click(screen.getByRole("button", { name: "Pause slideshow" }));
    act(() => vi.advanceTimersByTime(18000));
    expect(slide("Pink salt")).not.toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Play slideshow" })).toBeInTheDocument();
  });

  it("does not autoplay for visitors who prefer reduced motion", () => {
    mockReducedMotion(true);
    render(<CategorySlider slides={slides} />);
    act(() => vi.advanceTimersByTime(18000));
    expect(slide("Pink salt")).not.toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Play slideshow" })).toBeInTheDocument();
  });
});
