import { describe, it, expect } from "vitest";
import { allow, _reset, _size } from "@/lib/rateLimit";

describe("rateLimit", () => {
  it("allows five then blocks within the window, then allows after it", () => {
    _reset();
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(allow("1.1.1.1", t + i)).toBe(true);
    expect(allow("1.1.1.1", t + 10)).toBe(false);
    expect(allow("2.2.2.2", t + 10)).toBe(true);
    expect(allow("1.1.1.1", t + 600_001)).toBe(true);
  });

  it("prunes expired keys from the map on later calls", () => {
    _reset();
    const t = 2_000_000;
    allow("A", t);
    expect(_size()).toBe(1);
    // Past the window for A; a call for a different key should sweep A out.
    allow("B", t + 600_001);
    expect(_size()).toBe(1);
  });
});
