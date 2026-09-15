import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EnquiryForm } from "@/components/contact/EnquiryForm";

const categories = [
  { slug: "rice", name: "Rice", products: [{ slug: "irri-6", name: "IRRI-6" }] },
  { slug: "salt", name: "Salt", products: [] },
];

describe("EnquiryForm", () => {
  beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });

  it("shows an error summary and inline errors on empty submit, and focuses the summary", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{}} />);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
    expect(summary).toHaveTextContent("Enter your full name");
    const name = screen.getByLabelText("Full name");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Enter your full name");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("prefills from initial values and filters products by category", () => {
    render(<EnquiryForm categories={categories} initial={{ category: "rice", product: "irri-6", enquiryType: "sample" }} />);
    expect(screen.getByLabelText("Product category")).toHaveValue("rice");
    expect(screen.getByLabelText("Product (optional)")).toHaveValue("irri-6");
    expect(screen.getByLabelText("What are you asking for?")).toHaveValue("sample");
  });

  it("submits valid data and shows success", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{ category: "rice" }} />);
    await user.type(screen.getByLabelText("Full name"), "Amina Khan");
    await user.type(screen.getByLabelText("Business email"), "amina@importco.ae");
    await user.type(screen.getByLabelText("Destination country or port"), "Jebel Ali");
    await user.type(screen.getByLabelText("Quantity"), "1 x 40ft");
    await user.selectOptions(screen.getByLabelText("Trade term"), "CIF");
    await user.type(screen.getByLabelText("Message"), "Please quote IRRI-6 in 25kg bags.");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Enquiry sent"));
    expect(fetch).toHaveBeenCalledWith("/api/enquiry", expect.objectContaining({ method: "POST" }));
  });

  it("shows the server error and a WhatsApp fallback when delivery fails", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: false, error: "We could not send your enquiry." }), { status: 502 }));
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{ category: "rice" }} />);
    await user.type(screen.getByLabelText("Full name"), "Amina Khan");
    await user.type(screen.getByLabelText("Business email"), "amina@importco.ae");
    await user.type(screen.getByLabelText("Destination country or port"), "Jebel Ali");
    await user.type(screen.getByLabelText("Quantity"), "1 x 40ft");
    await user.selectOptions(screen.getByLabelText("Trade term"), "FOB");
    await user.type(screen.getByLabelText("Message"), "Please quote IRRI-6 in 25kg bags.");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not send your enquiry.");
    expect(screen.getByRole("link", { name: "Send it on WhatsApp instead" })).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});
