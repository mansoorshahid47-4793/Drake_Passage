import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/enquiry";
import { sendEnquiry } from "@/lib/email";
import { allow } from "@/lib/rateLimit";
import { getCategories, getProductsByCategory } from "@/lib/catalog";

export async function POST(req: Request) {
  // Rate-limit key: `x-real-ip` (set by Vercel's edge network to the actual
  // client IP) wins over `x-forwarded-for` (attacker-controllable unless a
  // trusted proxy strips/overwrites it before forwarding) which wins over a
  // shared "unknown" bucket. This assumes deployment behind a trusted proxy
  // (Vercel). Running via bare `next start` with no proxy in front means
  // neither header is trustworthy, and every visitor collapses into the same
  // "unknown" bucket, making the limit effectively global rather than per-IP.
  const ip = req.headers.get("x-real-ip")?.trim() || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Try again in a few minutes or use WhatsApp." }, { status: 429 });

  let parsed: unknown;
  try { parsed = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 }); }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const body = parsed as Record<string, unknown>;

  if (body.botcheck) return NextResponse.json({ ok: true });

  const catalog = getCategories().map((c) => ({ slug: c.slug, products: getProductsByCategory(c.slug).map((p) => p.slug) }));
  const result = validateEnquiry(body, catalog);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });

  const sent = await sendEnquiry(result.value);
  if (!sent.ok) {
    console.error("enquiry delivery failed:", sent.reason);
    return NextResponse.json({ ok: false, error: "We could not send your enquiry. Please try again or message us on WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
