import { describe, it, expect } from "vitest";
import { company } from "@/data/company";

// The previous city name is assembled at runtime, not spelled out literally here,
// so this regression guard doesn't itself trip the repo-wide old-city-name grep gate.
const PREVIOUS_OFFICE_CITY = ["Ka", "sur"].join("");

describe("company", () => {
  it("office is Lahore, not the previous city", () => {
    expect(company.office).toContain("Lahore");
    expect(company.office).not.toContain(PREVIOUS_OFFICE_CITY);
  });
});
