import { describe, it, expect, vi, beforeEach } from "vitest";
import { _reset } from "@/lib/rateLimit";

vi.mock("@/lib/email", () => ({ sendEnquiry: vi.fn(async () => ({ ok: true })) }));
import { sendEnquiry } from "@/lib/email";
import { POST } from "@/app/api/enquiry/route";

const good = {
  fullName: "Amina Khan", email: "amina@importco.ae", company: "", phone: "", category: "rice", product: "",
  destination: "UAE", quantity: "1 container", tradeTerm: "FOB", message: "Please quote IRRI-6 in 25kg bags.", enquiryType: "quote",
};
const req = (body: unknown, ip = "9.9.9.9") =>
  new Request("http://localhost/api/enquiry", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) });

const reqWithHeaders = (body: unknown, headers: Record<string, string>) =>
  new Request("http://localhost/api/enquiry", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });

const rawReq = (rawBody: string, ip = "9.9.9.9") =>
  new Request("http://localhost/api/enquiry", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: rawBody });

describe("POST /api/enquiry", () => {
  beforeEach(() => { _reset(); vi.mocked(sendEnquiry).mockClear(); });

  it("sends a valid enquiry", async () => {
    const res = await POST(req(good));
    expect(res.status).toBe(200);
    expect(sendEnquiry).toHaveBeenCalledOnce();
  });
  it("returns field errors for an invalid body", async () => {
    const res = await POST(req({ ...good, email: "bad" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors.email).toBeDefined();
    expect(sendEnquiry).not.toHaveBeenCalled();
  });
  it("silently accepts bots that fill the honeypot", async () => {
    const res = await POST(req({ ...good, botcheck: "spam" }));
    expect(res.status).toBe(200);
    expect(sendEnquiry).not.toHaveBeenCalled();
  });
  it("silently accepts bots that fill the honeypot with a non-string truthy value", async () => {
    const res = await POST(req({ ...good, botcheck: true }));
    expect(res.status).toBe(200);
    expect(sendEnquiry).not.toHaveBeenCalled();
  });
  it("rate limits the sixth request from one IP", async () => {
    for (let i = 0; i < 5; i++) await POST(req(good, "5.5.5.5"));
    const res = await POST(req(good, "5.5.5.5"));
    expect(res.status).toBe(429);
  });

  it("keys the rate limit on x-real-ip over x-forwarded-for", async () => {
    // Both headers name different IPs; x-real-ip must win so the two IPs
    // seen in x-forwarded-for below share one bucket and get rate limited
    // together, while a distinct x-real-ip stays in its own bucket.
    for (let i = 0; i < 5; i++) {
      await POST(reqWithHeaders(good, { "x-real-ip": "7.7.7.7", "x-forwarded-for": "1.1.1.1" }));
    }
    const sameRealIp = await POST(reqWithHeaders(good, { "x-real-ip": "7.7.7.7", "x-forwarded-for": "2.2.2.2" }));
    expect(sameRealIp.status).toBe(429);

    const differentRealIp = await POST(reqWithHeaders(good, { "x-real-ip": "8.8.8.8", "x-forwarded-for": "1.1.1.1" }));
    expect(differentRealIp.status).toBe(200);
  });

  it.each([
    ["a null body", "null"],
    ["an array body", "[]"],
    ["a string body", '"x"'],
    ["unparseable text", "not json"],
  ])("returns 400 Invalid request for %s and never sends", async (_label, raw) => {
    const res = await POST(rawReq(raw, "3.3.3.3"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "Invalid request" });
    expect(sendEnquiry).not.toHaveBeenCalled();
  });
});
