import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
    expect(screen.getByRole("status")).toHaveFocus();
  });

  it("shows the server error and a WhatsApp fallback with the category and product names when delivery fails", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: false, error: "We could not send your enquiry." }), { status: 502 }));
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{ category: "rice", product: "irri-6" }} />);
    await user.type(screen.getByLabelText("Full name"), "Amina Khan");
    await user.type(screen.getByLabelText("Business email"), "amina@importco.ae");
    await user.type(screen.getByLabelText("Destination country or port"), "Jebel Ali");
    await user.type(screen.getByLabelText("Quantity"), "1 x 40ft");
    await user.selectOptions(screen.getByLabelText("Trade term"), "FOB");
    await user.type(screen.getByLabelText("Message"), "Please quote IRRI-6 in 25kg bags.");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not send your enquiry.");
    const link = screen.getByRole("link", { name: "Send it on WhatsApp instead" });
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(link).toHaveAttribute("href", expect.stringContaining(encodeURIComponent("Enquiry: Rice, IRRI-6")));
  });

  it("stays responsive after following an error-summary link, so a later select change is not dropped", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{}} />);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    const summary = await screen.findByRole("alert");
    await user.click(screen.getAllByRole("link")[0]);
    expect(summary).toBeInTheDocument();

    await user.type(screen.getByLabelText("Full name"), "Amina Khan");
    await user.type(screen.getByLabelText("Business email"), "amina@importco.ae");
    await user.selectOptions(screen.getByLabelText("Product category"), "rice");
    await user.type(screen.getByLabelText("Destination country or port"), "Jebel Ali");
    await user.type(screen.getByLabelText("Quantity"), "1 x 40ft");
    await user.selectOptions(screen.getByLabelText("Trade term"), "CIF");
    await user.type(screen.getByLabelText("Message"), "Please quote IRRI-6 in 25kg bags.");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const [, init] = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.tradeTerm).toBe("CIF");
  });

  it("clears a field's inline error on blur but keeps it in the summary until the next submit", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{}} />);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    await screen.findByRole("alert");

    const name = screen.getByLabelText("Full name");
    expect(name).toHaveAccessibleDescription("Enter your full name");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your full name");

    await user.type(name, "Amina Khan");
    await user.tab(); // blur -> validateField("fullName") clears the inline error only

    expect(name).not.toHaveAttribute("aria-invalid", "true");
    expect(name).not.toHaveAccessibleDescription("Enter your full name");
    // The summary is a snapshot from the last submit attempt: still lists the
    // now-fixed field until the user submits again.
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your full name");
  });

  it("keeps a field's error slot element in the DOM after its error clears (stable layout)", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm categories={categories} initial={{}} />);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    await screen.findByRole("alert");

    const name = screen.getByLabelText("Full name");
    const errorId = name.getAttribute("aria-describedby");
    expect(errorId).toBeTruthy();
    const errorEl = document.getElementById(errorId as string);
    expect(errorEl).not.toBeNull();
    expect(errorEl).toHaveTextContent("Enter your full name");

    await user.type(name, "Amina Khan");
    await user.tab();

    // Same element, still present, just empty -> no layout shift.
    expect(document.getElementById(errorId as string)).toBe(errorEl);
    expect(errorEl).toHaveTextContent("");
  });

  it("does not move focus away from the active field when the submit button is pressed with a mouse", () => {
    render(<EnquiryForm categories={categories} initial={{}} />);
    const name = screen.getByLabelText("Full name");
    name.focus();
    expect(name).toHaveFocus();

    const button = screen.getByRole("button", { name: "Send enquiry" });
    const notPrevented = fireEvent.mouseDown(button);

    expect(notPrevented).toBe(false); // dispatchEvent returns false when preventDefault() was called
    expect(document.activeElement).toBe(name);
  });
});
