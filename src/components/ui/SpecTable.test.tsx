import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SpecTable } from "@/components/ui/SpecTable";

describe("SpecTable", () => {
  it("renders label/value rows", () => {
    render(<SpecTable caption="Rice specs" specs={[{ label: "Grain length", value: "8.3 mm" }]} />);
    expect(screen.getByRole("table", { name: "Rice specs" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Grain length" })).toBeInTheDocument();
    expect(screen.getByText("8.3 mm")).toBeInTheDocument();
  });
  it("shows the on-request note when there are no specs", () => {
    render(<SpecTable specs={[]} />);
    expect(screen.getByText(/confirmed per enquiry/i)).toBeInTheDocument();
  });
});
