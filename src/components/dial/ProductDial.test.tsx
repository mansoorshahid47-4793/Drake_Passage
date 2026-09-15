import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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

const cardButton = (slug: string) => within(screen.getByTestId(`dial-item-${slug}`)).getByRole("button", { hidden: true });

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

  it("moves focus to the new center card when a focused card rotates away, never into aria-hidden", async () => {
    const user = userEvent.setup();
    render(<ProductDial items={items} />);
    await user.click(screen.getByRole("button", { name: /Rice/ }));
    expect(document.activeElement).toBe(cardButton("rice"));
    // Three moves: Rice ends at offset -3, i.e. data-offset="hidden".
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("5 of 6, Tomato");
    expect(screen.getByTestId("dial-item-rice")).toHaveAttribute("data-offset", "hidden");
    expect(document.activeElement).toBe(cardButton("tomato"));
    expect(document.activeElement?.closest('[aria-hidden="true"]')).toBeNull();
  });

  it("keeps focus on the control that was used", async () => {
    const user = userEvent.setup();
    render(<ProductDial items={items} />);
    const nextBtn = screen.getByRole("button", { name: "Next category" });
    await user.click(nextBtn);
    expect(document.activeElement).toBe(nextBtn);
    const region = screen.getByRole("region", { name: "Product categories" });
    region.focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(region);
  });

  it("does not let a native image drag swallow a mouse swipe", () => {
    render(<ProductDial items={items} />);
    const img = screen.getByTestId("dial-item-salt").querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("draggable", "false");
    // fireEvent returns false when the event was defaultPrevented.
    expect(fireEvent.dragStart(img!)).toBe(false);
  });

  it("a swipe moves the dial and the click that follows it does not open the panel", () => {
    render(<ProductDial items={items} />);
    const salt = cardButton("salt");
    fireEvent.pointerDown(salt, { clientX: 200 });
    fireEvent.pointerUp(salt, { clientX: 140 });
    expect(screen.getByRole("status")).toHaveTextContent("2 of 6, Rice");
    fireEvent.click(salt);
    expect(screen.getByRole("status")).toHaveTextContent("2 of 6, Rice");
    expect(screen.queryByRole("region", { name: /details$/ })).not.toBeInTheDocument();
    // The guard only swallows the one click that follows a swipe.
    fireEvent.pointerDown(cardButton("rice"), { clientX: 100 });
    fireEvent.pointerUp(cardButton("rice"), { clientX: 100 });
    fireEvent.click(cardButton("rice"));
    expect(screen.getByRole("region", { name: "Rice details" })).toBeInTheDocument();
  });

  it("a drag that leaves the stage still settles and does not leave a stale start", () => {
    render(<ProductDial items={items} />);
    const stage = screen.getByTestId("dial-item-salt").parentElement!;
    fireEvent.pointerDown(stage, { clientX: 100 });
    fireEvent.pointerLeave(stage, { clientX: 300 });
    expect(screen.getByRole("status")).toHaveTextContent("6 of 6, Spices");
    // A later pointerup without a pointerdown on the stage must be a no-op.
    fireEvent.pointerUp(stage, { clientX: 0 });
    expect(screen.getByRole("status")).toHaveTextContent("6 of 6, Spices");
  });
});

describe("CategoryPanel via ProductDial", () => {
  const product = (slug: string, subCategory?: string) => ({ slug, name: slug, ...(subCategory ? { subCategory } : {}) });

  it("caps the panel at six product links across groups, in sub-category order", async () => {
    const user = userEvent.setup();
    const capped: DialItem = {
      ...items[0], subCategories: ["Fine", "Coarse", "Blocks"],
      products: [
        product("fine-1", "Fine"), product("fine-2", "Fine"), product("fine-3", "Fine"),
        product("coarse-1", "Coarse"), product("coarse-2", "Coarse"), product("coarse-3", "Coarse"),
        product("block-1", "Blocks"), product("block-2", "Blocks"),
      ],
    };
    render(<ProductDial items={[capped, ...items.slice(1)]} />);
    await user.click(cardButton("salt"));
    const panel = screen.getByRole("region", { name: "Salt details" });
    const links = within(panel).getAllByRole("link");
    const productLinks = links.filter((l) => l.getAttribute("href")?.startsWith("/products/salt/"));
    expect(productLinks).toHaveLength(6);
    expect(links).toHaveLength(8);
    expect(productLinks.map((l) => l.textContent)).toEqual(["fine-1", "fine-2", "fine-3", "coarse-1", "coarse-2", "coarse-3"]);
    // Every sub-category still gets a chip, but the group that received no links has no heading.
    expect(within(panel).getAllByRole("listitem").filter((li) => li.textContent === "Blocks")).toHaveLength(1);
    expect(Array.from(panel.querySelectorAll("p")).map((p) => p.textContent)).toEqual(["Fine", "Coarse"]);
  });

  it("lists products with a missing or unknown sub-category after the known groups", async () => {
    const user = userEvent.setup();
    const mixed: DialItem = {
      ...items[0], subCategories: ["Fine"],
      products: [product("stray-1"), product("fine-1", "Fine"), product("stray-2", "Unknown")],
    };
    render(<ProductDial items={[mixed, ...items.slice(1)]} />);
    await user.click(cardButton("salt"));
    const panel = screen.getByRole("region", { name: "Salt details" });
    const productLinks = within(panel).getAllByRole("link").filter((l) => l.getAttribute("href")?.startsWith("/products/salt/"));
    expect(productLinks.map((l) => l.textContent)).toEqual(["fine-1", "stray-1", "stray-2"]);
  });
});
