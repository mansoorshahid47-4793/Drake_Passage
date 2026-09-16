import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendEnquiry } from "@/lib/email";
import type { EnquiryInput } from "@/lib/enquiry";

const value: EnquiryInput = {
  fullName: "Amina Khan", email: "amina@importco.ae", company: "ImportCo", phone: "+971 50 000 0000",
  category: "rice", product: "irri-6", destination: "United Arab Emirates", quantity: "2 x 40ft containers",
  tradeTerm: "CIF", message: "Please quote IRRI-6, 25kg PP bags, Jebel Ali.", enquiryType: "quote",
};

describe("sendEnquiry", () => {
  beforeEach(() => {
    vi.stubEnv("WEB3FORMS_ACCESS_KEY", "test-key");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns ok on a successful provider response", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ json: async () => ({ success: true }) }) as unknown as Response));
    const result = await sendEnquiry(value);
    expect(result).toEqual({ ok: true });
  });

  it("returns the provider's message on a failed response", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ json: async () => ({ success: false, message: "bad key" }) }) as unknown as Response));
    const result = await sendEnquiry(value);
    expect(result).toEqual({ ok: false, reason: "bad key" });
  });

  it("falls back to 'Provider returned <status>' when a failed response carries no message", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ status: 502, json: async () => ({ success: false }) }) as unknown as Response));
    const result = await sendEnquiry(value);
    expect(result).toEqual({ ok: false, reason: "Provider returned 502" });
  });

  it("returns a generic network-error reason when fetch rejects with a non-abort error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("getaddrinfo ENOTFOUND"); }));
    const result = await sendEnquiry(value);
    expect(result).toEqual({ ok: false, reason: "getaddrinfo ENOTFOUND" });
  });

  it("returns a timeout reason when the request is aborted", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      const err = new Error("aborted");
      err.name = "AbortError";
      throw err;
    }));
    const result = await sendEnquiry(value);
    expect(result).toEqual({ ok: false, reason: "Provider timeout" });
  });

  it("fails closed without calling fetch when the access key is unset", async () => {
    vi.stubEnv("WEB3FORMS_ACCESS_KEY", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const result = await sendEnquiry(value);
    expect(result).toEqual({ ok: false, reason: "WEB3FORMS_ACCESS_KEY is not set" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
