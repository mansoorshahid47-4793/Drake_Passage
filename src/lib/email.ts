import type { EnquiryInput } from "@/lib/enquiry";

export async function sendEnquiry(v: EnquiryInput): Promise<{ ok: true } | { ok: false; reason: string }> {
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) return { ok: false, reason: "WEB3FORMS_ACCESS_KEY is not set" };

  const subject = `${v.enquiryType === "sample" ? "Sample request" : v.enquiryType === "certificate" ? "Certificate request" : "Quote request"}: ${v.category}${v.product ? ` / ${v.product}` : ""}`;
  const body = {
    access_key: key,
    subject,
    from_name: "Drake Passage website",
    name: v.fullName,
    email: v.email,
    company: v.company,
    phone: v.phone,
    category: v.category,
    product: v.product,
    destination: v.destination,
    quantity: v.quantity,
    trade_term: v.tradeTerm,
    message: v.message,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = (await res.json()) as { success?: boolean; message?: string };
    return data.success ? { ok: true } : { ok: false, reason: data.message ?? `Provider returned ${res.status}` };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return { ok: false, reason: "Provider timeout" };
    return { ok: false, reason: err instanceof Error ? err.message : "Network error" };
  } finally {
    clearTimeout(timeout);
  }
}
