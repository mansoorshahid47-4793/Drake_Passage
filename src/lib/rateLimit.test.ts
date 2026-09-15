import { describe, it, expect } from "vitest";
import { allow, _reset } from "@/lib/rateLimit";

describe("rateLimit", () => {
  it("allows five then blocks within the window, then allows after it", () => {
    _reset();
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(allow("1.1.1.1", t + i)).toBe(true);
    expect(allow("1.1.1.1", t + 10)).toBe(false);
    expect(allow("2.2.2.2", t + 10)).toBe(true);
    expect(allow("1.1.1.1", t + 600_001)).toBe(true);
  });
});
