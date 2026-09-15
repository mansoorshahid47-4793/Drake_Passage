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
  it("rate limits the sixth request from one IP", async () => {
    for (let i = 0; i < 5; i++) await POST(req(good, "5.5.5.5"));
    const res = await POST(req(good, "5.5.5.5"));
    expect(res.status).toBe(429);
  });
});
