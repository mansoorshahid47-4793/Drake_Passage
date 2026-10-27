import type { EnquiryInput } from "@/lib/enquiry";

export const WEB3FORMS_URL = "https://api.web3forms.com/submit";

// Runs in the visitor's browser: Web3Forms' free plan rejects server-side
// submissions ("Use our API in client side ... Pro plan is required"). The
// access key is public by design; it can only deliver to the inbox it was
// created for, so it ships as a NEXT_PUBLIC_ variable.
export async function sendEnquiry(v: EnquiryInput, botcheck = ""): Promise<{ ok: true } | { ok: false; reason: string }> {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!key) return { ok: false, reason: "NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set" };

  const subject = `${v.enquiryType === "sample" ? "Sample request" : v.enquiryType === "certificate" ? "Certificate request" : "Quote request"}: ${v.category}${v.product ? ` / ${v.product}` : ""}`;
  const body = {
    access_key: key,
    subject,
    from_name: "Drake Passage website",
    botcheck,
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
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    // A blocked or failed request can come back as an HTML page, not JSON.
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    return data.success ? { ok: true } : { ok: false, reason: data.message ?? `Provider returned ${res.status}` };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return { ok: false, reason: "Provider timeout" };
    return { ok: false, reason: err instanceof Error ? err.message : "Network error" };
  } finally {
    clearTimeout(timeout);
  }
}
