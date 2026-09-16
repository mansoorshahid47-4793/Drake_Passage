import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { EnquiryFormLoader } from "@/components/contact/EnquiryFormLoader";

const categories = [
  { slug: "rice", name: "Rice", products: [{ slug: "irri-6", name: "IRRI-6" }] },
  { slug: "salt", name: "Salt", products: [] },
];

describe("EnquiryFormLoader", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/contact");
  });

  it("prefills category, product and enquiry type from the URL", async () => {
    window.history.replaceState({}, "", "/contact?category=rice&product=irri-6&inquiry=sample");
    render(<EnquiryFormLoader categories={categories} />);

    expect(await screen.findByLabelText("Product category")).toHaveValue("rice");
    expect(await screen.findByLabelText("Product (optional)")).toHaveValue("irri-6");
    expect(await screen.findByLabelText("What are you asking for?")).toHaveValue("sample");
  });

  it("prefills the message for a certificate request with the certificate name", async () => {
    window.history.replaceState({}, "", "/contact?inquiry=certificate&name=ISO%209001");
    render(<EnquiryFormLoader categories={categories} />);

    expect(await screen.findByLabelText("Message")).toHaveValue("Please send a copy of: ISO 9001");
    expect(await screen.findByLabelText("What are you asking for?")).toHaveValue("certificate");
  });

  it("renders an empty product select when the prefilled product does not belong to the prefilled category", async () => {
    window.history.replaceState({}, "", "/contact?product=bogus&category=rice");
    render(<EnquiryFormLoader categories={categories} />);

    expect(await screen.findByLabelText("Product category")).toHaveValue("rice");
    expect(await screen.findByLabelText("Product (optional)")).toHaveValue("");
  });
});
