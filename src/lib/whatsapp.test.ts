import { describe, it, expect } from "vitest";
import { whatsAppUrl } from "@/lib/whatsapp";

describe("whatsAppUrl", () => {
  it("builds a wa.me link with the default message", () => {
    expect(whatsAppUrl()).toBe("https://wa.me/923047409567?text=Hello%20Drake%20Passage%2C%20I%20would%20like%20an%20export%20quote.");
  });
  it("encodes a custom message", () => {
    expect(whatsAppUrl("Quote for Rice")).toContain("text=Quote%20for%20Rice");
  });
});
