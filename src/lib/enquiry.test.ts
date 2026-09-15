import { describe, it, expect } from "vitest";
import { validateEnquiry } from "@/lib/enquiry";

const good = {
  fullName: "Amina Khan", email: "amina@importco.ae", company: "ImportCo", phone: "+971 50 000 0000",
  category: "rice", product: "irri-6", destination: "United Arab Emirates", quantity: "2 x 40ft containers",
  tradeTerm: "CIF", message: "Please quote IRRI-6, 25kg PP bags, Jebel Ali.", enquiryType: "quote",
};
const cats = ["salt", "rice"];

describe("validateEnquiry", () => {
  it("accepts a complete enquiry and trims strings", () => {
    const r = validateEnquiry({ ...good, fullName: "  Amina Khan " }, cats);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.fullName).toBe("Amina Khan");
  });
  it("reports one message per invalid required field", () => {
    const r = validateEnquiry({ ...good, fullName: "A", email: "nope", category: "gold", tradeTerm: "EXW", message: "short", enquiryType: "x" }, cats);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["category", "email", "enquiryType", "fullName", "message", "tradeTerm"]);
      expect(r.errors.email).toBe("Enter a valid email address");
    }
  });
  it("allows company, phone and product to be empty", () => {
    const r = validateEnquiry({ ...good, company: "", phone: "", product: "" }, cats);
    expect(r.ok).toBe(true);
  });
});
